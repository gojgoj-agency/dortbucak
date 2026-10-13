"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import db, { getPackageById, getSliderById } from "@/lib/db";
import { createSessionValue, verifySessionValue, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function requireAdmin() {
  const s = await verifySessionValue(cookies().get(SESSION_COOKIE)?.value);
  if (!s) redirect("/admin/giris");
  return s;
}

function refresh() {
  [
    "/",
    "/hac-turlari",
    "/umre-turlari",
    "/kultur-turlari",
    "/kisiye-ozel-turlar",
    "/sss",
    "/ilkelerimiz",
    "/admin/paketler",
    "/admin/slider",
    "/admin/sss",
    "/admin/ilkelerimiz",
    "/admin/kisiye-ozel",
  ].forEach((p) => revalidatePath(p));
}

// ---------- Oturum ----------
export async function loginAction(prevState, formData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  if (formData.get("web_adresi")) return { error: "İşlem doğrulanamadı." }; // bal küpü
  const admin = await db.get("SELECT * FROM admins WHERE username=?", username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }
  cookies().set(SESSION_COOKIE, await createSessionValue(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  redirect("/admin/paketler");
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/giris");
}

// ---------- Paketler ----------
const listFields = ["highlights", "included", "excluded", "itinerary", "documents", "gallery"];

export async function savePackageAction(prevState, formData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Paket adı zorunludur." };

  let slug = slugify(String(formData.get("slug") || "") || name);
  if (!slug) return { error: "Geçerli bir bağlantı oluşturulamadı." };
  const clash = await db.get("SELECT id FROM packages WHERE slug=? AND id<>?", [slug, id]);
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const num = (k) => {
    const v = String(formData.get(k) || "").trim();
    return v === "" ? null : Number(v);
  };
  const int = (k) => Number(formData.get(k) || 0) || 0;
  const txt = (k) => String(formData.get(k) || "").trim();
  const lists = {};
  for (const f of listFields) {
    lists[f] = JSON.stringify(
      formData.getAll(`${f}[]`).map((x) => String(x).trim()).filter(Boolean)
    );
  }

  const row = {
    id,
    category: ["hac", "umre", "kultur"].includes(txt("category")) ? txt("category") : "umre",
    label: txt("label"),
    name,
    slug,
    short_desc: txt("short_desc"),
    long_desc: txt("long_desc"),
    cover_image: txt("cover_image"),
    start_date: txt("start_date"),
    end_date: txt("end_date"),
    nights: int("nights"),
    days: int("days"),
    mecca_nights: int("mecca_nights"),
    medina_nights: int("medina_nights"),
    price_double: num("price_double"),
    price_triple: num("price_triple"),
    price_quad: num("price_quad"),
    currency: txt("currency") || "USD",
    quota_status: ["var", "az", "dolu"].includes(txt("quota_status")) ? txt("quota_status") : "var",
    transport_info: txt("transport_info"),
    lodging_info: txt("lodging_info"),
    guide_info: txt("guide_info"),
    notes: txt("notes"),
    pdf_file: txt("pdf_file"),
    seo_title: txt("seo_title"),
    seo_desc: txt("seo_desc"),
    featured: formData.get("featured") ? 1 : 0,
    active: formData.get("active") ? 1 : 0,
    sort_order: int("sort_order"),
    ...lists,
  };

  if (id) {
    await db.run(`UPDATE packages SET category=@category,label=@label,name=@name,slug=@slug,
      short_desc=@short_desc,long_desc=@long_desc,cover_image=@cover_image,gallery=@gallery,
      start_date=@start_date,end_date=@end_date,nights=@nights,days=@days,
      mecca_nights=@mecca_nights,medina_nights=@medina_nights,
      price_double=@price_double,price_triple=@price_triple,price_quad=@price_quad,
      currency=@currency,quota_status=@quota_status,highlights=@highlights,included=@included,
      excluded=@excluded,transport_info=@transport_info,lodging_info=@lodging_info,
      guide_info=@guide_info,itinerary=@itinerary,documents=@documents,notes=@notes,
      pdf_file=@pdf_file,seo_title=@seo_title,seo_desc=@seo_desc,featured=@featured,
      active=@active,sort_order=@sort_order WHERE id=@id`, row);
  } else {
    delete row.id;
    await db.run(`INSERT INTO packages (category,label,name,slug,short_desc,long_desc,cover_image,gallery,
      start_date,end_date,nights,days,mecca_nights,medina_nights,price_double,price_triple,price_quad,
      currency,quota_status,highlights,included,excluded,transport_info,lodging_info,guide_info,
      itinerary,documents,notes,pdf_file,seo_title,seo_desc,featured,active,sort_order)
      VALUES (@category,@label,@name,@slug,@short_desc,@long_desc,@cover_image,@gallery,
      @start_date,@end_date,@nights,@days,@mecca_nights,@medina_nights,@price_double,@price_triple,@price_quad,
      @currency,@quota_status,@highlights,@included,@excluded,@transport_info,@lodging_info,@guide_info,
      @itinerary,@documents,@notes,@pdf_file,@seo_title,@seo_desc,@featured,@active,@sort_order)`, row);
  }
  refresh();
  redirect("/admin/paketler?kayit=1");
}

export async function deletePackageAction(formData) {
  await requireAdmin();
  await db.run("DELETE FROM packages WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function duplicatePackageAction(formData) {
  await requireAdmin();
  const p = await getPackageById(Number(formData.get("id")));
  if (!p) return;
  const copy = { ...p };
  delete copy.id;
  copy.name = `${p.name} (Kopya)`;
  copy.slug = `${p.slug}-kopya-${Date.now().toString(36)}`;
  copy.active = 0;
  const cols = Object.keys(copy);
  await db.run(
    `INSERT INTO packages (${cols.join(",")}) VALUES (${cols.map((c) => "@" + c).join(",")})`,
    copy
  );
  refresh();
}

export async function togglePackageAction(formData) {
  await requireAdmin();
  const field = formData.get("field") === "featured" ? "featured" : "active";
  await db.run(`UPDATE packages SET ${field} = 1 - ${field} WHERE id=?`, Number(formData.get("id")));
  refresh();
}

export async function movePackageAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const p = await getPackageById(id);
  if (!p) return;
  const list = await db.all(
    "SELECT id FROM packages WHERE category=? ORDER BY sort_order ASC, start_date ASC",
    p.category
  );
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await db.batch(
    list.map((x, k) => ({
      sql: "UPDATE packages SET sort_order=? WHERE id=?",
      args: [k + 1, x.id],
    }))
  );
  refresh();
}

const faqGruplari = ["program", "fiyat", "evrak"];
const ilkeIkonlari = ["Heart", "BookOpen", "ClipboardCheck", "Headphones", "Users"];
const ozelIkonlar = ["CalendarRange", "Users", "Route", "Hotel", "Compass", "MapPin", "Heart", "Phone"];

export async function saveFaqAction(prevState, formData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  if (!question || !answer) return { error: "Soru ve cevap zorunludur." };
  const group = String(formData.get("group_key") || "");
  const row = {
    id,
    group_key: faqGruplari.includes(group) ? group : "program",
    question,
    answer,
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    featured: formData.get("featured") ? 1 : 0,
    active: formData.get("active") ? 1 : 0,
  };
  if (id) {
    await db.run(`UPDATE faqs SET group_key=@group_key, question=@question, answer=@answer,
      sort_order=@sort_order, featured=@featured, active=@active WHERE id=@id`, row);
  } else {
    delete row.id;
    await db.run(`INSERT INTO faqs (group_key, question, answer, sort_order, featured, active)
      VALUES (@group_key, @question, @answer, @sort_order, @featured, @active)`, row);
  }
  refresh();
  redirect("/admin/sss?kayit=1");
}

export async function deleteFaqAction(formData) {
  await requireAdmin();
  await db.run("DELETE FROM faqs WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function toggleFaqAction(formData) {
  await requireAdmin();
  const field = formData.get("field") === "featured" ? "featured" : "active";
  await db.run(`UPDATE faqs SET ${field} = 1 - ${field} WHERE id=?`, Number(formData.get("id")));
  refresh();
}

export async function moveFaqAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const list = await db.all("SELECT id FROM faqs ORDER BY sort_order ASC, id ASC");
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await db.batch(list.map((x, k) => ({ sql: "UPDATE faqs SET sort_order=? WHERE id=?", args: [k + 1, x.id] })));
  refresh();
}

export async function savePrincipleAction(prevState, formData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title || !body) return { error: "Başlık ve metin zorunludur." };
  const icon = String(formData.get("icon") || "");
  const row = {
    id,
    icon: ilkeIkonlari.includes(icon) ? icon : "Heart",
    title,
    body,
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    active: formData.get("active") ? 1 : 0,
  };
  if (id) {
    await db.run(`UPDATE principles SET icon=@icon, title=@title, body=@body,
      sort_order=@sort_order, active=@active WHERE id=@id`, row);
  } else {
    delete row.id;
    await db.run(`INSERT INTO principles (icon, title, body, sort_order, active)
      VALUES (@icon, @title, @body, @sort_order, @active)`, row);
  }
  refresh();
  redirect("/admin/ilkelerimiz?kayit=1");
}

export async function deletePrincipleAction(formData) {
  await requireAdmin();
  await db.run("DELETE FROM principles WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function togglePrincipleAction(formData) {
  await requireAdmin();
  await db.run("UPDATE principles SET active = 1 - active WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function movePrincipleAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const list = await db.all("SELECT id FROM principles ORDER BY sort_order ASC, id ASC");
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await db.batch(list.map((x, k) => ({ sql: "UPDATE principles SET sort_order=? WHERE id=?", args: [k + 1, x.id] })));
  refresh();
}

export async function saveCustomPageAction(prevState, formData) {
  await requireAdmin();
  const row = {
    lead: String(formData.get("lead") || "").trim(),
    body_1: String(formData.get("body_1") || "").trim(),
    body_2: String(formData.get("body_2") || "").trim(),
    cover_image: String(formData.get("cover_image") || "").trim(),
    side_image: String(formData.get("side_image") || "").trim(),
  };
  if (!row.lead || !row.body_1) return { error: "Kapak açıklaması ve ilk paragraf zorunludur." };
  await db.run(`INSERT INTO custom_page (id, lead, body_1, body_2, cover_image, side_image)
    VALUES (1, @lead, @body_1, @body_2, @cover_image, @side_image)
    ON CONFLICT(id) DO UPDATE SET
      lead=excluded.lead, body_1=excluded.body_1, body_2=excluded.body_2,
      cover_image=excluded.cover_image, side_image=excluded.side_image`, row);
  refresh();
  redirect("/admin/kisiye-ozel?kayit=sayfa");
}

export async function saveCustomPointAction(prevState, formData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title || !body) return { error: "Başlık ve metin zorunludur." };
  const icon = String(formData.get("icon") || "");
  const row = {
    id,
    icon: ozelIkonlar.includes(icon) ? icon : "CalendarRange",
    title,
    body,
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    active: formData.get("active") ? 1 : 0,
  };
  if (id) {
    await db.run(`UPDATE custom_points SET icon=@icon, title=@title, body=@body,
      sort_order=@sort_order, active=@active WHERE id=@id`, row);
  } else {
    delete row.id;
    await db.run(`INSERT INTO custom_points (icon, title, body, sort_order, active)
      VALUES (@icon, @title, @body, @sort_order, @active)`, row);
  }
  refresh();
  redirect("/admin/kisiye-ozel?kayit=1");
}

export async function deleteCustomPointAction(formData) {
  await requireAdmin();
  await db.run("DELETE FROM custom_points WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function toggleCustomPointAction(formData) {
  await requireAdmin();
  await db.run("UPDATE custom_points SET active = 1 - active WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function moveCustomPointAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const list = await db.all("SELECT id FROM custom_points ORDER BY sort_order ASC, id ASC");
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await db.batch(list.map((x, k) => ({ sql: "UPDATE custom_points SET sort_order=? WHERE id=?", args: [k + 1, x.id] })));
  refresh();
}

// ---------- Slider ----------
export async function saveSliderAction(prevState, formData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Ana başlık zorunludur." };
  const row = {
    id,
    image_desktop: String(formData.get("image_desktop") || "").trim(),
    image_mobile: String(formData.get("image_mobile") || "").trim(),
    kicker: String(formData.get("kicker") || "").trim(),
    title,
    description: String(formData.get("description") || "").trim(),
    button_text: String(formData.get("button_text") || "").trim(),
    button_link: String(formData.get("button_link") || "").trim(),
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    active: formData.get("active") ? 1 : 0,
  };
  if (id) {
    await db.run(`UPDATE sliders SET image_desktop=@image_desktop,image_mobile=@image_mobile,
      kicker=@kicker,title=@title,description=@description,button_text=@button_text,
      button_link=@button_link,sort_order=@sort_order,active=@active WHERE id=@id`, row);
  } else {
    delete row.id;
    await db.run(`INSERT INTO sliders (image_desktop,image_mobile,kicker,title,description,button_text,button_link,sort_order,active)
      VALUES (@image_desktop,@image_mobile,@kicker,@title,@description,@button_text,@button_link,@sort_order,@active)`, row);
  }
  refresh();
  redirect("/admin/slider?kayit=1");
}

export async function deleteSliderAction(formData) {
  await requireAdmin();
  await db.run("DELETE FROM sliders WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function toggleSliderAction(formData) {
  await requireAdmin();
  await db.run("UPDATE sliders SET active = 1 - active WHERE id=?", Number(formData.get("id")));
  refresh();
}

export async function moveSliderAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const list = await db.all("SELECT id FROM sliders ORDER BY sort_order ASC");
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await db.batch(
    list.map((x, k) => ({
      sql: "UPDATE sliders SET sort_order=? WHERE id=?",
      args: [k + 1, x.id],
    }))
  );
  refresh();
}

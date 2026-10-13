import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { sorular } from "./faq";

const url = process.env.TURSO_DATABASE_URL;
if (!url) throw new Error("TURSO_DATABASE_URL tanımlı değil.");

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schema = `
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  label TEXT DEFAULT '',
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT DEFAULT '',
  long_desc TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  gallery TEXT DEFAULT '[]',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  nights INTEGER DEFAULT 0,
  days INTEGER DEFAULT 0,
  mecca_nights INTEGER DEFAULT 0,
  medina_nights INTEGER DEFAULT 0,
  price_double REAL,
  price_triple REAL,
  price_quad REAL,
  currency TEXT DEFAULT 'USD',
  quota_status TEXT DEFAULT 'var',
  highlights TEXT DEFAULT '[]',
  included TEXT DEFAULT '[]',
  excluded TEXT DEFAULT '[]',
  transport_info TEXT DEFAULT '',
  lodging_info TEXT DEFAULT '',
  guide_info TEXT DEFAULT '',
  itinerary TEXT DEFAULT '[]',
  documents TEXT DEFAULT '[]',
  notes TEXT DEFAULT '',
  pdf_file TEXT DEFAULT '',
  seo_title TEXT DEFAULT '',
  seo_desc TEXT DEFAULT '',
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sliders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_desktop TEXT DEFAULT '',
  image_mobile TEXT DEFAULT '',
  kicker TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  button_text TEXT DEFAULT '',
  button_link TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_key TEXT NOT NULL DEFAULT 'program',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS principles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL DEFAULT 'Heart',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS custom_page (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  lead TEXT DEFAULT '',
  body_1 TEXT DEFAULT '',
  body_2 TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  side_image TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS custom_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL DEFAULT 'CalendarRange',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1
);
`;

function plain(row, columns) {
  const obj = {};
  for (let i = 0; i < columns.length; i++) {
    const value = row[i];
    obj[columns[i]] = typeof value === "bigint" ? Number(value) : value;
  }
  return obj;
}

function argsOf(args) {
  if (args == null) return [];
  if (Array.isArray(args) || typeof args === "object") return args;
  return [args];
}

async function query(sql, args) {
  const res = await client.execute({ sql, args: argsOf(args) });
  return res.rows.map((row) => plain(row, res.columns));
}

let ready;
function ensureReady() {
  if (!ready) {
    ready = (async () => {
      await client.executeMultiple(schema);
      const admins = await query("SELECT COUNT(*) AS c FROM admins");
      if (Number(admins[0].c) === 0) {
        const username = process.env.ADMIN_USERNAME || "admin";
        const password = process.env.ADMIN_PASSWORD || "dortbucak-gecici-sifre";
        await client.execute({
          sql: "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
          args: [username, bcrypt.hashSync(password, 10)],
        });
      }
      const packages = await query("SELECT COUNT(*) AS c FROM packages");
      if (Number(packages[0].c) === 0) await seed();
      await dortbucakPaketleriniKur();
      await fotoYollariniDuzelt();
      await vitrinSliderlariniTamamla();
      await icerikTablolariniDoldur();
    })().catch((error) => {
      ready = undefined;
      throw error;
    });
  }
  return ready;
}

const db = {
  async get(sql, args) {
    await ensureReady();
    const rows = await query(sql, args);
    return rows[0];
  },
  async all(sql, args) {
    await ensureReady();
    return query(sql, args);
  },
  async run(sql, args) {
    await ensureReady();
    return client.execute({ sql, args: argsOf(args) });
  },
  async batch(statements) {
    await ensureReady();
    return client.batch(statements, "write");
  },
};

const insertSql = `INSERT INTO packages
    (category,label,name,slug,short_desc,long_desc,cover_image,gallery,start_date,end_date,
     nights,days,mecca_nights,medina_nights,price_double,price_triple,price_quad,currency,
     quota_status,highlights,included,excluded,transport_info,lodging_info,guide_info,
     itinerary,documents,notes,featured,active,sort_order)
    VALUES (@category,@label,@name,@slug,@short_desc,@long_desc,@cover_image,@gallery,@start_date,@end_date,
     @nights,@days,@mecca_nights,@medina_nights,@price_double,@price_triple,@price_quad,@currency,
     @quota_status,@highlights,@included,@excluded,@transport_info,@lodging_info,@guide_info,
     @itinerary,@documents,@notes,@featured,@active,@sort_order)`;

function umrePaketi({ label, name, slug, cover, fiyat, ramazan, sort }) {
  const oda = ramazan ? 100 : 75;
  const not =
    `14 günlük programdır. Fiyat 4 kişilik odada kişi başıdır. 3 ve 2 kişilik odalarda kişi başı ${oda} $ eklenir. ` +
    "Çıkış tarihi döneme göre değişir. Vize, pasaport ve sağlık şartları değişebilir; güncel bilgi kayıt sırasında paylaşılır.";
  return {
    category: "umre",
    label,
    name,
    slug,
    cover_image: cover,
    short_desc: `14 günlük ${label} umre programı. 4 kişilik odada kişi başı ${fiyat} $.`,
    long_desc:
      `${label} döneminde düzenlenen 14 günlük umre programıdır. Mekke ve Medine’de konaklanır; ` +
      "yolculuk boyunca din görevlisi ve rehber eşlik eder. Güncel çıkış tarihi için bizimle iletişime geçin.",
    start_date: "",
    end_date: "",
    nights: 13,
    days: 14,
    mecca_nights: 0,
    medina_nights: 0,
    price_double: fiyat + oda,
    price_triple: fiyat + oda,
    price_quad: fiyat,
    currency: "USD",
    quota_status: "var",
    highlights: ["14 gün", "Mekke ve Medine", `4 kişilik odada ${fiyat} $`],
    transport_info: "Gidiş-dönüş ulaşım ve şehirler arası transferler programa dahildir. Uçuş ayrıntıları kayıt sırasında paylaşılır.",
    lodging_info: "Konaklama Mekke ve Medine’dedir. 4 kişilik oda fiyatı ilan edilmiştir; 3 ve 2 kişilik oda farkı kayıtta uygulanır.",
    guide_info: "Yolculuk boyunca deneyimli din görevlisi ve rehber eşlik eder.",
    itinerary: [
      "Hareket ve Medine’ye varış",
      "Medine’de Mescid-i Nebevî ziyaretleri",
      "Mekke’ye geçiş ve umre ibadeti",
      "Mekke’de ibadet ve ziyaret programı",
      "Veda tavafı ve dönüş",
    ],
    notes: not,
    featured: 1,
    sort_order: sort,
  };
}

function paketKayitlari() {
  const belgeler = [
    "Geçerli pasaport",
    "Biyometrik fotoğraf",
    "Vize için gerekli belgeler (başvuru sırasında bildirilir)",
  ];
  const dahilOrtak = [
    "Gidiş–dönüş ulaşım",
    "Mekke ve Medine konaklama",
    "Rehberlik hizmeti",
    "Şehirler arası transferler",
  ];
  const haricOrtak = ["Kişisel harcamalar", "Pasaport işlemleri"];
  const umreler = [
    umrePaketi({
      label: "Ekim – Kasım",
      name: "Ekim – Kasım Umresi",
      slug: "ekim-kasim-umresi",
      cover: "/images/paket-umre-1.webp",
      fiyat: 1450,
      ramazan: false,
      sort: 1,
    }),
    umrePaketi({
      label: "Aralık – Ocak",
      name: "Aralık – Ocak Umresi",
      slug: "aralik-ocak-umresi",
      cover: "/images/paket-umre-2.webp",
      fiyat: 1550,
      ramazan: false,
      sort: 2,
    }),
    umrePaketi({
      label: "Yarı Ramazan",
      name: "Yarı Ramazan Umresi",
      slug: "yari-ramazan-umresi",
      cover: "/images/paket-umre-3.webp",
      fiyat: 1600,
      ramazan: true,
      sort: 3,
    }),
    umrePaketi({
      label: "Tam Ramazan",
      name: "Tam Ramazan Umresi",
      slug: "tam-ramazan-umresi",
      cover: "/images/paket-hac-2.webp",
      fiyat: 1900,
      ramazan: true,
      sort: 4,
    }),
  ];
  const hac = {
    category: "hac",
    label: "Hac",
    name: "Hac Programı",
    slug: "hac-programi",
    cover_image: "/images/paket-hac-1.webp",
    short_desc: "Hac mevsiminde Mekke ve Medine konaklamalı program. Güncel tarih ve ücret için bize ulaşın.",
    long_desc:
      "Hac programımız, hac mevsiminde Mekke ve Medine konaklamasıyla planlanır. Kayıtlar resmî mevzuata tabidir; " +
      "güncel şartlar, tarih ve ücret için Ankara ofisimizle iletişime geçin.",
    start_date: "",
    end_date: "",
    nights: 0,
    days: 0,
    mecca_nights: 0,
    medina_nights: 0,
    price_double: null,
    price_triple: null,
    price_quad: null,
    currency: "USD",
    quota_status: "var",
    highlights: ["Rehber ve din görevlisi", "Mekke ve Medine", "Kayıt için bilgi alın"],
    transport_info: "Ulaşım ve transfer bilgisi kayıt sırasında paylaşılır.",
    lodging_info: "Konaklama ve Mina, Arafat düzeni kayıt sırasında anlatılır.",
    guide_info: "Hac boyunca din görevlileri eşlik eder; menasik bilgilendirmesi yolculuk öncesinde yapılır.",
    itinerary: [
      "Hareket ve Mekke’ye varış",
      "Mekke’de hazırlık ve ibadet",
      "Arafat, Müzdelife ve Mina günleri",
      "Bayram ve tavaf ibadetleri",
      "Medine ziyareti ve dönüş",
    ],
    notes: "Hac kayıtları resmî mevzuata tabidir. Tarih, süre ve ücret dönem açıklanınca paylaşılır.",
    featured: 1,
    sort_order: 1,
  };
  return [...umreler, hac].map((p) => ({
    sql: insertSql,
    args: {
      ...p,
      gallery: JSON.stringify([p.cover_image]),
      highlights: JSON.stringify(p.highlights),
      included: JSON.stringify(dahilOrtak),
      excluded: JSON.stringify(haricOrtak),
      itinerary: JSON.stringify(p.itinerary),
      documents: JSON.stringify(belgeler),
      active: 1,
    },
  }));
}

async function seed() {
  const olan = new Set((await query("SELECT slug FROM packages")).map((p) => p.slug));
  const paketler = paketKayitlari().filter((kayit) => !olan.has(kayit.args.slug));
  const sliderlar = await query("SELECT COUNT(*) AS c FROM sliders");
  if (!paketler.length && Number(sliderlar[0]?.c || 0) > 0) return;
  const sliderSql = `INSERT INTO sliders
      (image_desktop,image_mobile,kicker,title,description,button_text,button_link,sort_order,active)
      VALUES (?,?,?,?,?,?,?,?,1)`;
  const statements = [
    ...paketler,
    {
      sql: sliderSql,
      args: [
        "/images/slider-1-masaustu.webp", "/images/slider-1-mobil.webp", "Dört Bucak Tur",
        "Türkiye'nin her yerinden",
        "10, 14, 20 gün ya da daha uzun süreli umre programlarımız için bize ulaşın.",
        "Umre Turlarını İncele", "/umre-turlari", 1,
      ],
    },
    {
      sql: sliderSql,
      args: [
        "/images/slider-2-masaustu.webp", "/images/slider-2-mobil.webp", "Dört Bucak Tur",
        "Hac hazırlığında yanınızdayız",
        "Kayıt şartları ve program seçenekleri için Ankara ofisimizle görüşün.",
        "Hac Programlarını İncele", "/hac-turlari", 2,
      ],
    },
    {
      sql: sliderSql,
      args: [
        "/images/paket-hac-3.webp", "/images/paket-hac-3.webp", "Dört Bucak Tur",
        "Tarihe ve doğaya yolculuk",
        "Tarihi keşif, doğayla iç içe rotalar ve kültürel deneyim. Programı birlikte seçmek için bize ulaşın.",
        "Kültür Turlarını İncele", "/kultur-turlari", 3,
      ],
    },
    {
      sql: sliderSql,
      args: [
        "/images/paket-umre-3.webp", "/images/paket-umre-3.webp", "Dört Bucak Tur",
        "Yolculuğunuz size göre şekillensin",
        "Tarih, süre ve güzergâhı birlikte belirlediğimiz kişiye özel programlar için bize ulaşın.",
        "Kişiye Özel Turlar", "/kisiye-ozel-turlar", 4,
      ],
    },
  ];
  await client.batch(statements, "write");
}

const eskiSablonSluglari = [
  "ekonomik-umre-programi",
  "standart-umre-programi",
  "genclik-umresi-programi",
  "ekonomik-hac-programi",
  "standart-hac-programi",
  "premium-hac-programi",
];

async function dortbucakPaketleriniKur() {
  const mevcut = await query("SELECT id FROM packages WHERE slug = ?", "ekim-kasim-umresi");
  if (!mevcut.length) {
    await client.execute({
      sql: `DELETE FROM packages WHERE slug IN (${eskiSablonSluglari.map(() => "?").join(",")})`,
      args: eskiSablonSluglari,
    });
    const olan = new Set((await query("SELECT slug FROM packages")).map((p) => p.slug));
    const eklenecek = paketKayitlari().filter((kayit) => !olan.has(kayit.args.slug));
    if (eklenecek.length) await client.batch(eklenecek, "write");
  }
  try {
    await client.execute({
      sql: `UPDATE sliders SET title = ?, description = ? WHERE title = ?`,
      args: [
        "Türkiye'nin her yerinden",
        "10, 14, 20 gün ya da daha uzun süreli umre programlarımız için bize ulaşın.",
        "Ankara'dan kutsal topraklara",
      ],
    });
    await client.execute({
      sql: "UPDATE sliders SET kicker = ? WHERE kicker = ?",
      args: ["Dört Bucak Tur", "Hac Programları"],
    });
    await client.execute({
      sql: "UPDATE sliders SET button_text = ? WHERE button_text = ?",
      args: ["Hac Programlarını İncele"],
    });
  } catch (error) {
    console.error("Slider metni güncellenemedi:", error.message);
  }
}

// ---------- Yardımcılar ----------
export { parseJson } from "./json";

export async function getPackages({ category, onlyActive = true, featured = false } = {}) {
  let q = "SELECT * FROM packages WHERE 1=1";
  const args = [];
  if (onlyActive) q += " AND active=1";
  if (category) { q += " AND category=?"; args.push(category); }
  if (featured) q += " AND featured=1";
  q += " ORDER BY sort_order ASC, start_date ASC";
  return db.all(q, args);
}

export const getPackageBySlug = (slug) =>
  db.get("SELECT * FROM packages WHERE slug=?", slug);
export const getPackageById = (id) =>
  db.get("SELECT * FROM packages WHERE id=?", id);

async function fotoYollariniDuzelt() {
  await client.execute(`
    UPDATE sliders SET
      image_desktop = REPLACE(REPLACE(image_desktop, 'slider-1.svg', 'slider-1-masaustu.webp'), 'slider-2.svg', 'slider-2-masaustu.webp'),
      image_mobile = REPLACE(REPLACE(image_mobile, 'slider-1.svg', 'slider-1-mobil.webp'), 'slider-2.svg', 'slider-2-mobil.webp')
    WHERE image_desktop LIKE '%.svg' OR image_mobile LIKE '%.svg'
  `);
  await client.execute(`
    UPDATE packages SET
      cover_image = REPLACE(cover_image, '.svg', '.webp'),
      gallery = REPLACE(gallery, '.svg', '.webp')
    WHERE cover_image LIKE '%.svg' OR gallery LIKE '%.svg'
  `);
}

async function vitrinSliderlariniTamamla() {
  const rows = await query("SELECT id, button_link, active, sort_order FROM sliders");
  const links = rows.map((r) => String(r.button_link || ""));
  const maxRow = await query("SELECT COALESCE(MAX(sort_order), 0) AS m FROM sliders");
  let sira = Number(maxRow[0]?.m || 0);
  const sql = `INSERT INTO sliders
      (image_desktop,image_mobile,kicker,title,description,button_text,button_link,sort_order,active)
      VALUES (?,?,?,?,?,?,?,?,1)`;
  const adaylar = [
    {
      anahtar: "kultur-turlari",
      args: [
        "/images/paket-hac-3.webp", "/images/paket-hac-3.webp", "Dört Bucak Tur",
        "Tarihe ve doğaya yolculuk",
        "Tarihi keşif, doğayla iç içe rotalar ve kültürel deneyim. Programı birlikte seçmek için bize ulaşın.",
        "Kültür Turlarını İncele", "/kultur-turlari",
      ],
    },
    {
      anahtar: "kisiye-ozel-turlar",
      args: [
        "/images/paket-umre-3.webp", "/images/paket-umre-3.webp", "Dört Bucak Tur",
        "Yolculuğunuz size göre şekillensin",
        "Tarih, süre ve güzergâhı birlikte belirlediğimiz kişiye özel programlar için bize ulaşın.",
        "Kişiye Özel Turlar", "/kisiye-ozel-turlar",
      ],
    },
  ];
  const statements = [];
  for (const aday of adaylar) {
    if (links.some((l) => l.includes(aday.anahtar))) continue;
    sira += 1;
    statements.push({ sql, args: [...aday.args, sira] });
  }
  if (statements.length) await client.batch(statements, "write");
  await client.execute({
    sql: `UPDATE sliders SET image_desktop = ?, image_mobile = ? WHERE button_link = ? AND image_desktop LIKE '%kultur-manzara%'`,
    args: ["/images/paket-hac-3.webp", "/images/paket-hac-3.webp", "/kultur-turlari"],
  });
}

const faqGrup = ["evrak", "program", "fiyat", "fiyat", "fiyat", "evrak", "program", "program", "program", "evrak", "program", "fiyat", "evrak", "program", "program"];
const faqOneCikan = new Set([1, 3, 6]);

async function icerikTablolariniDoldur() {
  const mevcutFaq = new Set((await query("SELECT question FROM faqs")).map((r) => r.question));
  const faqEkle = sorular
    .map(([question, answer], i) => ({ question, answer, i }))
    .filter((r) => !mevcutFaq.has(r.question));
  if (faqEkle.length) {
    await client.batch(
      faqEkle.map(({ question, answer, i }) => ({
        sql: "INSERT INTO faqs (group_key, question, answer, sort_order, featured, active) VALUES (?, ?, ?, ?, ?, 1)",
        args: [faqGrup[i] || "program", question, answer, i + 1, faqOneCikan.has(i) ? 1 : 0],
      })),
      "write"
    );
  }
  const mevcutIlke = new Set((await query("SELECT title FROM principles")).map((r) => r.title));
  const ilkeSatirlari = [
    ["Heart", "Manevi Hassasiyet", "İbadetlerin huzurunu ve kutsal mekânların manevi değerini gözetiriz."],
    ["BookOpen", "Doğru Rehberlik", "Bilgi ve ibadet süreçlerinde ehil din görevlileri ve rehberlerle hareket ederiz."],
    ["ClipboardCheck", "Titiz Organizasyon", "Ulaşımdan konaklamaya, programdan ziyaretlere kadar her ayrıntıyı planlarız."],
    ["Headphones", "Kesintisiz Destek", "Yolculuğun her aşamasında misafirlerimizin yanında oluruz."],
    ["Users", "Misafir Memnuniyeti", "Her misafirimizi bir müşteri değil, emanetimiz olarak görürüz."],
  ].filter((row) => !mevcutIlke.has(row[1]));
  if (ilkeSatirlari.length) {
    await client.batch(
      ilkeSatirlari.map((args) => ({
        sql: "INSERT INTO principles (icon, title, body, sort_order, active) VALUES (?, ?, ?, ?, 1)",
        args: [...args, args[1] === "Manevi Hassasiyet" ? 1 : args[1] === "Doğru Rehberlik" ? 2 : args[1] === "Titiz Organizasyon" ? 3 : args[1] === "Kesintisiz Destek" ? 4 : 5],
      })),
      "write"
    );
  }
  const sayfa = await query("SELECT id FROM custom_page WHERE id=1");
  if (!sayfa.length) {
    await client.execute({
      sql: `INSERT INTO custom_page (id, lead, body_1, body_2, cover_image, side_image) VALUES (1, ?, ?, ?, ?, ?)`,
      args: [
        "Hazır bir tarih listesine bağlı kalmadan; süre, grup ve güzergâhı birlikte kurduğumuz programlar.",
        "Kişiye özel turlarda çıkış günü, süre ve duraklar sizin takviminize göre belirlenir. Aile, arkadaş grubu veya kurum için ayrı bir program hazırlarız; dahil olan ve olmayan hizmetleri kayıttan önce yazılı olarak paylaşırız.",
        "Rota hac, umre ya da kültür duraklarından kurulabilir. Hazır programlarımızı da inceleyebilir, size uyan tarihi birlikte seçebilirsiniz.",
        "/images/slider-2-masaustu.webp",
        "/images/paket-umre-3.webp",
      ],
    });
  }
  const mevcutOzel = new Set((await query("SELECT title FROM custom_points")).map((r) => r.title));
  const ozelSatirlar = [
    ["CalendarRange", "Tarih ve süre", "Çıkış gününü ve programın kaç gün süreceğini birlikte belirleriz.", 1],
    ["Users", "Grup yapısı", "Aile, arkadaş grubu ya da kurum gezisi için kontenjanı baştan netleştiririz.", 2],
    ["Route", "Güzergâh", "Duraklar hac, umre ya da kültür rotalarından, size uygun sırayla kurulur.", 3],
    ["Hotel", "Konaklama", "Oda tipi ve konaklama tercihini kayıt öncesinde yazılı olarak paylaşırız.", 4],
  ].filter((row) => !mevcutOzel.has(row[1]));
  if (ozelSatirlar.length) {
    await client.batch(
      ozelSatirlar.map((args) => ({
        sql: "INSERT INTO custom_points (icon, title, body, sort_order, active) VALUES (?, ?, ?, ?, 1)",
        args,
      })),
      "write"
    );
  }
  await client.execute(`DELETE FROM custom_points WHERE id NOT IN (SELECT MIN(id) FROM custom_points GROUP BY title)`);
}

export async function getSliders(onlyActive = true) {
  const kosul = onlyActive ? "WHERE active=1 AND TRIM(COALESCE(image_desktop, '')) != ''" : "";
  return db.all(
    `SELECT id, image_desktop, image_mobile, kicker, title, description, button_text, button_link, sort_order, active
     FROM sliders ${kosul} ORDER BY sort_order ASC, id ASC`
  );
}
export const getSliderById = (id) =>
  db.get(
    `SELECT id, image_desktop, image_mobile, kicker, title, description, button_text, button_link, sort_order, active
     FROM sliders WHERE id=?`,
    id
  );


export function getFaqs(onlyActive = true) {
  noStore();
  const kosul = onlyActive ? "WHERE active=1" : "";
  return db.all(`SELECT * FROM faqs ${kosul} ORDER BY sort_order ASC, id ASC`);
}
export function getFaqById(id) {
  noStore();
  return db.get("SELECT * FROM faqs WHERE id=?", id);
}

export function getPrinciples(onlyActive = true) {
  noStore();
  const kosul = onlyActive ? "WHERE active=1" : "";
  return db.all(`SELECT * FROM principles ${kosul} ORDER BY sort_order ASC, id ASC`);
}
export function getPrincipleById(id) {
  noStore();
  return db.get("SELECT * FROM principles WHERE id=?", id);
}

export async function getCustomPage() {
  return (await db.get("SELECT * FROM custom_page WHERE id=1")) || {
    lead: "",
    body_1: "",
    body_2: "",
    cover_image: "",
    side_image: "",
  };
}

export async function getCustomPoints(onlyActive = true) {
  const kosul = onlyActive ? "WHERE active=1" : "";
  const rows = await db.all(`SELECT * FROM custom_points ${kosul} ORDER BY sort_order ASC, id ASC`);
  const seen = new Set();
  const extras = [];
  const unique = [];
  for (const row of rows) {
    if (seen.has(row.title)) extras.push(row.id);
    else {
      seen.add(row.title);
      unique.push(row);
    }
  }
  if (extras.length) {
    await db.run(`DELETE FROM custom_points WHERE id IN (${extras.map(() => "?").join(",")})`, extras);
  }
  return unique;
}
export const getCustomPointById = (id) => db.get("SELECT * FROM custom_points WHERE id=?", id);

export default db;

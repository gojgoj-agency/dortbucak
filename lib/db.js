import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

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
  const sliderSql = `INSERT INTO sliders
      (image_desktop,image_mobile,kicker,title,description,button_text,button_link,sort_order,active)
      VALUES (?,?,?,?,?,?,?,?,1)`;
  const statements = [
    ...paketKayitlari(),
    {
      sql: sliderSql,
      args: [
        "/images/slider-1-masaustu.webp", "/images/slider-1-mobil.webp", "Dört Bucak Tur",
        "Ankara'dan kutsal topraklara",
        "14 günlük umre programlarımız ve dönem fiyatları için bize ulaşın.",
        "Umre Turlarını İncele", "/umre-turlari", 1,
      ],
    },
    {
      sql: sliderSql,
      args: [
        "/images/slider-2-masaustu.webp", "/images/slider-2-mobil.webp", "Hac Programları",
        "Hac hazırlığında yanınızdayız",
        "Kayıt şartları ve program seçenekleri için Ankara ofisimizle görüşün.",
        "Hac Turlarını İncele", "/hac-turlari", 2,
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
    await client.batch(paketKayitlari(), "write");
  }
  await client.execute({
    sql: `UPDATE sliders SET kicker = ?, title = ?, description = ?
          WHERE kicker = ? OR title LIKE ?`,
    args: [
      "Dört Bucak Tur",
      "Ankara'dan kutsal topraklara",
      "14 günlük umre programlarımız ve dönem fiyatları için bize ulaşın.",
      "İsabet Turizm",
      "%İsabet%",
    ],
  });
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

export function getSliders(onlyActive = true) {
  return db.all(`SELECT * FROM sliders ${onlyActive ? "WHERE active=1" : ""} ORDER BY sort_order ASC`);
}
export const getSliderById = (id) => db.get("SELECT * FROM sliders WHERE id=?", id);

export default db;

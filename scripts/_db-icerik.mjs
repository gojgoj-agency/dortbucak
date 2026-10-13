import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")];
    })
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
const faqs = await db.execute("SELECT id, group_key, substr(question,1,60) AS q, featured, active FROM faqs ORDER BY sort_order, id");
const principles = await db.execute("SELECT id, icon, title, active FROM principles ORDER BY sort_order, id");
console.log(JSON.stringify({
  faq: faqs.rows.length,
  faqs: faqs.rows,
  principle: principles.rows.length,
  principles: principles.rows,
}, null, 2));

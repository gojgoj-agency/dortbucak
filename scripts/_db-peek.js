import { readFileSync } from "fs";
import { createClient } from "@libsql/client";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    })
);
const client = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
const res = await client.execute("SELECT COUNT(*) AS c FROM packages");
const row = res.rows[0];
console.log("columns", res.columns);
console.log("row type", typeof row, Array.isArray(row), row?.constructor?.name);
console.log("row0", row?.[0], "row.c", row?.c, "keys", row ? Object.keys(row) : null);
console.log("json", JSON.stringify(row));
const slugs = await client.execute("SELECT slug, category FROM packages ORDER BY sort_order");
console.log("slug count", slugs.rows.length);
for (const r of slugs.rows) console.log("-", r.slug || r[0], r.category || r[1]);

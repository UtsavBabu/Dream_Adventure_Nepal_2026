import pg from "pg";
import fs from "fs";

// Load .env manually (no dotenv dependency needed)
const envPath = ".env";
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const sep = trimmed.indexOf("=");
      if (sep > 0) {
        let value = trimmed.slice(sep + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[trimmed.slice(0, sep).trim()] = value;
      }
    }
  }
}

const sqlFile = process.env.SQL_FILE || "supabase/full-setup.sql";
const sql = fs.readFileSync(sqlFile, "utf8");
const password = process.env.SUPABASE_DB_PASSWORD;
const projectId = process.env.SUPABASE_PROJECT_ID;

if (!password) {
  console.error("Missing SUPABASE_DB_PASSWORD env var");
  process.exit(1);
}
if (!projectId) {
  console.error("Missing SUPABASE_PROJECT_ID env var");
  process.exit(1);
}

const host = `db.${projectId}.supabase.co`;

const urls = [
  `postgresql://postgres:${encodeURIComponent(password)}@${host}:5432/postgres`,
  `postgresql://postgres.${projectId}:${encodeURIComponent(password)}@${host}:6543/postgres?pgbouncer=true`,
  `postgresql://postgres.${projectId}:${encodeURIComponent(password)}@${host}:5432/postgres`,
];

for (const url of urls) {
  console.log(`Trying: ${url.replace(password, "***")}`);
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    await client.connect();
    console.log("✓ Connected!");
    console.log("Running migration...");
    await client.query(sql);
    console.log("✓ Migration applied successfully!");
    await client.end();
    process.exit(0);
  } catch (e) {
    console.log(`✗ ${e.message}`);
    try { await client.end(); } catch {}
  }
}
console.log("All connection attempts failed.");

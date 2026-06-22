import fs from "fs";

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

const projectRef = process.env.SUPABASE_PROJECT_ID;
const token = process.env.SUPABASE_ACCESS_TOKEN;
const sqlFile = process.env.SQL_FILE || "supabase/migrations/20260622000000_magical-nepal-treks.sql";

const sql = fs.readFileSync(sqlFile, "utf8");

const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const text = await response.text();
if (response.ok) {
  console.log("✓ Migration applied successfully!");
  console.log("Response:", text);
} else {
  console.error("✗ Error:", text);
  process.exit(1);
}

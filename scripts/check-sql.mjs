import fs from "fs";

const sql = fs.readFileSync("supabase/migrations/20260622000000_magical-nepal-treks.sql", "utf8");
const lines = sql.split("\n");

let issues = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.includes("'[") || !line.includes("::jsonb")) continue;
  
  // Check if JSON strings contain unescaped single quotes
  let inJson = false;
  let inStr = false;
  
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    
    // Detect start of '[...]'::jsonb
    if (c === "'" && line[j + 1] === "[") {
      inJson = true;
      j++;
      continue;
    }
    
    // Detect end
    if (inJson && c === "'" && line.substring(j, j + 8) === "']'::json") {
      inJson = false;
      break;
    }
    
    if (inJson) {
      if (c === '"' && !inStr) {
        inStr = true;
      } else if (c === '"' && inStr) {
        inStr = false;
      } else if (inStr && c === "'") {
        // Check if this is an escaped '' or unescaped '
        if (line[j - 1] !== "'" || line[j + 1] !== "'") {
          console.log(`WARN line ${i + 1}, col ${j}: unescaped ' in JSON string`);
          issues++;
        }
      }
    }
  }
}

// Also check for any patterns with '' instead of " for JSON
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("'[") && line.includes("::jsonb") && line.includes("''")) {
    // Check if the '' is used as JSON string delimiters
    const inner = line.match(/'\[(.+)\]'::jsonb/);
    if (inner && inner[1].includes("''") && !inner[1].includes('"')) {
      console.log(`WARN line ${i + 1}: still has ''-delimited JSON array`);
      issues++;
    }
  }
}

if (issues === 0) {
  console.log("✓ No issues found");
} else {
  console.log(`✗ ${issues} issue(s) found`);
}

import fs from "fs";

const filePath = "supabase/migrations/20260622000000_magical-nepal-treks.sql";
let sql = fs.readFileSync(filePath, "utf8");

// Map of known missing last elements (keyed by trek slug or line pattern)
const missingElements = {
  'everest-base-camp-helicopter-return': '"Complete experience in just 7 days"',
  'khopra-ridge-trek': '"Combine with Poon Hill sunrise"',
  'kanchenjunga-circuit-trek': '"Wildlife: snow leopards, red pandas, black bears"',
  'upper-dolpo-circuit-trek': '"Camping expedition — true adventure"',
  'makalu-base-camp-trek': '"Spectacular altitude gradient from 400m to 5,000m+"',
  'dhaulagiri-circuit-trek': '"One of Nepal''s most challenging wilderness treks"',
  'rara-lake-trek': '"Over 200 species of birds and diverse wildlife"',
  'ganesh-himal-base-camp': '"Spectacular mountain panoramas"',
  'chisapani-nagarkot-hike': '"Quick escape from Kathmandu into nature"',
  'pokhara-tour': '"Optional paragliding and adventure activities"',
  'chitwan-national-park-tour': '"Over 500 species of birds"',
};

// Fix 1: Add missing last elements
for (const [slug, element] of Object.entries(missingElements)) {
  const regex = new RegExp(`(${slug}.*?\\[[^\\]]*?)(\\]'::jsonb\\))`, 's');
  sql = sql.replace(regex, (match, before, after) => {
    if (match.includes(element)) return match; // already has it
    return before + ',' + element + after;
  });
}

// Fix 2: Escape unescaped single quotes inside JSON strings within SQL strings
// Pattern: '["...text with ' inside..."]'::jsonb
// We need to find ' inside "...", but NOT the SQL string delimiters
// Strategy: Find '["..."]'::jsonb patterns and properly escape them
sql = sql.replace(/'\[(.*?)\]'::jsonb/gs, (match) => {
  // Extract the content between [ and ]
  const innerMatch = match.match(/'\[(.*)\]'::jsonb/s);
  if (!innerMatch) return match;
  
  let inner = innerMatch[1];
  
  // Check if this uses double quotes (valid JSON format)
  if (inner.includes('"')) {
    // This uses "..." format - need to escape any ' as '' for SQL
    // But we must NOT escape ' that are already part of '' (escaped)
    let result = '';
    let inString = false;
    for (let i = 0; i < inner.length; i++) {
      const c = inner[i];
      const next = inner[i + 1];
      
      if (c === '"') {
        inString = !inString;
        result += c;
      } else if (c === "'" && next === "'") {
        // Already escaped - keep as is
        result += "''";
        i++;
      } else if (c === "'" && inString) {
        // Unescaped quote inside JSON string - escape it
        result += "''";
      } else {
        result += c;
      }
    }
    
    // Replace the SQL with fixed version
    // The outer string is: '[...]'::jsonb
    return `'[${result}]'::jsonb`;
  }
  
  return match;
});

// Fix 3: Ensure no remaining ''-delimited arrays
sql = sql.replace(/'\[('[^']*?'(,[^']*?')*)?\]'::jsonb/g, (match) => {
  // If inner content doesn't have " but has '', convert it
  if (match.includes("''") && !match.includes('"')) {
    const innerMatch = match.match(/'\[(.+)\]'::jsonb/);
    if (!innerMatch) return match;
    let inner = innerMatch[1];
    
    // Convert ''elem1'',''elem2'' to "elem1","elem2"
    // But preserve internal '' (like world''s → world's in JSON → keep as world''s in SQL)
    const elements = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < inner.length; i++) {
      if (inner[i] === "'" && inner[i+1] === "'") {
        if (!inQuotes) {
          inQuotes = true;
          current = '';
          i++;
        } else {
          if (inner[i+2] === ',' || inner[i+2] === ']') {
            elements.push(current);
            current = '';
            inQuotes = false;
            i++;
            if (inner[i+1] === ',') i++;
          } else {
            current += "'";
            i++;
          }
        }
      } else if (inQuotes) {
        current += inner[i];
      }
    }
    const jsonElements = elements.map(el => `"${el}"`);
    return `'[${jsonElements.join(',')}]'::jsonb`;
  }
  return match;
});

fs.writeFileSync(filePath, sql, 'utf8');
console.log('✓ Fixed JSONB arrays');

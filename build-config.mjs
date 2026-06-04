import { readFileSync, writeFileSync } from "node:fs";

function readEnvFile() {
  try {
    return readFileSync(".env", "utf8");
  } catch {
    return "";
  }
}

function parseEnv(content) {
  const values = {};

  content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex === -1) {
        return;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
      values[key] = value;
    });

  return values;
}

const fileEnv = parseEnv(readEnvFile());
const supabaseUrl = process.env.SUPABASE_URL || fileEnv.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || fileEnv.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Mangler SUPABASE_URL eller SUPABASE_ANON_KEY.");
  process.exit(1);
}

const config = `window.KAKOMETER_CONFIG = {
  SUPABASE_URL: ${JSON.stringify(supabaseUrl)},
  SUPABASE_ANON_KEY: ${JSON.stringify(supabaseAnonKey)}
};
`;

writeFileSync("config.js", config);
console.log("Skrev config.js");

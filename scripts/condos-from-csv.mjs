import fs from "fs";
import path from "path";

const csvPath = path.resolve("app/data/condos_pcb.csv");
const jsonPath = path.resolve("app/data/condos.json");

// split on commas that are NOT inside quotes
const safeSplit = (line) =>
  line
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((v) => v.replace(/^"|"$/g, ""));

const csv = fs.readFileSync(csvPath, "utf-8").trim();
const rows = csv.split("\n");
const header = rows.shift(); // "name,address,market,slug"

const condos = rows.filter(Boolean).map((line) => {
  const [name, address, market, slug] = safeSplit(line);
  return {
    name: name.trim(),
    address: address.trim(),
    slug: slug.trim(),
    logo: `/logos/${slug.trim()}.png`,
    market: market.trim(),
  };
});

fs.writeFileSync(jsonPath, JSON.stringify(condos, null, 2));
console.log(`✅ Wrote ${condos.length} condos to ${jsonPath}`);

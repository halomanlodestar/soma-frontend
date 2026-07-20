/** @format */
import fs from "fs";
import path from "path";
import "dotenv/config";

export const fetchApiSpecs = async () => {
  // fetch from api using env var
  // write them to specs.json
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL environment variable is not set.");
    return;
  }

  const url = `${apiUrl}/openapi.json`;

  console.log(url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();
  const specsPath = path.join(process.cwd(), "specs.json");
  fs.writeFileSync(specsPath, JSON.stringify(data, null, 2));
  console.log("API specs fetched and saved to specs.json");
};

await fetchApiSpecs();

import fg from "fast-glob";
import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";

async function generateSearchData() {
  const files = await fg("content/docs/*.{md,mdx}");
  const searchData = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const { data } = matter(raw);
    searchData.push({
      title: data.title || "",
      description: data.description || "",
      url: "/recipes/" + path.basename(file, path.extname(file)),
    });
  }

  const outPath = path.join(process.cwd(), "public", "search.json");
  await fs.writeFile(outPath, JSON.stringify({ documents: searchData }, null, 2));
  console.log(`Search data written to ${outPath}`);
}

generateSearchData();
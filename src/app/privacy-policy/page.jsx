import React from "react";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

export default async function Page() {
  // Read and convert the docx file to HTML
  const docxPath = path.join(process.cwd(), "public", "PrivacyPokiifuns.docx");
  let html = "";
  try {
    const buffer = fs.readFileSync(docxPath);
    const result = await mammoth.convertToHtml({ buffer });
    html = result.value;
  } catch (e) {
    html = "<p>Could not load privacy policy document.</p>";
  }

  // Enhance HTML: add Tailwind classes for headings and paragraphs
  const enhancedHtml = html
    // Headings: big, bold, colored, spaced
    .replace(/<h([1-6])([^>]*)>/g, (match, level, attrs) => {
      const size =
        level === "1"
          ? "text-4xl"
          : level === "2"
          ? "text-3xl"
          : level === "3"
          ? "text-2xl"
          : "text-xl";
      return `<h${level} class='text-[#4280bf] font-bold ${size} my-8'${attrs}>`;
    })
    // Paragraphs: color, spacing, readable
    .replace(
      /<p([^>]*)>/g,
      "<p class='text-white text-lg leading-relaxed my-4' $1>"
    );

  return (
    <div className="bg-[#020C17] text-white -mt-20 min-h-screen">
      <div className="py-20 px-[20.2rem] media_resp  max-lg:px-5 max-md:px-2">
        <div
          className="max-w-none doc"
          dangerouslySetInnerHTML={{
            __html: enhancedHtml,
          }}
        />
      </div>
    </div>
  );
}

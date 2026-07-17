import { NextRequest } from "next/server";
import archiver from "archiver";
import { PassThrough } from "stream";

interface SkillFile {
  name: string;
  content: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug } = body;

  // Accept either the newer multi-file shape ({ slug, files: [{name, content}] })
  // or the older single-file shape ({ slug, skillMd }) for backward compatibility
  // with the static example skill pages.
  const files: SkillFile[] = body.files ?? (body.skillMd ? [{ name: "SKILL.md", content: body.skillMd }] : []);

  if (!slug || files.length === 0) {
    return new Response(JSON.stringify({ error: "Missing skill content." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();
  archive.pipe(stream);

  for (const file of files) {
    // Reference files come back named e.g. "references/xyz.md" — keep that
    // relative path inside the skill folder rather than flattening it.
    archive.append(file.content, { name: `${slug}/${file.name}` });
  }
  archive.finalize();

  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  const zipBuffer = Buffer.concat(chunks);

  return new Response(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.zip"`,
    },
  });
}

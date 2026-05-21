import ftp from "basic-ftp";
import { Readable } from "stream";
import path from "path";

export async function POST(req) {
  const client = new ftp.Client();

  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }


    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name);
    const fileName = `${Date.now()}${ext}`;

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: 21,
      secure: false,
    });

    client.ftp.verbose = true;

 
    await client.ensureDir("public_html/uploads");

    const stream = Readable.from(buffer);

    await client.uploadFrom(stream, fileName);

    client.close();

    const url = `/uploads/${fileName}`;

    return Response.json({
      success: true,
      url,
    });
  } catch (err) {
    client.close();

    return Response.json(
      {
        error: err.message,
        full: err,
      },
      { status: 500 },
    );
  }
}

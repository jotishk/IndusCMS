import ftp from "basic-ftp";
import { Readable } from "stream";

export async function POST(req) {
  const client = new ftp.Client();

  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // unique filename
    const fileName = Date.now() + "-" + file.name.replaceAll(" ", "_");

    // connect to FTP
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: 21,
      secure: false,
    });

    client.ftp.verbose = true;

    // go to uploads folder
    await client.ensureDir("public_html/uploads");

    await client.uploadFrom(buffer, fileName);
    const list = await client.list();
    console.log("Files in current directory:", list);
    client.close();

    const url = `https://indusfoxvalley.org/uploads/${fileName}`;

    return Response.json({
      success: true,
      url,
    });
  } catch (err) {
    client.close();

    console.error("FULL FTP ERROR:", err);
    console.error("STACK:", err?.stack);

    return Response.json(
      {
        error: err.message,
        full: err,
      },
      { status: 500 },
    );
  }
}

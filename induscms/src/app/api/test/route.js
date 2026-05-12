import mysql from "mysql2/promise"

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await db.query("SHOW TABLES")

    return Response.json({
      success: true,
      rows,
    })
  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    })
  }
}
import pool from "@/lib/db"
import path from "path";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM events ORDER BY id DESC"
    )
    
    return Response.json(rows)
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    )
  }
}

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")   
    .replace(/\s+/g, "-")         
}

export async function POST(req) {
  try {
    const body = await req.json()
    
    const [result] = await pool.query(
      `INSERT INTO events (title, image, date_posted, event_time, content, url, browser_title, meta_keywords, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ 
        body.title,
        body.thumbnail,
        body.date,
        body.time,
        body.content,
        slugifyTitle(body.title),
        body.title,
        body.title,
        body.title
      ]
    )
    
    return Response.json({ 
        id: result.insertId,
        success: true 
    })
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const body = await req.json()

    await pool.query(
      `UPDATE events
       SET title=?, date=?, status=?, content=?
       WHERE id=?`,
      [
        body.title,
        body.date,
        body.status,
        body.content,
        body.id, 
      ]
    )

    return Response.json({ success: true })
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    )
  }
}


export async function DELETE(req) {
  try {
    const body = await req.json()

    await pool.query(
      "DELETE FROM events WHERE id=?",
      [body.id]
    )

    return Response.json({ success: true })
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
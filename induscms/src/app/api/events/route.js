import pool from "@/lib/db"

// 📥 GET ALL EVENTS
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

// ➕ CREATE EVENT
export async function POST(req) {
  try {
    const body = await req.json()

    await pool.query(
      `INSERT INTO events (title, date, status, content)
       VALUES (?, ?, ?, ?)`,
      [
        body.title,
        body.date,
        body.status,
        body.content,
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

// ✏️ UPDATE EVENT
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
        body.id, // 👈 IMPORTANT
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

// 🗑️ DELETE EVENT
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
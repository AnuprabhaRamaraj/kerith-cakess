import { NextRequest, NextResponse } from "next/server";
import { getDbPool, initDatabase } from "@/lib/db";

export async function GET() {
  try {
    await initDatabase();
    const db = getDbPool();
    const [rows]: [any[], any] = await db.query(
      "SELECT id, name, email, password, role, created_at as createdAt FROM users ORDER BY created_at ASC"
    );

    return NextResponse.json({
      success: true,
      users: rows.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const db = getDbPool();
    const [countRows]: [any[], any] = await db.query("SELECT COUNT(*) as cnt FROM users");
    if (countRows[0]?.cnt >= 3) {
      return NextResponse.json(
        { error: "Maximum limit of 3 admin users reached." },
        { status: 400 }
      );
    }

    const id = `admin-${Date.now()}`;
    await db.query(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [id, name, email, password, role || "Co-Admin"]
    );

    return NextResponse.json({
      success: true,
      user: { id, name, email, password, role: role || "Co-Admin" },
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { id, name, email, password, role } = body;

    if (!id || !name || !email || !password) {
      return NextResponse.json(
        { error: "id, name, email, and password are required." },
        { status: 400 }
      );
    }

    const db = getDbPool();
    await db.query(
      "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?",
      [name, email, password, role || "Admin", id]
    );

    return NextResponse.json({
      success: true,
      user: { id, name, email, password, role },
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const db = getDbPool();
    const [countRows]: [any[], any] = await db.query("SELECT COUNT(*) as cnt FROM users");
    if (countRows[0]?.cnt <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin account." },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Admin user removed successfully.",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

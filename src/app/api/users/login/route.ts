import { NextRequest, NextResponse } from "next/server";
import { getDbPool, initDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required." },
        { status: 400 }
      );
    }

    const db = getDbPool();
    const input = usernameOrEmail.trim().toLowerCase();

    const [rows]: [any[], any] = await db.query(
      "SELECT id, name, email, password, role, created_at as createdAt FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?",
      [input, input]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const user = rows[0];
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Login authentication error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

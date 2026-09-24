import { NextResponse } from "next/server";
import { initDatabase, getDbPool } from "@/lib/db";

export async function GET() {
  try {
    await initDatabase();
    const db = getDbPool();

    // Check table lists
    const [tables]: [any[], any] = await db.query("SHOW TABLES");
    
    // Count records
    const [userCount]: [any[], any] = await db.query("SELECT COUNT(*) as count FROM users");
    const [imageCount]: [any[], any] = await db.query("SELECT COUNT(*) as count FROM images");
    const [productCount]: [any[], any] = await db.query("SELECT COUNT(*) as count FROM products");

    return NextResponse.json({
      success: true,
      message: "Database connection established and tables verified!",
      database: process.env.DB_NAME || "godigita_kerithcakes",
      tables: tables.map((t: any) => Object.values(t)[0]),
      stats: {
        users: userCount[0]?.count || 0,
        images: imageCount[0]?.count || 0,
        products: productCount[0]?.count || 0,
      },
    });
  } catch (error: any) {
    console.error("Database test/init failure:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize or connect to MySQL database.",
        code: error.code,
      },
      { status: 500 }
    );
  }
}

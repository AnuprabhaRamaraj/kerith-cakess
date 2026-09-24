import { NextRequest, NextResponse } from "next/server";
import { getDbPool, initDatabase } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    await initDatabase();
    const db = getDbPool();
    const [rows]: [any[], any] = await db.query(
      "SELECT id, filename, url, alt_text as altText, category, size_bytes as sizeBytes, mime_type as mimeType, created_at as createdAt FROM images ORDER BY created_at DESC"
    );

    return NextResponse.json({
      success: true,
      images: rows,
    });
  } catch (error: any) {
    console.error("Fetch images error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { filename, url, altText, category, sizeBytes, mimeType } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Image URL or data is required." },
        { status: 400 }
      );
    }

    const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fname = filename || "cake-image.jpg";
    const db = getDbPool();

    await db.query(
      "INSERT INTO images (id, filename, url, alt_text, category, size_bytes, mime_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        fname,
        url,
        altText || "",
        category || "cakes",
        sizeBytes || 0,
        mimeType || "image/jpeg",
      ]
    );

    return NextResponse.json({
      success: true,
      image: {
        id,
        filename: fname,
        url,
        altText,
        category,
        sizeBytes,
        mimeType,
      },
    });
  } catch (error: any) {
    console.error("Save image DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const url = searchParams.get("url");

    if (!id && !url) {
      return NextResponse.json(
        { error: "Image ID or URL is required for deletion." },
        { status: 400 }
      );
    }

    const db = getDbPool();

    if (id) {
      // Find image to remove file if on disk
      const [rows]: [any[], any] = await db.query(
        "SELECT url FROM images WHERE id = ?",
        [id]
      );
      if (rows && rows[0]?.url && rows[0].url.startsWith("/images/cakes/")) {
        const filePath = path.join(process.cwd(), "public", rows[0].url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await db.query("DELETE FROM images WHERE id = ?", [id]);
    } else if (url) {
      if (url.startsWith("/images/cakes/")) {
        const filePath = path.join(process.cwd(), "public", url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await db.query("DELETE FROM images WHERE url = ?", [url]);
    }

    return NextResponse.json({
      success: true,
      message: "Image record removed from database and disk.",
    });
  } catch (error: any) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

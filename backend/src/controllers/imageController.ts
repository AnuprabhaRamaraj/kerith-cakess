import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { getDbPool, initDatabase } from "../config/db";

export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const db = getDbPool();
    const [rows]: [any[], any] = await db.query(
      "SELECT id, filename, url, alt_text as altText, category, size_bytes as sizeBytes, mime_type as mimeType, created_at as createdAt FROM images ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      images: rows,
    });
  } catch (error: any) {
    console.error("Fetch images error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createImage = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const { filename, url, altText, category, sizeBytes, mimeType } = req.body;

    if (!url) {
      res.status(400).json({ error: "Image URL or data is required." });
      return;
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

    res.json({
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
    res.status(500).json({ error: error.message });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const id = (req.query.id as string) || (req.params.id as string);
    const url = req.query.url as string;

    if (!id && !url) {
      res.status(400).json({ error: "Image ID or URL is required for deletion." });
      return;
    }

    const db = getDbPool();

    if (id) {
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

    res.json({
      success: true,
      message: "Image record removed from database and disk.",
    });
  } catch (error: any) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: error.message });
  }
};

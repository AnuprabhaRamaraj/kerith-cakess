import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { getDbPool, initDatabase } from "../config/db";

const DEFAULT_PRESET_FILENAMES = [
  "black_forest.jpg",
  "choco_caramel.jpg",
  "custom_model.jpg",
  "red_velvet.jpg",
  "wedding_cake.jpg",
  "white_forest.jpg",
  "logo.jpg",
];

// Configure local storage for uploads
const uploadDir = path.join(process.cwd(), "public", "images", "cakes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname || "cake-photo.jpg";
    const extension = path.extname(originalName) || ".jpg";
    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 30);
    const uniqueFilename = `${baseName}-${Date.now()}${extension}`;
    cb(null, uniqueFilename);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const handleImageUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No image file provided." });
      return;
    }

    const uniqueFilename = file.filename;
    const relativeUrl = `/images/cakes/${uniqueFilename}`;

    // Store in MySQL database images table
    try {
      await initDatabase();
      const db = getDbPool();
      const imgId = `img-${Date.now()}`;
      await db.query(
        "INSERT INTO images (id, filename, url, alt_text, category, size_bytes, mime_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          imgId,
          uniqueFilename,
          relativeUrl,
          file.originalname || "",
          "cakes",
          file.size || 0,
          file.mimetype || "image/jpeg",
        ]
      );
    } catch (dbErr) {
      console.warn("Could not save image record to MySQL (file was saved to disk):", dbErr);
    }

    res.json({
      success: true,
      url: relativeUrl,
      filename: uniqueFilename,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to save image locally." });
  }
};

export const handleImageDelete = async (req: Request, res: Response): Promise<void> => {
  try {
    const imageUrl = (req.query.imageUrl as string) || (req.body.imageUrl as string);

    if (!imageUrl) {
      res.status(400).json({ error: "Image URL is required for deletion." });
      return;
    }

    const filename = path.basename(imageUrl);

    // Prevent deletion of seed/default preset images
    if (DEFAULT_PRESET_FILENAMES.includes(filename)) {
      res.json({
        success: true,
        message: "Default preset image preserved (not deleted).",
      });
      return;
    }

    const targetPath = path.join(uploadDir, filename);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    // Remove from MySQL images table
    try {
      await initDatabase();
      const db = getDbPool();
      await db.query("DELETE FROM images WHERE url = ? OR filename = ?", [
        imageUrl,
        filename,
      ]);
    } catch (dbErr) {
      console.warn("Could not delete image from MySQL:", dbErr);
    }

    res.json({
      success: true,
      message: `Deleted old image ${filename} successfully.`,
    });
  } catch (error: any) {
    console.error("Image deletion error:", error);
    res.status(500).json({ error: "Failed to delete old image file." });
  }
};

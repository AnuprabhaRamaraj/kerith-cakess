import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const DEFAULT_PRESET_FILENAMES = [
  "black_forest.jpg",
  "choco_caramel.jpg",
  "custom_model.jpg",
  "red_velvet.jpg",
  "wedding_cake.jpg",
  "white_forest.jpg",
  "logo.jpg",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique filename
    const originalName = file.name || "cake-photo.jpg";
    const extension = path.extname(originalName) || ".jpg";
    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 30);
    const uniqueFilename = `${baseName}-${Date.now()}${extension}`;

    // Target storage directory: public/images/cakes
    const uploadDir = path.join(process.cwd(), "public", "images", "cakes");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/images/cakes/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      filename: uniqueFilename,
    });
  } catch (error: unknown) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to save image locally." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required for deletion." },
        { status: 400 }
      );
    }

    // Only allow deletion within /images/cakes/
    const filename = path.basename(imageUrl);

    // Prevent deletion of seed/default preset images
    if (DEFAULT_PRESET_FILENAMES.includes(filename)) {
      return NextResponse.json({
        success: true,
        message: "Default preset image preserved (not deleted).",
      });
    }

    const targetPath = path.join(process.cwd(), "public", "images", "cakes", filename);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      return NextResponse.json({
        success: true,
        message: `Deleted old image ${filename} successfully.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "File not found or already removed.",
    });
  } catch (error: unknown) {
    console.error("Image deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete old image file." },
      { status: 500 }
    );
  }
}

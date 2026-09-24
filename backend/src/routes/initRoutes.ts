import { Router, Request, Response } from "express";
import { initDatabase, getDbPool } from "../config/db";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const db = getDbPool();

    // Check table lists
    const [tables]: [any[], any] = await db.query("SHOW TABLES");

    // Count records
    const [userCount]: [any[], any] = await db.query("SELECT COUNT(*) as count FROM users");
    const [imageCount]: [any[], any] = await db.query("SELECT COUNT(*) as count FROM images");
    const [productCount]: [any[], any] = await db.query("SELECT COUNT(*) as count FROM products");

    res.json({
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
    res.status(500).json({
      success: false,
      error: error.message || "Failed to initialize or connect to MySQL database.",
      code: error.code,
    });
  }
});

export default router;

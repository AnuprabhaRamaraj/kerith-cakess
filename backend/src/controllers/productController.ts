import { Request, Response } from "express";
import { getDbPool, initDatabase } from "../config/db";
import { DEFAULT_PRODUCTS } from "../data/defaultProducts";

function formatProducts(rows: any[]) {
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    categoryId: r.category_id,
    weight: r.weight,
    availableWeights:
      typeof r.available_weights === "string"
        ? JSON.parse(r.available_weights)
        : r.available_weights || [r.weight],
    offerPrice: Number(r.offer_price),
    originalPrice: Number(r.original_price),
    weightPrices:
      typeof r.weight_prices === "string"
        ? JSON.parse(r.weight_prices)
        : r.weight_prices || {},
    description: r.description,
    image: r.image,
    isBestseller: Boolean(r.is_bestseller),
    isOffer: Boolean(r.is_offer),
    isLive: Boolean(r.is_live),
    rating: Number(r.rating || 5.0),
    reviewsCount: Number(r.reviews_count || 10),
  }));
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const db = getDbPool();
    const [rows]: [any[], any] = await db.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );

    if (!rows || rows.length === 0) {
      // Seed default products to database if empty
      for (const p of DEFAULT_PRODUCTS) {
        await db.query(
          `INSERT INTO products (
            id, name, category, category_id, weight, available_weights,
            offer_price, original_price, weight_prices, description,
            image, is_bestseller, is_offer, is_live, rating, reviews_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name=name`,
          [
            p.id,
            p.name,
            p.category,
            p.categoryId,
            p.weight,
            JSON.stringify(p.availableWeights || [p.weight]),
            p.offerPrice,
            p.originalPrice,
            JSON.stringify(p.weightPrices || {}),
            p.description,
            p.image,
            p.isBestseller || false,
            p.isOffer || false,
            p.isLive !== false,
            p.rating || 5.0,
            p.reviewsCount || 10,
          ]
        );
      }

      const [seededRows]: [any[], any] = await db.query(
        "SELECT * FROM products ORDER BY created_at DESC"
      );
      res.json({
        success: true,
        products: formatProducts(seededRows),
      });
      return;
    }

    res.json({
      success: true,
      products: formatProducts(rows),
    });
  } catch (error: any) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const p = req.body;

    const id =
      p.id ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Math.random().toString(36).substring(2, 6);

    const db = getDbPool();
    await db.query(
      `INSERT INTO products (
        id, name, category, category_id, weight, available_weights,
        offer_price, original_price, weight_prices, description,
        image, is_bestseller, is_offer, is_live, rating, reviews_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        p.name,
        p.category,
        p.categoryId,
        p.weight,
        JSON.stringify(p.availableWeights || [p.weight]),
        p.offerPrice,
        p.originalPrice,
        JSON.stringify(p.weightPrices || {}),
        p.description || "",
        p.image,
        !!p.isBestseller,
        !!p.isOffer,
        p.isLive !== false,
        p.rating || 5.0,
        p.reviewsCount || 10,
      ]
    );

    res.json({
      success: true,
      product: { ...p, id },
    });
  } catch (error: any) {
    console.error("Add product error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const p = req.body;

    if (!p.id) {
      res.status(400).json({ error: "Product ID required." });
      return;
    }

    const db = getDbPool();
    await db.query(
      `UPDATE products SET
        name = ?,
        category = ?,
        category_id = ?,
        weight = ?,
        available_weights = ?,
        offer_price = ?,
        original_price = ?,
        weight_prices = ?,
        description = ?,
        image = ?,
        is_bestseller = ?,
        is_offer = ?,
        is_live = ?
      WHERE id = ?`,
      [
        p.name,
        p.category,
        p.categoryId,
        p.weight,
        JSON.stringify(p.availableWeights || [p.weight]),
        p.offerPrice,
        p.originalPrice,
        JSON.stringify(p.weightPrices || {}),
        p.description,
        p.image,
        !!p.isBestseller,
        !!p.isOffer,
        p.isLive !== false,
        p.id,
      ]
    );

    res.json({
      success: true,
      product: p,
    });
  } catch (error: any) {
    console.error("Update product error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const id = (req.query.id as string) || (req.params.id as string);

    if (!id) {
      res.status(400).json({ error: "Product ID required." });
      return;
    }

    const db = getDbPool();
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Product removed from database.",
    });
  } catch (error: any) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: error.message });
  }
};

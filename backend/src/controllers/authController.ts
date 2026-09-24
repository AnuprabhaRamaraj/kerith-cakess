import { Request, Response } from "express";
import { getDbPool, initDatabase } from "../config/db";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      res.status(400).json({ error: "Username/email and password are required." });
      return;
    }

    const db = getDbPool();
    const input = usernameOrEmail.trim().toLowerCase();

    const [rows]: [any[], any] = await db.query(
      "SELECT id, name, email, password, role, created_at as createdAt FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?",
      [input, input]
    );

    if (!rows || rows.length === 0) {
      res.status(401).json({ error: "Invalid username/email or password." });
      return;
    }

    const user = rows[0];
    if (user.password !== password) {
      res.status(401).json({ error: "Invalid username/email or password." });
      return;
    }

    res.json({
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
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const db = getDbPool();
    const [rows]: [any[], any] = await db.query(
      "SELECT id, name, email, password, role, created_at as createdAt FROM users ORDER BY created_at ASC"
    );

    res.json({
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
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    const db = getDbPool();
    const [countRows]: [any[], any] = await db.query("SELECT COUNT(*) as cnt FROM users");
    if (countRows[0]?.cnt >= 3) {
      res.status(400).json({ error: "Maximum limit of 3 admin users reached." });
      return;
    }

    const id = `admin-${Date.now()}`;
    await db.query(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [id, name, email, password, role || "Co-Admin"]
    );

    res.json({
      success: true,
      user: { id, name, email, password, role: role || "Co-Admin" },
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const { id, name, email, password, role } = req.body;

    if (!id || !name || !email || !password) {
      res.status(400).json({ error: "id, name, email, and password are required." });
      return;
    }

    const db = getDbPool();
    await db.query(
      "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?",
      [name, email, password, role || "Admin", id]
    );

    res.json({
      success: true,
      user: { id, name, email, password, role },
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await initDatabase();
    const id = (req.query.id as string) || (req.params.id as string);

    if (!id) {
      res.status(400).json({ error: "User ID is required." });
      return;
    }

    const db = getDbPool();
    const [countRows]: [any[], any] = await db.query("SELECT COUNT(*) as cnt FROM users");
    if (countRows[0]?.cnt <= 1) {
      res.status(400).json({ error: "Cannot delete the last admin account." });
      return;
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Admin user removed successfully.",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: error.message });
  }
};

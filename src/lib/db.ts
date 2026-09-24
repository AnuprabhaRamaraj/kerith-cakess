import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "godigita_kerithcakes_user",
      password: process.env.DB_PASSWORD || "kerith@123",
      database: process.env.DB_NAME || "godigita_kerithcakes",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
    });
  }
  return pool;
}

let isInitialized = false;

/**
 * Initializes the MySQL database tables if they do not exist
 */
export async function initDatabase() {
  if (isInitialized) return;
  const db = getDbPool();

  try {
    // 1. Users table (stores Admin Users & credentials)
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Images table (stores uploaded image files & paths & metadata)
    await db.query(`
      CREATE TABLE IF NOT EXISTS images (
        id VARCHAR(64) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        alt_text VARCHAR(255) DEFAULT '',
        category VARCHAR(100) DEFAULT 'general',
        size_bytes INT DEFAULT 0,
        mime_type VARCHAR(50) DEFAULT 'image/jpeg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Products table (stores Cake Catalogue)
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        category_id VARCHAR(100) NOT NULL,
        weight VARCHAR(50) NOT NULL,
        available_weights JSON,
        offer_price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2) NOT NULL,
        weight_prices JSON,
        description TEXT,
        image TEXT NOT NULL,
        is_bestseller BOOLEAN DEFAULT FALSE,
        is_offer BOOLEAN DEFAULT FALSE,
        is_live BOOLEAN DEFAULT TRUE,
        rating DECIMAL(3,1) DEFAULT 5.0,
        reviews_count INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Categories table
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon_name VARCHAR(100) DEFAULT '',
        image TEXT DEFAULT '',
        description TEXT,
        type ENUM('explore', 'featured') DEFAULT 'explore',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Insert Default Master Admin user if users table is empty
    const [existingUsers]: [any[], any] = await db.query(
      `SELECT COUNT(*) as cnt FROM users`
    );
    if (existingUsers && existingUsers[0]?.cnt === 0) {
      await db.query(
        `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [
          "admin-1",
          "Master Baker (Admin 1)",
          "admin@kerithcakes.com",
          "admin123",
          "Super Admin",
        ]
      );
      console.log("Seeded default admin user in MySQL database.");
    }

    isInitialized = true;
    console.log("MySQL Database tables initialized successfully.");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

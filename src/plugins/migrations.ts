import { Database } from "./db.js";

const MIGRATIONS = [
    `CREATE TABLE IF NOT EXISTS users (
        id          INT           AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)  NOT NULL,
        email       VARCHAR(255)  NOT NULL UNIQUE,
        password    VARCHAR(255)  NOT NULL,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON
  UPDATE CURRENT_TIMESTAMP
      )`,
];

export async function runMigrations(): Promise<void> {
    const db = Database.getInstance();
    for (const sql of MIGRATIONS) {
        await db.execute(sql);
        console.log("Migration executed:", sql.slice(0, 60) +
            "...");
    }
}
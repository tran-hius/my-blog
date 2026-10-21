import mysql, { PoolConnection } from "mysql2/promise";
import { Database } from "../plugins/db.js";

export interface Entity {
    id: number;
}

export abstract class BaseRepository<T extends Entity> {
    constructor(
        protected readonly table: string,
        protected readonly db: Database = Database.getInstance()
    ) { }

    protected get t(): string {
        return mysql.escapeId(this.table);
    }

    findAll(conn?: PoolConnection): Promise<T[]> {
        return this.db.select<T>(`SELECT * FROM ${this.t}`, [], conn);
    }

    async findById(id: number, conn?: PoolConnection): Promise<T | null> {
        const rows = await this.db.select<T>(`SELECT * FROM ${this.t} WHERE id = ?`, [id], conn);
        return rows[0] ?? null;
    }

    async create(data: Omit<T, "id">, conn?: PoolConnection): Promise<number> {
        const keys = Object.keys(data)
        const cols = keys.map((k) => mysql.escapeId(k)).join(", ")
        const marks = keys.map(() => "?").join(", ")
        const result = await this.db.execute(`INSERT INTO ${this.t} (${cols}) VALUES (${marks})`, Object.values(data), conn);
        return result.insertId
    }

    async update(id: number, data: Partial<Omit<T, "id">>, conn?: PoolConnection): Promise<boolean> {
        const keys = Object.keys(data)
        if (keys.length === 0) return false
        const set = keys.map((k) => `${mysql.escapeId(k)} = ?`).join(", ")
        const result = await this.db.execute(`UPDATE ${this.t} SET ${set} WHERE id = ?`, [...Object.values(data), id], conn)
        return result.affectedRows > 0
    }

    async delete(id: number, conn?: PoolConnection): Promise<boolean> {
        const result = await this.db.execute(`DELETE FROM ${this.t} WHERE id = ?`, [id], conn);
        return result.affectedRows > 0;
    }

}
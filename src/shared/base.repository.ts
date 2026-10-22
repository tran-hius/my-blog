import mysql, { PoolConnection } from "mysql2/promise";
import { Database } from "../plugins/db.js";
import { BaseEntity } from "./base.entity.js";

type Row = Record<string, any>


export abstract class BaseRepository<T extends BaseEntity> {
    constructor(
        protected readonly table: string,
        protected readonly db: Database = Database.getInstance()
    ) { }

    protected abstract mapRow(row: Row): T

    protected get t(): string {
        return mysql.escapeId(this.table);
    }

    async findAll(conn?: PoolConnection): Promise<T[]> {
        const rows = await this.db.select<Row>(`SELECT * FROM ${this.t}`, [], conn);
        return rows.map((r) => this.mapRow(r))
    }

    async findById(id: number, conn?: PoolConnection): Promise<T | null> {
        const rows = await this.db.select<Row>(`SELECT * FROM ${this.t} WHERE id = ?`, [id], conn);
        return rows[0] ? this.mapRow(rows[0]) : null;
    }

    async create(entity: T, conn?: PoolConnection): Promise<T> {
        const record = entity.toRecord();
        const keys = Object.keys(record);
        const cols = keys.map((k) => mysql.escapeId(k)).join(", ");
        const marks = keys.map(() => "?").join(", ");
        const result = await this.db.execute(
            `INSERT INTO ${this.t} (${cols}) VALUES (${marks})`,
            Object.values(record),
            conn
        );
        entity.id = result.insertId;
        return entity;
    }

    async update(entity: T, conn?: PoolConnection): Promise<boolean> {
        if (entity.id === undefined) throw new Error("Entity chưa có id");
        const record = entity.toRecord();
        const set = Object.keys(record).map((k) => `${mysql.escapeId(k)} = ?`).join(", ");
        const result = await this.db.execute(
            `UPDATE ${this.t} SET ${set} WHERE id = ?`,
            [...Object.values(record), entity.id],
            conn
        );
        return result.affectedRows > 0;
    }

    async delete(id: number, conn?: PoolConnection): Promise<boolean> {
        const result = await this.db.execute(`DELETE FROM ${this.t} WHERE id = ?`, [id], conn);
        return result.affectedRows > 0;
    }

}
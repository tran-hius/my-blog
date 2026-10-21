import mysql, { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import { env } from "../config/env.js"

export type SqlParams = unknown[]

export class Database {
    private static instance: Database | null = null
    private readonly pool: Pool

    constructor() {
        this.pool = mysql.createPool({
            host: env.DB_HOST,
            port: Number(env.DB_PORT ?? 3306),
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            waitForConnections: true,
            connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 10),
            queueLimit: 0,
            enableKeepAlive: true
        })
    }

    static getInstance(): Database {
        if (Database.instance === null) {
            Database.instance = new Database()
        }
        return Database.instance
    }

    async select<T>(sql: string, params: SqlParams = [], conn?: PoolConnection): Promise<T[]> {
        const [rows] = await (conn ?? this.pool).execute<RowDataPacket[]>(sql, params as any[]);
        return rows as unknown as T[]
    }

    /** INSERT / UPDATE / DELETE: trả về insertId, affectedRows... */
    async execute(sql: string, params: SqlParams = [], conn?: PoolConnection): Promise<ResultSetHeader> {
        const [result] = await (conn ?? this.pool).execute<ResultSetHeader>(sql, params as any[])
        return result
    }

    async transaction<T>(work: (conn: PoolConnection) => Promise<T>): Promise<T> {
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            const result = await work(conn);
            await conn.commit();
            return result;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    async healthCheck(): Promise<boolean> {
        await this.pool.query("SELECT 1");
        return true;
    }

    async close(): Promise<void> {
        await this.pool.end();
        Database.instance = null;
    }
}
import { PoolConnection } from "mysql2/promise";
import { Database } from "../../plugins/db.js";
import { BaseRepository } from "../../shared/base.repository.js";
import { User } from "./user.js";

export class UserRepository extends BaseRepository<User> {
    constructor(db?: Database) {
        super("users", db)
    }

    protected mapRow(row: Record<string, any>): User {
        return User.fromRow(row);
    }

    async findByEmail(email: string, conn?: PoolConnection): Promise<User | null> {
        const rows = await this.db.select<Record<string, any>>(
            "SELECT * FROM users WHERE email = ?", [email], conn
        )
        return rows[0] ? this.mapRow(rows[0]) : null
    }
}
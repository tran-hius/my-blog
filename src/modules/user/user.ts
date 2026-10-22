import { BaseEntity } from "../../shared/base.entity.js";

export class User extends BaseEntity {
    constructor(public name: string, public email: string, public password: string, id?: number) {
        super(id)
    }

    static fromRow(row: Record<string, any>) {
        return new User(row.name, row.email, row.password, row.id)
    }

    toRecord(): Record<string, unknown> {
        return { name: this.name, email: this.email, password: this.password }
    }
}
import { Database } from "../../plugins/db.js";
import { User } from "./user.js";
import { UserRepository } from "./user.repository.js";

export class UserService {
    constructor(
        private readonly userRepo: UserRepository = new UserRepository(),
        private readonly db: Database = Database.getInstance()
    ) {

    }

    async register(name: string, email: string, password: string): Promise<User> {
        if (await this.userRepo.findByEmail(email)) {
            throw new Error("Email has already")
        }
        const newUser = new User(name, email, password)

        return this.userRepo.create(newUser)
    }
}
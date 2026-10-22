import { Database } from "./plugins/db.js";
import { UserRouter } from "./modules/user/user.router.js";
import { UserRepository } from "./modules/user/user.repository.js";
import { UserService } from "./modules/user/user.service.js";
import { UserController } from "./modules/user/user.controller.js";

export class Container {
    readonly db: Database;
    readonly userRouter: UserRouter;

    constructor() {
        this.db = Database.getInstance()
        const userRepo = new UserRepository(this.db)
        const userService = new UserService(userRepo, this.db)
        const userController = new UserController(userService)
        this.userRouter = new UserRouter(userController)
    }
}
import { FastifyInstance } from "fastify";
import { CreateRoute, UserController } from "./user.controller.js";

export class UserRouter {
    constructor(private readonly controller: UserController) { }

    routes = async (app: FastifyInstance): Promise<void> => {
        const c = this.controller
        app.post<CreateRoute>("/", c.register)
    }
}
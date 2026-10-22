import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./user.service.js";

export type CreateRoute = { Body: { name: string, email: string, password: string } }

export class UserController {
    constructor(private readonly userService: UserService) {

    }

    register = async (req: FastifyRequest<CreateRoute>, reply: FastifyReply) => {
        const { name, email, password } = req.body
        const user = await this.userService.register(name, email, password)
        return reply.code(201).send(user)
    }
}
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "./error.js";

export function errorHandler(error: FastifyError, req: FastifyRequest, reply: FastifyReply): void {
    if (error instanceof HttpError) {
        reply.code(error.status).send({ message: error.message });
        return;
    }
    if (error.statusCode && error.statusCode < 500) {
        reply.code(error.statusCode).send({ message: error.message });
        return;
    }
    req.log.error(error);
    reply.code(500).send({ message: "Internal Server Error" });
}
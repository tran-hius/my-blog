import Fastify from "fastify";
import { Container } from "./container.js";


export function buildApp() {
  const app = Fastify({ logger: true });
  const container = new Container()

  container.userRouter.routes(app)

  return app;
}

import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/hello", async () => {
    return {message: "Xin chào Fastify"}
})

app.get<{ Params: { name: string } }>("/hello/:name", async (req) => {
  return { message: `Xin chào ${req.params.name}` };
});

try{
    await app.listen({port: 3000})
}catch(err){
    app.log.error(err)
    process.exit(1)
}
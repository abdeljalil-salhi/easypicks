import express from "express";
import dotenv from "dotenv";
import http from "http";
import { resolve } from "path";
import mongoose from "mongoose";

async function bootstrap(): Promise<void> {
  dotenv.config({
    path: ".env.production",
  });
  const port: number = Number(process.env.PORT) || 8080;
  const __dirname: string = resolve();
  let error: string = "";

  const app: express.Express = express();
  const server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  > = http.createServer(app);

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((_: Error) => {
      console.error("Error connecting to MongoDB");
      error += " Error connecting to MongoDB";
    });

  app.get("/", (_: express.Request, res: express.Response) => {
    res.status(200).send(`Welcome to easypicks API!${error}`);
  });

  server.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
  });
}

bootstrap().catch((err: Error) => {
  console.error(err);
});

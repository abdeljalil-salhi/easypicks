import express from "express";
import { config } from "dotenv";
import { Server, IncomingMessage, ServerResponse, createServer } from "http";
import { resolve, join } from "path";
import { connect } from "mongoose";

import userRouter from "./routers/user.router";
import productRouter from "./routers/product.router";
import orderRouter from "./routers/order.router";
import uploadRouter from "./routers/upload.router";

const bootstrap = async (): Promise<void> => {
  config({
    path: ".env.production",
  });
  const port: number = Number(process.env.PORT) || 8080;
  const __dirname: string = resolve();

  const app: express.Express = express();
  const server: Server<typeof IncomingMessage, typeof ServerResponse> =
    createServer(app);

  connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: Error) => {
      console.error("Error connecting to MongoDB");
      throw err;
    });

  app.get("/", (_: express.Request, res: express.Response) => {
    res.status(200).send("Welcome to easypicks API!");
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/upload", uploadRouter);

  app.use(
    (
      err: Error,
      _: express.Request,
      res: express.Response,
      __: express.NextFunction
    ) => {
      res.status(500).send({ message: err.message });
    }
  );

  app.use("/uploads", express.static(join(__dirname, "/uploads")));

  server.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
  });
};

bootstrap().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});

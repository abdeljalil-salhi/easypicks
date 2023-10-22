import express from "express";
import multer from "multer";

const uploadRouter: express.Router = express.Router();

const storage: multer.StorageEngine = multer.diskStorage({
  destination(_: express.Request, __: Express.Multer.File, cb: any) {
    cb(null, "uploads/");
  },
  filename(_: express.Request, __: Express.Multer.File, cb: any) {
    cb(null, `${Date.now()}.png`);
  },
});

const upload: multer.Multer = multer({ storage });

uploadRouter.post(
  "/",
  upload.single("image"),
  (req: express.Request, res: express.Response) => {
    res.send(`/${req.file.path}`);
  }
);

export default uploadRouter;

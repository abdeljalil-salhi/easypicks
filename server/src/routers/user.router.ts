import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import User, { TUser } from "../models/user.model";
import { generateToken, isAdmin, isAuth } from "../auth";

const userRouter: express.Router = express.Router();

userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (_: express.Request, res: express.Response) => {
    const topSellers: TUser[] = await User.find({ isSeller: true })
      .sort({ "seller.rating": -1 })
      .limit(3);
    res.status(200).send(topSellers);
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const user: TUser | null = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          accessToken: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const user: TUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, process.env.BCRYPT_SALT),
    });
    const createdUser: TUser = await user.save();
    res.status(201).send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isSeller: createdUser.isSeller,
      accessToken: generateToken(createdUser),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      const user: TUser | null = await User.findById(req.user._id);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isSeller = Boolean(req.body.isSeller) || user.isSeller;
        user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;
        if (user.isSeller) {
          user.seller.name = req.body.sellerName || user.seller.name;
          user.seller.logo = req.body.sellerLogo || user.seller.logo;
          user.seller.description =
            req.body.sellerDescription || user.seller.description;
        }
        if (req.body.password)
          user.password = bcrypt.hashSync(
            req.body.password,
            process.env.BCRYPT_SALT
          );
        const updatedUser: TUser = await user.save();
        res.status(200).send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          isSeller: updatedUser.isSeller,
          accessToken: generateToken(updatedUser),
        });
      } else res.status(404).send({ message: "User Not Found" });
    }
  )
);

userRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const user: TUser | null = await User.findById(req.params.id);
    if (user) res.status(200).send(user);
    else res.status(404).send({ message: "User Not Found" });
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const user: TUser | null = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = Boolean(req.body.isSeller);
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser: TUser = await user.save();
      res.status(200).send({ message: "User Updated", user: updatedUser });
    } else res.status(404).send({ message: "User Not Found" });
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const user: TUser | null = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      const deletedUser: TUser = await user.deleteOne();
      res.status(200).send({ message: "User Deleted", user: deletedUser });
      return;
    }
    res.status(404).send({ message: "User Not Found" });
  })
);

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const users: TUser[] = await User.find({});
    res.status(200).send(users);
  })
);

export default userRouter;

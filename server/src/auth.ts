import express from "express";
import jwt from "jsonwebtoken";

import { TUser } from "./models/user.model";

export const generateToken = (user: TUser): string => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (
  req: express.Request & { user: TUser },
  res: express.Response,
  next: express.NextFunction
): void => {
  const authorization: string = req.headers.authorization;
  if (authorization) {
    const token: string = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (error: jwt.VerifyErrors, decode: string | jwt.JwtPayload) => {
        if (error) res.status(401).send({ message: "Invalid token" });
        else {
          req.user = decode as TUser;
          next();
        }
      }
    );
  } else res.status(401).send({ message: "No token provided" });
};

export const isAdmin = (
  req: express.Request & { user: TUser },
  res: express.Response,
  next: express.NextFunction
): void => {
  if (req.user && req.user.isAdmin) next();
  else res.status(401).send({ message: "Invalid admin token" });
};

export const isSeller = (
  req: express.Request & { user: TUser },
  res: express.Response,
  next: express.NextFunction
): void => {
  if (req.user && req.user.isSeller) next();
  else res.status(401).send({ message: "Invalid seller token" });
};

export const isSellerOrAdmin = (
  req: express.Request & { user: TUser },
  res: express.Response,
  next: express.NextFunction
): void => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) next();
  else res.status(401).send({ message: "Invalid seller/admin token" });
};

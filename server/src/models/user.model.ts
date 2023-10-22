import { Document, Model, Schema, Types, model } from "mongoose";

import { Seller, sellerSchema } from "./seller.model";

interface User {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isVerified: boolean;
  isSeller: boolean;
  seller: Seller;
}

const userSchema: Schema<User> = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    isAdmin: {
      type: Schema.Types.Boolean,
      default: false,
      required: true,
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: false,
      required: true,
    },
    isSeller: {
      type: Schema.Types.Boolean,
      default: false,
      required: true,
    },
    seller: sellerSchema,
  },
  {
    timestamps: true,
  }
);

const User: Model<User> = model<User, Model<User>>("User", userSchema);

export type TUser = Document<unknown, {}, User> &
  User & {
    _id: Types.ObjectId;
  };

export default User;

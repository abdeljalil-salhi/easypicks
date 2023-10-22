import { Document, Model, Schema, Types, model } from "mongoose";

import { Review, reviewSchema } from "./review.model";

interface Product {
  name: string;
  seller: Schema.Types.ObjectId | string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
}

const productSchema: Schema<Product> = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: Schema.Types.String,
      required: true,
    },
    brand: {
      type: Schema.Types.String,
      required: true,
    },
    category: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    price: {
      type: Schema.Types.Number,
      default: 0,
      required: true,
    },
    countInStock: {
      type: Schema.Types.Number,
      default: 0,
      required: true,
    },
    rating: {
      type: Schema.Types.Number,
      default: 0,
      required: true,
    },
    numReviews: {
      type: Schema.Types.Number,
      default: 0,
      required: true,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product: Model<Product> = model<Product, Model<Product>>(
  "Product",
  productSchema
);

export type TProduct = Document<unknown, {}, Product> &
  Product & {
    _id: Types.ObjectId;
  };

export default Product;

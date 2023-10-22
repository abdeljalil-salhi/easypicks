import { Schema } from "mongoose";

export interface Seller {
  name: string;
  logo: string;
  description: string;
  rating: number;
  numReviews: number;
}

export const sellerSchema: Schema<Seller> = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  logo: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    default: "An approved seller",
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
});

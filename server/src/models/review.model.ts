import { Schema } from "mongoose";

export interface Review {
  name: string;
  rating: number;
  comment: string;
}

export const reviewSchema: Schema<Review> = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    rating: {
      type: Schema.Types.Number,
      default: 0,
      required: true,
    },
    comment: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

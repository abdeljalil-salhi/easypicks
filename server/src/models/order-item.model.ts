import { Schema } from "mongoose";

export interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: Schema.Types.ObjectId | string;
}

export const orderItemSchema: Schema<OrderItem> = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
  },
  image: {
    type: Schema.Types.String,
    required: true,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

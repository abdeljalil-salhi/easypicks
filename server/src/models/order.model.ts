import { Model, Schema, model } from "mongoose";

import {
  ShippingAddress,
  shippingAddressSchema,
} from "./shipping-address.model";
import { OrderItem, orderItemSchema } from "./order-item.model";
import { PaymentResult, paymentResultSchema } from "./payment-result.model";

interface Order {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult: PaymentResult;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: Schema.Types.ObjectId | string;
  seller: Schema.Types.ObjectId | string;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}

const orderSchema: Schema<Order> = new Schema(
  {
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: Schema.Types.String,
      required: true,
    },
    paymentResult: paymentResultSchema,
    itemsPrice: {
      type: Schema.Types.Number,
      required: true,
    },
    shippingPrice: {
      type: Schema.Types.Number,
      required: true,
    },
    taxPrice: {
      type: Schema.Types.Number,
      required: true,
    },
    totalPrice: {
      type: Schema.Types.Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPaid: {
      type: Schema.Types.Boolean,
      default: false,
    },
    paidAt: {
      type: Schema.Types.Date,
    },
    isDelivered: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deliveredAt: {
      type: Schema.Types.Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<Order> = model<Order, Model<Order>>("Order", orderSchema);

export default Order;

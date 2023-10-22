import { Schema } from "mongoose";

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  latitute: number;
  longitude: number;
}

export const shippingAddressSchema: Schema<ShippingAddress> = new Schema({
  fullName: {
    type: Schema.Types.String,
    required: true,
  },
  address: {
    type: Schema.Types.String,
    required: true,
  },
  city: {
    type: Schema.Types.String,
    required: true,
  },
  postalCode: {
    type: Schema.Types.String,
    required: true,
  },
  country: {
    type: Schema.Types.String,
    required: true,
  },
  latitute: {
    type: Schema.Types.Number,
  },
  longitude: {
    type: Schema.Types.Number,
  },
});

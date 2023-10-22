import { Schema } from "mongoose";

export interface PaymentResult {
  id: string;
  status: string;
  updateTime: string;
  emailAddress: string;
}

export const paymentResultSchema: Schema<PaymentResult> = new Schema({
  id: {
    type: Schema.Types.String,
  },
  status: {
    type: Schema.Types.String,
  },
  updateTime: {
    type: Schema.Types.String,
  },
  emailAddress: {
    type: Schema.Types.String,
  },
});

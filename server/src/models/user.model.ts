import { Model, Schema, model } from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isVerified: boolean;
  isSeller: boolean;
  seller: {
    name: string;
    logo: string;
    description: string;
    rating: number;
    numReviews: number;
  };
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
    seller: {
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
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<User> = model("User", userSchema);

export default User;

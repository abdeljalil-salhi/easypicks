import express from "express";
import expressAsyncHandler from "express-async-handler";

import Order, { TOrder } from "../models/order.model";
import Product from "../models/product.model";
import User, { TUser } from "../models/user.model";
import { isAdmin, isAuth, isSellerOrAdmin } from "../auth";

const orderRouter: express.Router = express.Router();

orderRouter.get(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const seller: string = req.query.seller.toString() || "";
    const sellerFilter: object = seller ? { seller } : {};
    const orders: Order[] = await Order.find({ ...sellerFilter }).populate(
      "user",
      "name"
    );
    res.status(200).send(orders);
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const orders: Order[] = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users: User[] = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders: Order[] = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories: Product[] = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      const orders: Order[] = await Order.find({ user: req.user._id });
      res.status(200).send(orders);
    }
  )
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      if (req.body.orderItems.length === 0)
        res.status(400).send({ message: "Cart is empty" });
      else {
        const order: TOrder = new Order({
          seller: req.body.orderItems[0].seller,
          orderItems: req.body.orderItems,
          shippingAddress: req.body.shippingAddress,
          paymentMethod: req.body.paymentMethod,
          itemsPrice: req.body.itemsPrice,
          shippingPrice: req.body.shippingPrice,
          taxPrice: req.body.taxPrice,
          totalPrice: req.body.totalPrice,
          user: req.user._id,
        });
        const createdOrder: Order = await order.save();
        res
          .status(201)
          .send({ message: "New order created", order: createdOrder });
      }
    }
  )
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const order: Order | null = await Order.findById(req.params.id);
    if (order) res.status(200).send(order);
    else res.status(404).send({ message: "Order not found" });
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const order: TOrder | null = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        updateTime: req.body.updateTime,
        emailAddress: req.body.emailAddress,
      };
      const updatedOrder: Order = await order.save();
      res.status(200).send({ message: "Order paid", order: updatedOrder });
    } else res.status(404).send({ message: "Order not found" });
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const order: TOrder | null = await Order.findById(req.params.id);
    if (order) {
      const deletedOrder: Order = await order.deleteOne();
      res.status(200).send({ message: "Order deleted", order: deletedOrder });
    } else res.status(404).send({ message: "Order not found" });
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      const order: TOrder | null = await Order.findById(req.params.id);
      if (order) {
        if (
          order.seller.toString() !== req.user._id.toString() &&
          !req.user.isAdmin
        ) {
          res.status(401).send({ message: "Unauthorized" });
          return;
        }
        order.isDelivered = true;
        order.deliveredAt = new Date();
        const updatedOrder: Order = await order.save();
        res
          .status(200)
          .send({ message: "Order delivered", order: updatedOrder });
      } else res.status(404).send({ message: "Order not found" });
    }
  )
);

export default orderRouter;

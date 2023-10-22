import express from "express";
import { Schema } from "mongoose";
import expressAsyncHandler from "express-async-handler";

import User, { TUser } from "../models/user.model";
import Product, { TProduct } from "../models/product.model";
import { isAdmin, isAuth, isSellerOrAdmin } from "../auth";
import { Review } from "../models/review.model";

const productRouter: express.Router = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const pageSize: number = 12;
    const page: number = Number(req.query.pageNumber) || 1;
    const name: string = req.query.name.toString() || "";
    const category: string = req.query.category.toString() || "";
    const seller: string = req.query.seller.toString() || "";
    const order: string = req.query.order.toString() || "";
    const min: number =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max: number =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating: number =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const count: number = await Product.countDocuments({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const sortOrder: Record<string, any> =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 };
    const products: Product[] = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate("seller", "seller.name seller.logo")
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res
      .status(200)
      .send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (_: express.Request, res: express.Response) => {
    const categories: string[] = await Product.find().distinct("category");
    res.status(200).send(categories);
  })
);

const data = {
  products: [],
};

productRouter.get(
  "/seed/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    await Product.deleteMany({});
    const seller: TUser | null = await User.findById(req.params.id);
    if (seller) {
      const products: Product[] = data.products.map((product: Product) => ({
        ...product,
        seller: seller._id as unknown as Schema.Types.ObjectId,
      }));
      const createdProducts: Product[] = await Product.insertMany(products);
      res.status(200).send({ createdProducts });
    } else res.status(404).send({ message: "Seller Not Found" });
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const product: Product | null = await Product.findById(
      req.params.id
    ).populate(
      "seller",
      "seller.name seller.logo seller.rating seller.numReviews"
    );
    if (product) res.status(200).send(product);
    else res.status(404).send({ message: "Product Not Found" });
  })
);

productRouter.post(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      const product: TProduct = new Product({
        name: "Sample name",
        seller: req.user._id,
        image: "/uploads/sample.png",
        price: 0,
        category: "Uncategorized",
        brand: "easypicks",
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: "No product description",
      });
      const createdProduct: Product = await product.save();
      res.status(201).send({
        message: "Product Created",
        product: createdProduct,
      });
    }
  )
);

productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      const productId: string = req.params.id;
      const product: TProduct | null = await Product.findById(productId);
      if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct: Product = await product.save();
        res
          .status(200)
          .send({ message: "Product Updated", product: updatedProduct });
      } else res.status(404).send({ message: "Product Not Found" });
    }
  )
);

productRouter.delete(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      const product: TProduct | null = await Product.findById(req.params.id);
      if (product) {
        if (
          product.seller.toString() !== req.user._id.toString() &&
          !req.user.isAdmin
        ) {
          res.status(401).send({ message: "Unauthorized" });
          return;
        }
        const deletedProduct: Product | null = await product.deleteOne();
        res
          .status(200)
          .send({ message: "Product Deleted", product: deletedProduct });
      } else res.status(404).send({ message: "Product Not Found" });
    }
  )
);

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(
    async (req: express.Request & { user: TUser }, res: express.Response) => {
      const productId: string = req.params.id;
      const product: TProduct | null = await Product.findById(productId);
      if (product) {
        if (product.reviews.find((x: Review) => x.name === req.user.name)) {
          res.status(400).send({ message: "You already submitted a review" });
          return;
        }
        const review: Review = {
          name: req.user.name,
          rating: Number(req.body.rating),
          comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((a: number, c: Review) => c.rating + a, 0) /
          product.reviews.length;
        const updatedProduct: Product = await product.save();
        res.status(201).send({
          message: "Review Submitted",
          review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        });
      } else res.status(404).send({ message: "Product Not Found" });
    }
  )
);

export default productRouter;

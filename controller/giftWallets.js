import GiftWallet from "../models/GiftWallet.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";

export const getGiftWallets = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, GiftWallet);

  const giftWallets = await GiftWallet.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({ success: true, data: giftWallets, pagination });
});

export const getGiftWallet = asyncHandler(async (req, res, next) => {
  const giftWallet = await GiftWallet.findById(req.params.id);

  if (!giftWallet) {
    throw new MyError(req.params.id + " ID-тай ажил байхгүй.", 400);
  }

  res.status(200).json({ success: true, data: giftWallet });
});

export const getCvGiftWallets = asyncHandler(async (req, res, next) => {
  req.query.giftWallet = req.params.cvId;
  return this.getGiftWallets(req, res, next);
});

export const createGiftWallet = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;
  req.body.apply = req.params.id;
  const giftWallet = await GiftWallet.create(req.body);

  res.status(200).json({ success: true, data: giftWallet });
});

export const updateGiftWallet = asyncHandler(async (req, res, next) => {
  const giftWallet = await GiftWallet.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!giftWallet) {
    return res
      .status(400)
      .json({ success: false, error: req.params.id + " ID-тай ажил байхгүй." });
  }
  res.status(200).json({ success: true, data: giftWallet });
});

export const deleteGiftWallet = asyncHandler(async (req, res, next) => {
  const giftWallet = await GiftWallet.findById(req.params.id);

  if (!giftWallet) {
    return res
      .status(400)
      .json({ success: false, error: req.params.id + " ID-тай ажил байхгүй." });
  }
  giftWallet.remove();
  res.status(200).json({ success: true, data: giftWallet });
});

import Gift from "../models/Gift.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
// api/v1/gifts
export const getGifts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Gift);

  const gifts = await Gift.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: gifts.length,
    data: gifts,
    pagination,
  });
});
export const getFilteredEggs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Gift.find(req.query));

  const gifts = await Gift.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: gifts.length,
    data: gifts,
    pagination,
  });
});

export const getGift = asyncHandler(async (req, res, next) => {
  const gift = await Gift.findById(req.params.id);

  if (!gift) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: gift,
  });
});

export const createGift = asyncHandler(async (req, res, next) => {
  const gift = await Gift.create(req.body);

  res.status(200).json({
    success: true,
    data: gift,
  });
});

export const deleteGift = asyncHandler(async (req, res, next) => {
  const gift = await Gift.findById(req.params.id);

  if (!gift) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  gift.remove();

  res.status(200).json({
    success: true,
    data: gift,
  });
});

export const updateGift = asyncHandler(async (req, res, next) => {
  const gift = await Gift.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!gift) {
    throw new MyError(req.params.id + " ID-тэй бүтээгдэхүүн байхгүй.", 400);
  }

  res.status(200).json({
    success: true,
    data: gift,
  });
});

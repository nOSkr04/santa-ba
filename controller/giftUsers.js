import GiftUser from "../models/GiftUser.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
// api/v1/giftUsers
export const getGiftUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, GiftUser.find(req.query));

  const giftUsers = await GiftUser.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: giftUsers.length,
    data: giftUsers,
    pagination,
  });
});

export const getGiftUser = asyncHandler(async (req, res, next) => {
  const giftUser = await GiftUser.findById(req.params.id);

  if (!giftUser) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: giftUser,
  });
});

export const createGiftUser = asyncHandler(async (req, res, next) => {
  const giftUser = await GiftUser.create(req.body);

  res.status(200).json({
    success: true,
    data: giftUser,
  });
});

export const deleteGiftUser = asyncHandler(async (req, res, next) => {
  const giftUser = await GiftUser.findById(req.params.id);

  if (!giftUser) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    giftUser.createUser.toString() !== req.userId &&
    req.userRole !== "giftUsermin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах хэрэгтэй", 403);
  }

  giftUser.remove();

  res.status(200).json({
    success: true,
    data: giftUser,
  });
});

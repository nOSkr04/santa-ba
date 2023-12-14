import AllEgg from "../models/AllEgg.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
// api/v1/allEggs
export const getAllEggs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, AllEgg.find(req.query));

  const allEggs = await AllEgg.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: allEggs.length,
    data: allEggs,
    pagination,
  });
});

export const getAllEgg = asyncHandler(async (req, res, next) => {
  const allEgg = await AllEgg.findById(req.params.id);

  if (!allEgg) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: allEgg,
  });
});

export const createAllEgg = asyncHandler(async (req, res, next) => {
  const allEgg = await AllEgg.create(req.body);

  res.status(200).json({
    success: true,
    data: allEgg,
  });
});

export const deleteAllEgg = asyncHandler(async (req, res, next) => {
  const allEgg = await AllEgg.findById(req.params.id);

  if (!allEgg) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    allEgg.createUser.toString() !== req.userId &&
    req.userRole !== "allEggmin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах хэрэгтэй", 403);
  }

  allEgg.remove();

  res.status(200).json({
    success: true,
    data: allEgg,
  });
});

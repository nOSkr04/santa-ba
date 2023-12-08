import Banner from "../models/Banner.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
// api/v1/banners
export const getBanners = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Banner.find(req.query));

  const banners = await Banner.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners,
    pagination,
  });
});

export const getBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: banner,
  });
});

export const createBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.create(req.body);

  res.status(200).json({
    success: true,
    data: banner,
  });
});

export const deleteBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    banner.createUser.toString() !== req.userId &&
    req.userRole !== "bannermin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах хэрэгтэй", 403);
  }

  banner.remove();

  res.status(200).json({
    success: true,
    data: banner,
  });
});

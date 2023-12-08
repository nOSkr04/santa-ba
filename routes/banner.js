import { Router } from "express";
import { protect } from "../middleware/protect.js";

import {
  getBanners,
  getBanner,
  createBanner,
  deleteBanner,
} from "../controller/banner.js";

const router = Router();

//"/api/v1/Banners"

router.route("/").get(getBanners).post(protect, createBanner);

router.route("/:id").get(getBanner).delete(protect, deleteBanner);

export default router;

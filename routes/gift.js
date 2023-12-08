import { Router } from "express";
import { protect } from "../middleware/protect.js";

import {
  getGifts,
  getGift,
  createGift,
  deleteGift,
} from "../controller/gift.js";

const router = Router();

//"/api/v1/Gifts"

router.route("/").get(getGifts).post(protect, createGift);

router.route("/:id").get(getGift).delete(protect, deleteGift);

export default router;

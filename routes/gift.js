import { Router } from "express";
import { protect } from "../middleware/protect.js";

import {
  getGifts,
  getGift,
  createGift,
  deleteGift,
  updateGift,
  getFilteredEggs,
} from "../controller/gift.js";

const router = Router();

//"/api/v1/Gifts"

router.route("/").get(getGifts).post(protect, createGift);
router.route("/filtered").get(getFilteredEggs);

router
  .route("/:id")
  .get(getGift)
  .delete(protect, deleteGift)
  .put(protect, updateGift);

export default router;

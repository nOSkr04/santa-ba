import { Router } from "express";
import { protect } from "../middleware/protect.js";

import {
  getGiftUsers,
  getGiftUser,
  createGiftUser,
  deleteGiftUser,
} from "../controller/giftUsers.js";

const router = Router();

//"/api/v1/GiftUsers"

router.route("/").get(getGiftUsers).post(protect, createGiftUser);

router
  .route("/:id")
  .post(protect, createGiftUser)
  .get(getGiftUser)
  .delete(protect, deleteGiftUser);

export default router;

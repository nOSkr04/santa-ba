import { Router } from "express";
const router = Router();
import { protect, authorize } from "../middleware/protect.js";

import {
  getGiftWallets,
  getGiftWallet,
  getCvGiftWallets,
  createGiftWallet,
  updateGiftWallet,
  deleteGiftWallet,
} from "../controller/giftWallets.js";

//"/api/v1/wallets"
router.route("/").get(getGiftWallets).post(protect, createGiftWallet);

router
  .route("/:id")
  .get(getGiftWallet)
  .put(protect, authorize("admin", "operator"), updateGiftWallet)
  .delete(protect, authorize("admin"), deleteGiftWallet);

router
  .route("/:cvId/wallet")
  .get(protect, authorize("admin"), getCvGiftWallets);
export default router;

import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  register,
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  logout,
  authMeUser,
  chargeTime,
  invoiceCheck,
  invoiceTime,
  loginCheckPassword,
  loginPhone,
  registerPassword,
  registerPhone,
  chargeGift,
  invoiceGiftCheck,
  invoiceGift,
  findPhone,
  findPhoneByGift,
} from "../controller/users.js";

const router = Router();

//"/api/v1/users"
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/loginCheckPhone").post(loginPhone);
router.route("/loginCheckPassword").post(protect, loginCheckPassword);
router.route("/registerCheckPhone").post(registerPhone);
router.route("/registerCheckPassword").post(protect, registerPassword);
router.route("/logout").get(logout);
router.route("/callbacks/:id/:numId").get(chargeTime);
router.route("/check/challbacks/:id/:numId").get(invoiceCheck);
router.route("/callbacks/gift/:id/:numId/:phone").get(chargeGift);
router.route("/check/challbacks/gift/:id/:numId/:phone").get(invoiceGiftCheck);
// router.route("/updatePrivacy").post(updatePrivacy);

router.use(protect);
//"/api/v1/users"
router
  .route("/")
  .get(authorize("admin"), getUsers)
  .post(authorize("admin"), createUser);
router.route("/find/:phone").get(protect, findPhone);
router.route("/giftUser").post(protect, findPhoneByGift);
router.route("/invoice/:id").post(invoiceTime);
router.route("/giftInvoice/:id").post(invoiceGift);
router.route("/delete").delete(protect, deleteUser);
router.route("/me").get(protect, authMeUser);
router.route("/:id").get(getUser).put(updateUser).delete(protect, deleteUser);

export default router;

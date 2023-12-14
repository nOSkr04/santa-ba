import { Router } from "express";
import { protect } from "../middleware/protect.js";

import {
  getAllEggs,
  getAllEgg,
  createAllEgg,
  deleteAllEgg,
} from "../controller/allEgg.js";

const router = Router();

//"/api/v1/AllEggs"

router.route("/").get(getAllEggs).post(protect, createAllEgg);

router.route("/:id").get(getAllEgg).delete(protect, deleteAllEgg);

export default router;

import { Router } from "express";
import {
  handleImageUpload,
  handleImageDelete,
  uploadMiddleware,
} from "../controllers/uploadController";

const router = Router();

router.post("/", uploadMiddleware.single("file"), handleImageUpload);
router.delete("/", handleImageDelete);

export default router;

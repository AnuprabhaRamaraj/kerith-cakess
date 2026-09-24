import { Router } from "express";
import {
  getImages,
  createImage,
  deleteImage,
} from "../controllers/imageController";

const router = Router();

router.get("/", getImages);
router.post("/", createImage);
router.delete("/", deleteImage);
router.delete("/:id", deleteImage);

export default router;

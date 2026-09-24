import { Router } from "express";
import {
  loginUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/authController";

const router = Router();

router.post("/login", loginUser);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/", updateUser);
router.delete("/", deleteUser);
router.delete("/:id", deleteUser);

export default router;

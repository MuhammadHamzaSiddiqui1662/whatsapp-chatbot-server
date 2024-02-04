import express from "express";
import { getAllStaff, getStaffWithId } from "./staff.service";
import { authenticateToken } from "../auth/auth.service";
import { Request } from "../../types";
import { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const staff = await getAllStaff();
    res.status(200).json(staff);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

router.get("/profile", authenticateToken, async (req: Request, res) => {
  try {
    const staff = await getStaffWithId((req.user as JwtPayload)._id);
    res.status(200).json(staff);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const staff = await getStaffWithId(req.params.id);
    res.status(200).json(staff);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

export default router;

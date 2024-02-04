import express from "express";
import { authenticateToken, login, signUp } from "./auth.service";
import { Request } from "../../types";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { cnic, password } = req.body;
    const staff = await login(cnic, password);
    if (staff) res.status(200).json(staff);
    else
      res.status(403).json({
        message: "wrong credentials",
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

router.post("/sign-up", async (req, res) => {
  try {
    const staff = await signUp(req.body.staff);
    res.status(200).json(staff);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

export default router;

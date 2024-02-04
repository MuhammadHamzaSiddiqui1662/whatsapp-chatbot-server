import express from "express";
import { getAllUsers, getUserWithId } from "./user.service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const complaints = await getAllUsers();
    res.status(200).json(complaints);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserWithId(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

export default router;

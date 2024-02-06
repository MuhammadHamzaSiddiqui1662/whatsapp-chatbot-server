import express from "express";
import { getAllComplaints, updateComplaintStatus } from "./complaint.service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const complaints = await getAllComplaints(req.query);
    res.status(200).json(complaints);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const complaint = await updateComplaintStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json(complaint);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

export default router;

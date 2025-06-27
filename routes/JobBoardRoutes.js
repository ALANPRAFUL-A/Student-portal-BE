import express from "express";
import JobBoardSchema from "../models/JobBoard.js"
const JobBoardRouter = express.Router();

JobBoardRouter.post("/" , async(req , res) => {
    try{
        const {role , company , location , contact } = req.body;
        const newJobPost = new JobBoardSchema({role , company , location , contact });
        await newJobPost.save()
        res.status(201).json(newJobPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating Jobs", error });
  }
}
)


JobBoardRouter.get("/", async (req, res) => {
  try {
    const jobs = await JobBoardSchema.find().sort({ date: 1 }); 
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Jobs", error });
  }
});

JobBoardRouter.delete("/:id", async (req, res) => {
  try {
    await JobBoardSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
});

export default JobBoardRouter
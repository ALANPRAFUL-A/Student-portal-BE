import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import resumeChecker from "./resumeChecker.js";
import eventRouter from "./routes/EventRoutes.js";
import forumRouter from "./routes/ForumRoutes.js";
import clubRouter from "./routes/ClubRoutes.js";
import studentDashboardRouter from './routes/studentDashboard.js';
import authRoutes from "./routes/authRoutes.js";
import JobBoardRouter from "./routes/JobBoardRoutes.js"









dotenv.config(); 
const app = express();


const allowedOrigins = [
  "https://ephemeral-daffodil-28e8d0.netlify.app",
  "https://warm-frangollo-91690f.netlify.app",
  "tangerine-lebkuchen-89f579.netlify.app"
];

app.options(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log("🌐 Incoming request from origin:", req.headers.origin);
  next();
});




const PORT = process.env.PORT || 5500;


app.use(express.json());

app.use("/api/forum", forumRouter);

app.use("/api/events" , eventRouter)

app.use("/api/clubs", clubRouter);

app.use("/api/student", studentDashboardRouter);

app.use("/api/auth", authRoutes);

app.use("/api/jobs" , JobBoardRouter)

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const result = await resumeChecker(filePath);
    fs.unlinkSync(filePath); 

    res.json(result);
  } catch (err) {
    console.error("Resume checker failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })


import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  password : String,
  courses: [String],
  upcomingEvents: [String],
});

export default mongoose.model("Student", StudentSchema);

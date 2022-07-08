import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: String,
  password: String,
});

export default mongoose.model("User", userSchema);

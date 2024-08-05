import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  CName: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
  },
  Degree: {
    type: String,
    required: true,
  },
  Year: {
    type: String,
    required: true,
  },
});
const Education = mongoose.model("Education", educationSchema);
export default Education;

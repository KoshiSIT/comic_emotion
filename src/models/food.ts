import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  calories: {
    type: Number,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("Calories must be a positive number");
      }
    },
  },
});

const FoodModel = mongoose.model("Food", foodSchema);

export default FoodModel;

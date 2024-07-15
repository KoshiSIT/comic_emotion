import express from "express";
import foodModel from "../models/food";
import { protect } from "../middleware/authMiddleware";
import { AuthRequest } from "../middleware/authMiddleware";

const app = express();
app.use(express.json());
app.get("/foods", protect, async (req: AuthRequest, res) => {
  const foods = await foodModel.find({});
  const resObj: object = {
    user: req.user?.name,
    data: foods,
  };
  try {
    res.send(resObj);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/food", async (req, res) => {
  const food = new foodModel(req.body);
  try {
    await food.save();
    res.send(food);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch("/food/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const updatefood = await foodModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!updatefood) {
      return res.status(404).send("food not found");
    }
    res.send(updatefood);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/food/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    await foodModel.findByIdAndDelete(_id);
    res.send("food deleted");
  } catch (error) {
    return res.status(500).send(error);
  }
});
const foodRouter = app;

export default foodRouter;

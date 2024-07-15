import Express from "express";
import mongoose from "mongoose";
import foodRouter from "./routes/foodRoutes";
import authRouter from "./routes/authRoutes";
import measurementRouter from "./routes/measurementRoutes";
import dotenv from "dotenv";
// import bcrypt from "bcrypt";

// password hashing
// const saltRounds = 10;

dotenv.config();

const app = Express();

app.use(foodRouter);
app.use(authRouter);
app.use(measurementRouter);
const port = 3000;

// Connect to MongoDB
console.log(process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: unknown) => {
    console.log("Error connecting to MongoDB: ", error);
  });

app.get("/", (req, res) => {
  const data = { message: "Hello World!" };
  res.send(data);
});

app.listen(process.env.PORT || port, () => {
  console.log("Server is running on localhost:%d", port);
});

// mongodb+srv://al20092:<password>@cluster0.naxn3it.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

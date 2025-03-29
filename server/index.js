// server setup
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Import routes
import fishroute from "./routes/fishpriceRoute.js";
import userRouter from "./routes/userRoute.js";
import Catchroute from "./routes/catchRoute.js";
import fishermenroute from "./routes/fishermenRoute.js";
import employeeroute from "./routes/employeeRoute.js";
import boattriproute from "./routes/boatTripRoute.js";
import vehicleroute from "./routes/VehicleRoute.js";
import equipmentroute from "./routes/equipmentRoute.js";
import buyerroute from "./routes/fishbuyerRoute.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGOURL;


if (!MONGO_URL) {
  console.error("❌ MongoDB connection string is missing. Check your .env file!");
  process.exit(1);
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/fish", fishroute);
app.use("/api/user", userRouter);
app.use("/api/employee", employeeroute);
app.use("/api/boattrip", boattriproute);
app.use("/api/catch", Catchroute);
app.use("/api/fishermen", fishermenroute);
app.use("/api/vehicle", vehicleroute);
app.use("/api/equipment", equipmentroute);
app.use("/api/buyer", buyerroute);

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  });

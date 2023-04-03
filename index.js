import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();

const whitelist = [
  "https://walle-frontend.vercel.app/",
  "http://localhost:5173/",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", cors(corsOptions), postRoutes);
app.use("/api/v1/dalle", cors(corsOptions), dalleRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello from DALL.E!",
  });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(4000, () => console.log("Server started on port 4000"));
  } catch (error) {
    console.log(error);
  }
};

startServer();

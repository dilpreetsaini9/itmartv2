import "dotenv/config";
import cors from "cors";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// my imports
import { api } from "./routes/frontPageRoutes.js";
import { admin } from "./routes/adminPageRoutes.js";

const app = express();

// connecting to mongoDB and listening to port
mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log("MONGO - 200");
    app.listen(process.env.PORT, () => {
      console.log(`PORT - ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// cors
app.use(cors());

// Middleware to serve static files from the 'public/app' directory
app.use("/", express.static(path.join(__dirname, "public/app")));

// Middleware to serve static files from the 'public/admin' directory
app.use("/admin", express.static(path.join(__dirname, "public/admin")));

// Route for serving index.html at the root URL "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/app", "index.html"));
});

// Route for serving index.html at the "/admin" URL
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/app", "index.html"));
});

// all routes
app.use("/api/v1", api);
app.use("/api/admin", admin);

// route for static images (public)
app.use("/photos", express.static(path.join(__dirname, "uploads")));

// handle invalid routes
app.get("*", (req, res) => {
  res.redirect("https://itsmyitmart.store");
});

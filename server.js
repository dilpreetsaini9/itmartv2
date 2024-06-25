import "dotenv/config";
import cors from "cors";
import path from "path";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { api } from "./routes/frontPageRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import { admin } from "./routes/adminPageRoutes.js";

const app = express();

app.listen(process.env.PORT, () =>
  console.log(`Server Running on ${process.env.PORT}`)
);

app.use(cors());

app.use("/", express.static(path.join(__dirname, "public/app")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/app", "index.html"));
});

app.use("/api/v1", api);
// app.use("/admin/v1", admin);
app.use("/photos", express.static(path.join(__dirname, "uploads")));
app.get("*", (req, res) => {
  res.redirect("https://itsmyitmart.store");
});

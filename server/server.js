import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/Index.js";
import routerA3 from "./routes/A3Index.js";
dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    return res.status(400).json({ Code: "400" });
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ Code: "400" });
  }
  next();
});

// app.use(router);
app.use(routerA3);

app.all("*", (req, res, next) => {
  return res.status(404).json({ Code: "404" });
  next();
});

app.listen(3001, () => console.log("Server running at port 3001"));

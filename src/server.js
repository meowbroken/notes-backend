import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";


dotenv.config();
console.log(process.env.MONGO_URI);

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(express.json()); 
app.use(cookieParser());
app.use((req, res, next) => { 
  console.log(`${req.method} ${req.url}`);
  next(); 
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


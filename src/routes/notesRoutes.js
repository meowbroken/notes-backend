import express from "express";
import { fetchNotes, createNote, updateNote, deleteNote, getNoteById  } from "../controllers/notesController.js";

const router = express.Router();

router.get("/", fetchNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

/*router.get("/api/not", (req, res) => {
  res.status(200).send("Hello!");
});

router.post("/api", (req, res) => {
  res.status(201).json({ message: "Data received successfully!" });
});

router.put("/api/:id", (req, res) => {
  res.status(201).json({ message: "Data updated successfully!" });
});

router.delete("/api/:id", (req, res) => { 
  res.status(201).json({ message: "Data deleted successfully!" });
});
*/
export default router;
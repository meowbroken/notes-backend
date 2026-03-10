import express from "express";
import { fetchNotes, createNote, updateNote, deleteNote, getNoteById  } from "../controllers/notesController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, fetchNotes);
router.get("/:id", requireAuth, getNoteById);
router.post("/", requireAuth, createNote);
router.put("/:id", requireAuth, updateNote);
router.delete("/:id", requireAuth, deleteNote);


export default router;
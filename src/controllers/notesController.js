import Note from "../models/Note.js"

export async function fetchNotes(req, res) {
try {
  const notes = await Note.find();
  res.status(200).json(notes);
} catch (error) {
  console.error("Error fetching notes:", error);
  res.status(500).json({ message: "Error fetching notes" });
}};

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if(!note) {
      return res.status(404).json({ message: "Note not found" });
    } 
    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Error fetching note" });  
  }
}
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    await note.save(); 
    res.status(201).json({ message: "Note created successfully!" });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note" });
  }
};
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if(!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note updated successfully!" });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note" });
  }
};
export async function deleteNote(req, res) {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if(!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) { 
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note" });
  }
};

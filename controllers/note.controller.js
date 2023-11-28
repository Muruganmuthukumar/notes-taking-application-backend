import Note from '../models/note.model.js'
import client from '../redis.js'

export const getAllNotes = async (req, res) => {
  try {
    const notes =await client.get('notes')
    // console.log(notes)
    if (notes != null) {
      res.json(JSON.parse(notes));
    } else {
      const userId = req.headers['user-id'];
      const notes = await Note.find({ userId }); 
      client.setEx('notes', 3600, JSON.stringify(notes))
      res.json(notes);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    userId: req.body.userId,
  });

  try {
    const newNote = await note.save();
    client.del('notes')
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } 
    );

    if (updatedNote) {
      client.del('notes')
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (deletedNote) {
      client.del('notes')
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

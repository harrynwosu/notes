const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const notes = await Note
                      .find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  } catch(error) {
    next(error);
  }

});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const user = User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });

  try {
    const savedNote = await note.save();

    user.notes = user.notes.concat(user.id);
    await user.save();

    response.status(201).json(savedNote);
  } catch(error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  try{
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch(error) {
    next(error);
  }
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true })
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => next(error));
});

module.exports = notesRouter;
const Note = require("../models/note");
const User = require("../models/user");

const initialNotes = [
    {
      content: "HTML is easy",
      important: false,
    },
    {
      content: "Browser can execute only JavaScript",
      important: true,
    },
];

const notesInDb = async () => {
    const notes = await Note.find({});
    console.log(notes);
    return notes.map(note => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  console.log(users);
  return users.map(user => user.toJSON());
};

module.exports = {
    initialNotes,
    notesInDb,
    usersInDb,
};
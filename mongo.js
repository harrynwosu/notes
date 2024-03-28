const mongoose = require("mongoose");

if (process.argv.length<3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

// main url
// const url =
//   `mongodb+srv://haroldnwosu:${password}@cluster0.hhbc8xk.mongodb.net/noteApp?retryWrites=true&w=majority`;

//  test url
const url = `mongodb+srv://haroldnwosu:${password}@cluster0.rkbz218.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery",false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note1 = new Note({
  content: "Mongo is the database",
  important: true,
});

note1.save().then(result => {
    console.log("note 1 saved!");
    console.log(result);
    // mongoose.connection.close();
});

const note2 = new Note({
  content: "Trying out testing DB",
  important: false,
});

note2.save().then(result => {
    console.log("note 2 saved!");
    console.log(result);
    mongoose.connection.close();
});

// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note);
//     });
//     mongoose.connection.close();
// });
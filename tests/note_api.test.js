const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
    await Note.deleteMany({});
    console.log("Database cleared");

    const noteObjects = helper.initialNotes.map(note => new Note(note));
    const savedNotesPromises = noteObjects.map(noteObject => {
        return noteObject.save();
    });
    const results = await Promise.all(savedNotesPromises);
    console.log("save promises", results);
    console.log("Done saving all notes");
});

test("notes are returned as json", async () => {
    console.log("test started");
    await api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type", /application\/json/);
});

test("all notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    console.log(response.body);

    const contents = response.body.map(response => response.content);
    expect(contents).toContain("Browser can execute only JavaScript");
});

test("valid note can be added", async () => {
    const newNote = {
        content: "async/await simplifies async calls",
        important: true,
    };

    await api
            .post("/api/notes")
            .send(newNote)
            .expect(201)
            .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/notes");

    const addedNotes = await helper.notesInDb();
    expect(addedNotes).toHaveLength(helper.initialNotes.length + 1);

    const contents = addedNotes.map(note => note.content);
    expect(contents).toContain("async/await simplifies async calls");

});

test("note without content is invalid and not added", async () => {
    const newNote = {
        important: false,
    };

    await api
            .post("/api/notes")
            .send(newNote)
            .expect(400);

    const addedNotes = await helper.notesInDb();
    expect(addedNotes).toHaveLength(helper.initialNotes.length);
});

test("a specific note can be viewed", async () => {
    console.log("test started");
   const notes = await helper.notesInDb();
   const noteToView = notes[0];

   const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(resultNote.body).toEqual(noteToView);
});

test("a note can be deleted", async () => {
    const notesBeforeDelete = await helper.notesInDb();
    const noteToDelete = notesBeforeDelete[0];

    await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204);

    const notesAfterDelete = await helper.notesInDb();
    expect(notesAfterDelete).toHaveLength(notesBeforeDelete.length - 1);

    const noteContents = notesAfterDelete.map(note => note.content);
    expect(noteContents).not.toContain(noteToDelete.content);
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log("Connection closed");
});
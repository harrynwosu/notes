const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");
const supertest = require("supertest");

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    console.log("Database cleared");

    const passwordHash = await bcrypt.hash("sekret", 10);

    const user = new User({ username: "harry", name: "harold", passwordHash });
    await user.save();
});

describe("user creation", () => {
    test("successful creation of a user", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "theflash",
            name: "Barry",
            password: "iriswest"
        };

        await api
                .post("/api/users")
                .send(newUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    });

    test("duplicate usernames not allowed", async () => {
        const usersBeforeAdd = await helper.usersInDb();

        const newUser = {
            username: "harry",
            name: "Jioke",
            password: "harryjioke"
        };

        const result = await api
                                .post("/api/users")
                                .send(newUser)
                                .expect(400)
                                .expect("Content-Type", /application\/json/);

        const usersAfterAdd = await helper.usersInDb();
        expect(result.body.error).toContain("`username` to be unique");
        expect(usersAfterAdd).toHaveLength(usersBeforeAdd.length);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log("Mongo connection closed");
});
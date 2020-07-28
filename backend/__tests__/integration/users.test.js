process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");

// app imports
const app = require("../../app");

// model imports
const User = require("../../models/user");

const {
  TEST_DATA,
  afterEachHook,
  afterAllHook,
  beforeAllHook,
  beforeEachHook
} = require("./config");


beforeAll(async function() {
  await beforeAllHook();
});


beforeEach(async function() {
  await beforeEachHook(TEST_DATA);
});


afterEach(async function() {
  await afterEachHook();
});


afterAll(async function() {
  await afterAllHook();
});


describe("Users routes test", function() {

  describe("GET /users", function() {

    test("Gets a list of 1 user", async function() {
      const response = await request(app)
        .get("/users")
        .send({ token: `${TEST_DATA.userToken}` });
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0]).toHaveProperty("username");
      expect(response.body.users[0]).not.toHaveProperty("password");
    });

    test("Gets a single a user", async function() {
      const response = await request(app)
        .get(`/users/${TEST_DATA.currentUserId}`)
        .send({ token: `${TEST_DATA.userToken}` });
      expect(response.body.user).toHaveProperty("username");
      expect(response.body.user).not.toHaveProperty("password");
      expect(response.body.user.username).toBe("test");
    });

    test("Responds with a 401 user not found ie. not the same user", async function() {
      const response = await request(app)
        .get(`/users/${TEST_DATA.currentUserId + 10}`)
        .send({ token: `${TEST_DATA.userToken}` });
      expect(response.statusCode).toBe(401);
    });
  });

});

describe("PATCH /users/:userId", async () => {
  test("Updates a single a user's first_name with a selective update", async function() {
    const response = await request(app)
      .patch(`/users/${TEST_DATA.currentUserId}`)
      .send({ first_name: "newName", token: `${TEST_DATA.userToken}` });
    const user = response.body.user;
    expect(user).toHaveProperty("username");
    expect(user).not.toHaveProperty("password");
    expect(user.first_name).toBe("newName");
    expect(user.username).not.toBe(null);
  });

  test("Updates a single a user's password", async function() {
    const response = await request(app)
      .patch(`/users/${TEST_DATA.currentUserId}`)
      .send({ token: `${TEST_DATA.userToken}`, password: "new_password" });

    const user = response.body.user;
    expect(user).toHaveProperty("username");
    expect(user).not.toHaveProperty("password");
  });

  test("Forbids a user from editing another user", async function() {
    const response = await request(app)
      .patch(`/users/notme`)
      .send({ password: "secret", token: `${TEST_DATA.userToken}` });
    expect(response.statusCode).toBe(401);
  });

  test("Responds with a 404 if it cannot find the user in question", async function() {
    // delete user first
    await request(app)
      .delete(`/users/${TEST_DATA.currentUserId}`)
      .send({ token: `${TEST_DATA.userToken}` });
    const response = await request(app)
      .patch(`/users/${TEST_DATA.currentUserId}`)
      .send({ password: "secret", token: `${TEST_DATA.userToken}` });
    expect(response.statusCode).toBe(404);
  });
});


describe("DELETE /users/:userId", async function() {
  test("Deletes a single a user", async function() {
    const response = await request(app)
      .delete(`/users/${TEST_DATA.currentUserId}`)
      .send({ token: `${TEST_DATA.userToken}` });
    expect(response.body).toEqual({ message: `User(${TEST_DATA.currentUsername}) deleted` });
  });

  test("Forbids a user from deleting another user", async function() {
    const response = await request(app)
      .delete(`/users/notme`)
      .send({ token: `${TEST_DATA.userToken}` });
    expect(response.statusCode).toBe(401);
  });

  test("Responds with a 404 if it cannot find the user in question", async function() {
    // delete user first
    await request(app)
      .delete(`/users/${TEST_DATA.currentUserId}`)
      .send({ token: `${TEST_DATA.userToken}` });
    const response = await request(app)
      .delete(`/users/${TEST_DATA.currentUserId}`)
      .send({ token: `${TEST_DATA.userToken}` });
    expect(response.statusCode).toBe(404);
  });
});

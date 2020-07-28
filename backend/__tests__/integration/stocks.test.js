process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");

// app imports
const app = require("../../app");

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


describe("GET /stocks", function() {

  test("Gets a list of 1 stock", async function() {
    const response = await request(app)
      .get("/stocks").query({ symbol: "" });
    expect(response.body.stocks).toHaveLength(1);
    expect(response.body.stocks[0]).toHaveProperty("symbol");
    expect(response.body.stocks[0]).toHaveProperty("name");
    expect(response.body.stocks[0]).toHaveProperty("exchange");
  });

});
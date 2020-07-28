process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");

// app imports
const app = require("../../app");
const ApiHelper = require('../../helpers/apiHelper');
jest.mock('../../helpers/apiHelper');

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


describe("GET /portfolios", function() {

  test("returns an array of single portfolio", async function() {
    const res = await request(app)
      .get(`/portfolios`)
      .query({ token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(200);
    TEST_DATA.portfolio.investments = [{ id: expect.any(Number), symbol: TEST_DATA.stock.symbol }];
    expect(res.body.portfolios)
      .toEqual([{
        ...TEST_DATA.portfolio,
        created_at: TEST_DATA.portfolio.created_at.toISOString()
      }]);
  });

  test("returns a portfolio", async function() {
    const res = await request(app)
      .get(`/portfolios/${TEST_DATA.portfolio.id}`)
      .query({ token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(200);
    TEST_DATA.portfolio.investments = [{
      id: expect.any(Number), symbol: TEST_DATA.stock.symbol,
      end_date: expect.any(String), start_date: expect.any(String),
      initial_price: null, initial_value: expect.any(Number),
    }];
    expect(res.body.portfolio)
      .toEqual({
        ...TEST_DATA.portfolio,
        created_at: TEST_DATA.portfolio.created_at.toISOString()
      });
  });

  test("fails to find a portfolio and returns 404", async function() {
    const res = await request(app)
      .get(`/portfolios/${TEST_DATA.portfolio.id + 100}`)
      .query({ token: TEST_DATA.userToken });;

    expect(res.statusCode).toBe(404);
  });

});

describe("POST /portfolios", function() {

  test("creates a portfolio in database and returns it", async function() {
    const { id, ...portfolio } = TEST_DATA.portfolio;
    portfolio.name = "beta";
    const res = await request(app)
      .post("/portfolios")
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(201);
    const dbResult = (await request(app)
      .get(`/portfolios/${res.body.portfolio.id}`)
      .query({ token: TEST_DATA.userToken })).body;
    // /:id returns company object instead of company_handle
    expect(res.body).toEqual(dbResult);
  });

  test("fails to create portfolio with duplicate name", async function() {
    const { id, ...portfolio } = TEST_DATA.portfolio;
    const res = await request(app)
      .post("/portfolios")
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(403);
  });

});

describe("POST /portfolios, validations", function() {

  let portfolio;
  beforeEach(function() {
    portfolio = { ...TEST_DATA.portfolio };
    portfolio.name = "beta";
    delete portfolio.id;
  });

  test("fails with 400 for missing name data", async () => {
    delete portfolio.name;
    const res = await request(app)
      .post("/portfolios")
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });

  test("fails with 400 for invalid type, name must be a string", async () => {
    portfolio.name = 0;
    const res = await request(app)
      .post("/portfolios")
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });

});

describe("PATCH /portfolios/:id", function() {

  test("updates a portfolio in database and returns it", async function() {
    const { id, ...portfolio } = TEST_DATA.portfolio;
    portfolio.name = "beta";
    const res = await request(app)
      .patch(`/portfolios/${TEST_DATA.portfolio.id}`)
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.status).toBe(200);
    const dbResult = (await request(app)
      .get(`/portfolios/${res.body.portfolio.id}`)
      .query({ token: TEST_DATA.userToken })).body;
    res.body.portfolio.investments = expect.any(Array);
    expect(res.body).toEqual(dbResult);
  });

  test("fails to update portfolio with a duplicate name", async function() {
    const { id, ...portfolio } = TEST_DATA.portfolio;
    portfolio.name = "beta";
    await request(app)
      .post("/portfolios")
      .send({ ...portfolio, token: TEST_DATA.userToken });

    const res = await request(app)
      .patch(`/portfolios/${TEST_DATA.portfolio.id}`)
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(403);
  });

});

describe("PATCH /portfolios, validations", function() {

  let portfolio;
  beforeEach(function() {
    portfolio = { ...TEST_DATA.portfolio };
    portfolio.name = "beta";
    delete portfolio.id;
  });

  test("fails with 400 for invalid type, name must be a string", async () => {
    portfolio.name = 0;
    const res = await request(app)
      .patch(`/portfolios/${TEST_DATA.portfolio.id}`)
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });

  test("fails with 400 for name > 32 characters", async () => {
    portfolio.name = "a".repeat(35);
    const res = await request(app)
      .patch(`/portfolios/${TEST_DATA.portfolio.id}`)
      .send({ ...portfolio, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });

});

describe("DELETE /portfolios/:id", function() {
  test("removes a portfolio", async function() {
    const res = await request(app)
      .delete(`/portfolios/${TEST_DATA.portfolio.id}`)
      .send({ token: TEST_DATA.userToken });;
    expect(res.status).toBe(200);

    const res2 = await request(app)
      .get(`/portfolios/${TEST_DATA.portfolio.id}`)
      .query({ token: TEST_DATA.userToken });
    expect(res2.status).toBe(404);
  });

  test("fails to remove a non-existing portfolio and returns 404", async function() {
    const res = await request(app)
      .delete(`/portfolios/${TEST_DATA.portfolio.id + 10}`)
      .send({ token: TEST_DATA.userToken });;
    expect(res.status).toBe(404);
  });
});

describe("GET /portfolios/chart/:portfolioId", function() {
  beforeEach(() => {
    ApiHelper.mockClear();
  });

  test("returns chart info", async function() {
    ApiHelper.getSingleDataPoint.mockResolvedValue({ date: new Date().toISOString(), close: 100 });
    ApiHelper.getLastClose.mockResolvedValue({ date: new Date().toISOString(), close: 100 });
    ApiHelper.getChartData.mockResolvedValue([
      { date: new Date().toISOString(), close: 100 }
    ]);

    const res = await request(app)
      .get(`/portfolios/chart/${TEST_DATA.portfolio.id}`)
      .query({ token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("interests");
    expect(res.body.interests[0]).toHaveProperty("date");
    expect(res.body.interests[0]).toHaveProperty(TEST_DATA.stock.symbol);
    expect(res.body).toHaveProperty("cutoffs");
  });
});
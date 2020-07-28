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


describe("GET /investments", function() {

  test("returns an investment", async function() {
    const res = await request(app)
      .get(`/investments/${TEST_DATA.investment.id}`)
      .query({ token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.investment)
      .toEqual({
        ...TEST_DATA.investment,
        end_date: TEST_DATA.investment.end_date.toISOString(),
        start_date: TEST_DATA.investment.start_date.toISOString(),
      });
  });

  test("fails to find a investment and returns 404", async function() {
    const res = await request(app)
      .get(`/investments/${TEST_DATA.investment.id + 100}`)
      .query({ token: TEST_DATA.userToken });;

    expect(res.statusCode).toBe(404);
  });
});

describe("POST /investments", function() {

  test("creates a investment in database and returns it", async function() {
    const investment = {
      initial_value: 1000, symbol: TEST_DATA.appleStock.symbol,
      portfolio_id: TEST_DATA.portfolio.id,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(201);
    const dbResult = (await request(app)
      .get(`/investments/${res.body.investment.id}`)
      .query({ token: TEST_DATA.userToken })).body;
    // /:id returns company object instead of company_handle
    expect(res.body).toEqual(dbResult);
  });

  test("fails to create investment with duplicate symbol", async function() {
    const investment = {
      initial_value: 1000, symbol: TEST_DATA.stock.symbol,
      portfolio_id: TEST_DATA.portfolio.id,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(403);
  });

  test("fails to create investment under non-existing portfolio_id and returns 403", async function() {
    const investment = {
      initial_value: 1000, symbol: TEST_DATA.stock.symbol,
      portfolio_id: TEST_DATA.portfolio.id + 10,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(404);
  });

  test("fails to create investment under non-existing symbol and returns 403", async function() {
    const investment = {
      initial_value: 1000, symbol: TEST_DATA.stock.symbol + "DNE",
      portfolio_id: TEST_DATA.portfolio.id,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(403);
  });
});

describe("POST /investments, validations", function() {

  let investment;
  beforeEach(function() {
    investment = {
      initial_value: 1000, symbol: TEST_DATA.appleStock.symbol,
      portfolio_id: TEST_DATA.portfolio.id,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
  });

  test.each([
    "initial_value", "portfolio_id", "symbol", "start_date"
  ])("fails with 400 for missing %s data", async (field) => {
    delete investment[field];
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });

  test.each([
    "symbol", "start_date", "end_date"
  ])("fails with 400 for invalid type, %s must be a string", async (field) => {
    investment[field] = 0;
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });

  test.each([
    "initial_value", "portfolio_id"
  ])("fails with 400 for invalid type, %s must be a number", async (field) => {
    investment[field] = "";
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });


  test.each([
    "start_date", "end_date"
  ])("fails with 400 for invalid type, %s must conform to date format", async (field) => {
    investment[field] = "2000";
    const res = await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });
});

describe("PATCH /investments/:id", function() {

  test("updates a investment in database and returns it", async function() {
    const investment = {
      initial_value: 1000, symbol: TEST_DATA.appleStock.symbol,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
    const res = await request(app)
      .patch(`/investments/${TEST_DATA.investment.id}`)
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(200);
    const dbResult = (await request(app)
      .get(`/investments/${res.body.investment.id}`)
      .query({ token: TEST_DATA.userToken })).body;
    // /:id returns company object instead of company_handle
    expect(res.body).toEqual(dbResult);
  });

  test("fails to update investment with a duplicate symbol", async function() {
    const investment = {
      initial_value: 1000, symbol: TEST_DATA.appleStock.symbol,
      portfolio_id: TEST_DATA.portfolio.id,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
    await request(app)
      .post("/investments")
      .send({ ...investment, token: TEST_DATA.userToken });

    delete investment.portfolio_id;
    const res = await request(app)
      .patch(`/investments/${TEST_DATA.investment.id}`)
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(403);
  });

  test("fails to update investment under non-existing symbol and returns 403", async function() {
    const investment = {
      initial_value: 1000, symbol: TEST_DATA.stock.symbol + "DNE",
      portfolio_id: TEST_DATA.portfolio.id,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
    const res = await request(app)
      .patch(`/investments/${TEST_DATA.investment.id}`)
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(403);
  });

});

describe("PATCH /investments, validations", function() {

  let investment;
  beforeEach(function() {
    investment = {
      initial_value: 1000, symbol: TEST_DATA.appleStock.symbol,
      start_date: new Date('2020-01-10').toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    };
  });

  test.each([
    "symbol", "start_date", "end_date"
  ])("fails with 400 for invalid type, %s must be a string", async (field) => {
    investment[field] = 0;
    const res = await request(app)
      .patch(`/investments/${TEST_DATA.investment.id}`)
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });

  test("fails with 400 for invalid type, initial_value must be a number", async function() {
    investment.initial_value = "";
    const res = await request(app)
      .patch(`/investments/${TEST_DATA.investment.id}`)
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });


  test.each([
    "start_date", "end_date"
  ])("fails with 400 for invalid type, %s must conform to date format", async (field) => {
    investment[field] = "2000";
    const res = await request(app)
      .patch(`/investments/${TEST_DATA.investment.id}`)
      .send({ ...investment, token: TEST_DATA.userToken });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /investments/:id", function() {
  test("removes a investment", async function() {
    const res = await request(app)
      .delete(`/investments/${TEST_DATA.investment.id}`)
      .send({ token: TEST_DATA.userToken });;
    expect(res.status).toBe(200);

    const res2 = await request(app)
      .get(`/investments/${TEST_DATA.investment.id}`)
      .query({ token: TEST_DATA.userToken });
    expect(res2.status).toBe(404);
  });

  test("fails to remove a non-existing investment and returns 404", async function() {
    const res = await request(app)
      .delete(`/investments/${TEST_DATA.investment.id + 10}`)
      .send({ token: TEST_DATA.userToken });;
    expect(res.status).toBe(404);
  });
});

describe("GET /investments/interest/:id", function() {
  beforeEach(() => {
    ApiHelper.mockClear();
  });

  test("returns interest info", async function() {
    ApiHelper.getSingleDataPoint.mockResolvedValue({ date: new Date().toISOString(), close: 100 });
    ApiHelper.getLastClose.mockResolvedValue({ date: new Date().toISOString(), close: 100 });
    ApiHelper.getChartData.mockResolvedValue([
      { date: new Date().toISOString(), close: 100 }
    ]);
    const res = await request(app)
      .get(`/investments/interest/${TEST_DATA.investment.id}`)
      .query({ token: TEST_DATA.userToken });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("symbol");
    expect(res.body).toHaveProperty("start_date");
    expect(res.body).toHaveProperty("end_date");
    expect(res.body).toHaveProperty("interest");
  });
});
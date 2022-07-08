const request = require("supertest");
import app from "../app";

test("post login", async () => {
  const response = await request(app.callback())
    .post("/login")
    .query({ phone: "13696977705", password: "123456" });
  expect(response.status).toBe(200);
});

import { agent as _agent } from "supertest";
import axios from "axios";
const server = require("../backend/server");
const dotenv = require("dotenv");
import connectDB from "../backend/config/db";
//import db from "./config/database";
const request = require("supertest");

const agent = _agent(server);

//beforeAll(async () => await db.connect());
//afterEach(async () => await db.clear());
//afterAll(async () => await db.close());
dotenv.config();
connectDB();

test("Registration test", async () => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const response = await axios.post(
    "http://localhost:5000/api/user",
    {
      name: "dfertyrth",
      email: "sucker",
      password: "fsdfsdfs",
      publicKey: "fssdfgs",
      activated: true,
      privateKeyCipher: "dffgdgfhrtht",
    },
    config
  );
  expect(response.status).toBe(201);
});

test("Authentication test", async () => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const response = await axios.post(
    "http://localhost:5000/api/user/login",
    {
      email: "wfsffsfsfg",
      password: "fsdfsdfs",
    },
    config
  );
  expect(response.status).toBe(201);
});

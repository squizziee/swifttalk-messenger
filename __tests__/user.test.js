import { agent as _agent } from "supertest";
import axios from "axios";
const server = require("../backend/server");
const dotenv = require("dotenv");
import connectDB from "../backend/config/db";
import User from "../backend/models/userModel";
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

test("User update test", async () => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const user = User.findOne({ email: "wfsffsfsfg" });
  const response = await axios.post(
    "/api/user/edit",
    {
      user,
      pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    config
  );
  expect(response.status).toBe(200);
});

test("User search test", async () => {
  const search = " ";
  const user = User.findOne({ email: "wfsffsfsfg" });
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.get(`/api/user?search=${search}`, config);
  expect(response.status).toBe(200);
});

test("Group create test", async () => {
  const user = User.findOne({ email: "wfsffsfsfg" });
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.post(
    `/api/chat/group`,
    {
      name: "random",
      users: JSON.stringify(selectedUsers.map((u) => u._id)),
    },
    config
  );
  expect(response.status).toBe(400);
});

test("Group rename test", async () => {
  const user = User.findOne({ email: "wfsffsfsfg" });
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.post(
    `/api/chat/group`,
    {
      name: "random",
    },
    config
  );
  expect(response.status).toBe(400);
});

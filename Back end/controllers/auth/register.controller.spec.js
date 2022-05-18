import * as controller from "./register.controller.js";
import bcrypt from "bcryptjs";
import { createToken } from "../../services/auth.js";
import { User } from "../../model/user.model.js";

jest.mock("../../model/user.model.js");
jest.mock("bcryptjs");
jest.mock("../../services/auth.js");

describe("Given the register controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: {} };
    res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    next = jest.fn();
  });
  describe("When registerUser is triggered", () => {
    describe("And it works (promise is resolved)", () => {
      test("Then call json", async () => {
        req.body = {
          name: "CRdR",
          email: "crdr@crdr.com",
          password: "5555",
        };
        bcrypt.hashSync.mockReturnValue("encrypted1234");
        User.create.mockReturnValue({
          name: "CRdR",
          email: "crdr@crdr.com",
          password: "encrypted1234",
          id: 1,
        });
        createToken.mockReturnValue("mock_token");

        await controller.registerUser(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
          token: "mock_token",
          userName: "CRdR",

          id: 1,
        });
      });
    });
    describe("And it does not works (promise is rejected)", () => {
      test("Then call next", async () => {
        req.body = { name: "CRdR", password: "5555" };
        bcrypt.hashSync.mockReturnValue("encrypted1234");
        User.create.mockRejectedValue(new Error("Error adding user"));
        await controller.registerUser(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
    describe("And there is no password", () => {
      test("Then call next", async () => {
        req.body = { password: undefined };
        User.create.mockResolvedValue({});
        bcrypt.hashSync.mockImplementation(() => {
          throw new Error("Error, no password");
        });
        await controller.registerUser(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
    describe("And there is no user name", () => {
      test("Then call next", async () => {
        req.body = { name: null };
        User.create.mockResolvedValue(null);
        await controller.registerUser(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
    describe("And there is no email", () => {
      test("Then call next", async () => {
        req.body = { email: undefined };
        User.create.mockResolvedValue(null);
        await controller.registerUser(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});

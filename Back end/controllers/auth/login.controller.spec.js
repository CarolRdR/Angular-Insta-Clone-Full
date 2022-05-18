import * as controller from "./login.controller.js";
import bcrypt from "bcryptjs";
import { createToken } from "../../services/auth.js";
import { User } from "../../model/user.model.js";

jest.mock("../../model/user.model.js");
jest.mock("bcryptjs");
jest.mock("../../services/auth.js");

describe("Given the login controller", () => {
  let req;
  let res;
  // eslint-disable-next-line no-unused-vars
  let next;

  beforeEach(() => {
    req = { params: {} };
    res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    next = jest.fn();
  });

  describe("When loginUser is triggered", () => {
    describe("And there is not email ", () => {
      test("Then call next", async () => {
        req.body = { email: null };
        User.findOne.mockReturnValue({
          populate: () => ({
            populate: () => null,
          }),
        });
        await controller.loginUser(req, res, next);
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });
    });
    describe("And there is not password", () => {
      test("Then call next ", async () => {
        req.body = { password: null };
        await controller.loginUser(req, res, next);
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });
    });
    describe("And user is not found", () => {
      test("Then call next", async () => {
        req.body = { email: "123", password: "123" };
        User.findOne.mockReturnValue({
          populate: () => ({
            populate: () => null,
          }),
        });

        await controller.loginUser(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
    describe("And password is not found", () => {
      test("Then call next", async () => {
        req.body = { email: "123", password: "123" };
        User.findOne.mockReturnValue({
          populate: () => ({
            populate: () => ({}),
          }),
        });
        bcrypt.compareSync.mockReturnValue(false);
        await controller.loginUser(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("And there is user name or password", () => {
      beforeEach(() => {
        req.body = { email: "trued@true.com", password: "123" };
        bcrypt.compareSync.mockReturnValue(1);

        User.findOne.mockReturnValue({
          populate: () => ({
            populate: () => [],
          }),
        });
      });

      describe("And the email is not found", () => {
        test("Then call next", async () => {
          req.body = { email: undefined };
          User.findOne.mockResolvedValue({});
          await controller.loginUser(req, res, next);
          expect(next).toHaveBeenCalled();
        });
      });

      describe("And the password is no correct", () => {
        test("Then call next", async () => {
          req.body = { password: undefined };
          User.findOne.mockResolvedValue({});
          bcrypt.compareSync.mockReturnValue(null);
          await controller.loginUser(req, res, next);
          expect(next).toHaveBeenCalled();
        });
      });

      describe("And the email and password are ok", () => {
        test("Then call send", async () => {
          const user = {
            email: "trued@true.com",
            password: "123",
          };
          req.body = user;
          bcrypt.compareSync.mockReturnValue(true);
          createToken.mockReturnValue("mock_token");
          await controller.loginUser(req, res, next);
          expect(res.json).toHaveBeenCalledWith({
            token: "mock_token",
            userFound: [],
          });
        });
      });
    });
  });
});

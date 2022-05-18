import * as interceptors from "./interceptor.js";
import { verifyToken } from "../services/auth.js";
import { User } from "../model/user.model.js";

jest.mock("../services/auth.js");
jest.mock("../model/user.model.js");

describe("Given a route intercepted by loginRequired", () => {
  let req;
  let res;
  let next;
  let tokenError;
  beforeEach(() => {
    tokenError = new Error("Token missing or invalid");
    tokenError.status = 401;
    req = { params: {} };
    res = {};
    req.get = jest.fn();
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    next = jest.fn();
  });
  describe("When authorization token is present", () => {
    describe("And token is valid", () => {
      test("Then call next", () => {
        req.get.mockReturnValue("bearer token");
        verifyToken.mockReturnValue({});
        interceptors.loginAuthentication(req, res, next);
        expect(next).toHaveBeenCalledWith();
      });
    });
    describe("And token is not valid", () => {
      test("Then call next with error", () => {
        req.get.mockReturnValue("bearer token");
        verifyToken.mockReturnValue("bad token");
        interceptors.loginAuthentication(req, res, next);
        expect(next).toHaveBeenCalledWith(tokenError);
      });
    });
  });
  describe("When authorization token is not present", () => {
    test("Then call next with error", () => {
      req.get.mockReturnValue("");
      interceptors.loginAuthentication(req, res, next);
      expect(next).toHaveBeenCalledWith(tokenError);
    });
  });
});
describe("Given a route intercepted by userRequired", () => {
  let req;
  let res;
  let next;
  let userError;
  beforeEach(() => {
    userError = new Error("User not authorized");
    userError.status = 401;
    req = { params: {}, tokenPayload: {} };
    res = {};
    next = jest.fn();
    User.findById.mockReturnValue({
      _id: { toString: () => "62319b1af1da712098fb7d44" },
    });
  });

  describe("When token user is the user of app", () => {
    test("Then call next", async () => {
      req.tokenPayload.id = "1";
      await interceptors.userRequired(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe("When token user is the user of the app", () => {
    test("Then call next with error", async () => {
      req.tokenPayload.id = "2";
      await interceptors.userRequired(req, res, next);
      expect(next).toHaveBeenCalledWith(userError);
    });
  });
});

import { rest } from "msw";
import {
  dummyUserData,
  dummyCarCreateData,
  dummyCarList,
} from "../utils/test-utils";

export const handlers = [
  // Handles a POST /login request
  rest.post("*/carslogin*", (req, res, ctx) => {
    return res(ctx.json([dummyUserData]));
  }),
  rest.post("*/carsuser*", (req, res, ctx) => {
    return res(ctx.json(dummyUserData));
  }),
  rest.post("*/cars*", (req, res, ctx) => {
    return res(ctx.json(dummyCarCreateData));
  }),
  rest.get("*/cars*", (req, res, ctx) => {
    return res(ctx.json(dummyCarList));
  }),
  rest.delete("*/cars*", (req, res, ctx) => {
    return res(ctx.json({}));
  }),
];

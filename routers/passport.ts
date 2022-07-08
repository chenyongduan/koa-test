import { Context } from "koa";
import Router from "koa-router";
import Joi from "joi";
import jwt from "jsonwebtoken";
import genValidateParams from "../middleware/validateParams";
import userModel from "../dbs/models/user";
import { JWT_SECRET } from "../constants/jwt";
import uuid from "../utils/uuid";

const passportRouter = new Router();

passportRouter.post(
  "/login",
  genValidateParams(
    Joi.object({
      phone: Joi.string().required(),
      password: Joi.string().required(),
    })
  ),
  async (ctx: Context) => {
    const { phone, password } = ctx.query;
    const result = await userModel.findOne({ phone });
    if (!result) {
      const user = new userModel({
        phone,
        password,
      });
      await user.save();
    } else if (result.password !== password) {
      ctx.fail("手机或密码错误");
      return;
    }
    const refreshToken = uuid();
    const token = jwt.sign(
      {
        id: 1,
        refreshToken,
      },
      JWT_SECRET,
      { expiresIn: "10h" }
    );
    ctx.success({
      token,
      refreshToken,
    });
  }
);

passportRouter.post(
  "/changePassword",
  genValidateParams(
    Joi.object({
      phone: Joi.string().required(),
      password: Joi.string().required(),
    })
  ),
  async (ctx: Context) => {
    const { phone, password } = ctx.query;
    const result = await userModel.findOne({ phone });
    if (!result) {
      ctx.fail("手机号不存在");
      return;
    } else {
      await userModel.updateOne({ phone }, { $set: { password } });
    }
    ctx.success("change password success");
  }
);

export default passportRouter;

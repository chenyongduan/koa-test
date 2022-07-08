import { Context } from "koa";
import axios from "axios";
import Router from "koa-router";
import Joi from "joi";
import genValidateParams from "../middleware/validateParams";

const schemeRouter = new Router();

// const APP_ID = "wx7c861572cd0550c0";
// const APP_SECRET = "7278a0596e4f4f6d3060eeceb7fd3036";

const APP_ID = "wx1219448d2ab70b46";
const APP_SECRET = "e409f806ede6632b5759f47698c79d81";

schemeRouter.get(
  "/schemeUrl",
  genValidateParams(
    Joi.object({
      path: Joi.string().required(),
      query: Joi.string(),
    })
  ),
  async (ctx: Context) => {
    try {
      const { path, query } = ctx.query;
      const result = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`
      );
      console.log(result.data)
      const schemeData = await axios.post(
        `https://api.weixin.qq.com/wxa/generatescheme?access_token=${
          result.data.access_token
        }&path=${path}&query=${query || "123"}`
      );
      console.log(schemeData.data)
      const { openlink } = schemeData.data;
      ctx.success(openlink);
    } catch {
      ctx.fail("data error");
    }
  }
);

export default schemeRouter;

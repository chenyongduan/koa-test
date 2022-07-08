import Joi from "joi";
import { Context, Next } from "koa";

function genValidateParams(schema: Joi.Schema) {
  return async function validateParams(ctx: Context, next: Next) {
    const { error } = schema.validate(ctx.query);
    if (error) {
      ctx.status = 422;
      ctx.body = {
        code: 422,
        message: error.message,
      };
      return;
    }
    await next();
  };
}

export default genValidateParams;

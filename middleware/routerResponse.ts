import { Context, Next } from "koa";

type Option = Partial<{
  type: string;
  successMsg: string;
  successCode: number;
  failCode: number;
}>;

export interface RouterContext extends Context {
  success: (data: any, msg?: string) => void;
  fail: (msg: string, code?: number) => void;
}

export function routerResponse(option: Option = {}) {
  return async function (ctx: Context, next: Next) {
    ctx.success = function (data: any) {
      ctx.type = option.type || "json";
      ctx.status = 200;
      ctx.body =
        Object.prototype.toString.call(data) === "[object Object]"
          ? data
          : {
              data,
            };
    };

    ctx.fail = function (msg: string, code?: number) {
      ctx.type = option.type || "json";
      const statusCode = code || option.failCode || 400;
      ctx.status = statusCode;
      ctx.body = {
        code: statusCode,
        msg: msg || option.successMsg || "request fail",
      };
    };
    await next();
  };
}

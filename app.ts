import Koa from "koa";
import { routerResponse } from "./middleware/routerResponse";
import mongoose from "mongoose";
import path from "path";
import koaStatic from "koa-static";
import cors from "koa-cors";
import body from "koa-body";
import koaJwt from "koa-jwt";
import schemeRouter from "./routers/schemeUrl";
import passportRouter from "./routers/passport";
import uploadRouter from "./routers/upload";
import dbConfig from "./dbs/config";
import { JWT_SECRET } from "./constants/jwt";

mongoose.connect(dbConfig.dbs);

const app = new Koa();

// 配置静态资源路径
app.use(koaStatic(path.join(__dirname)));

app.use(
  cors({
    origin: true,
    maxAge: 5,
    credentials: true,
  })
);

app.use(routerResponse());

app.use(async (ctx, next) => {
  await next().catch((err) => {
    if (err.status == "401") {
      ctx.fail("Authentication Error", 401);
    }
  });
});

app.use(
  koaJwt({
    secret: JWT_SECRET,
    debug: true,
  }).unless({
    path: [/^\/login/, "/schemeUrl"],
  })
);

app.use(body());

app.use(passportRouter.routes());

app.use(schemeRouter.routes());

app.use(uploadRouter.routes());

export default app;

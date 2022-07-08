import { Context } from "koa";
import Router from "koa-router";
import multer from "koa-multer";
import path from "path";
import fs from "fs";
import uuid from "../utils/uuid";
import genValidateParams from "../middleware/validateParams";
import Joi from "joi";

const uploadRouter = new Router();

const staticDir = "/static/upload";

uploadRouter.get("/upload", (ctx) => {
  ctx.type = "html";
  const pathUrl = path.join(__dirname, "../static/upload.html");
  ctx.body = fs.createReadStream(pathUrl);
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, `../${staticDir}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const fileFormat = file.originalname.split(".");
    cb(null, uuid() + "." + fileFormat[fileFormat.length - 1]);
  },
});

uploadRouter.post(
  "/upload",
  multer({ storage }).single("file"),
  async (ctx: Context) => {
    const result = ctx.req as any;
    ctx.success({
      path: `${staticDir}/${result.file.filename}`,
    });
  }
);

export default uploadRouter;

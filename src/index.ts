import { Context, h, Logger, Schema, Service } from "koishi";
import afdian from "./afdian";
import { AfdianWebhookData } from "./types";

export const name = "afdian";
const logger = new Logger(name);

declare module "koishi" {
  interface Context {
    Afdian: Afdian;
  }
  interface User {
    afdianId: string;
  }
  interface Events {
    "afdian"(webhook: AfdianWebhookData): void;
  }
}

export class Afdian extends Service {
  afdian: afdian;

  constructor(
    ctx: Context,
    public config: Afdian.Config,
  ) {
    super(ctx, "Afdian", true);
    ctx.model.extend("user", {
      afdianId: "string",
    });

    ctx.router["get"](config.path, (ctx, _next) => {
      ctx.body = "Afdian Service is working now!";
    });

    ctx.router["post"](config.path, (ctx, _next) => {
      // 获取发送的数据
      const payload: AfdianWebhookData = ctx.request.body;

      ctx.body = {
        ec: 200,
      };

      if (payload.ec != 200) {
        logger.error(`处理 WebHook 遇到了错误 ${payload.em}`);
        return;
      }

      this.ctx.emit("afdian", payload);
    });

    ctx.on("afdian", async (payload) => {
      logger.info(
        `新的订单，${payload.data.order.out_trade_no}，金额 ${payload.data.order.total_amount}`,
      );
    });

    ctx
      .command("afdian/bind <orderNO:string>")
      .userFields(["afdianId"])
      .action(async ({ session }, orderNO) => {
        if (!orderNO) return session.text(".no-order");
        const order = await this.afdian.queryOrder({ out_trade_no: orderNO });
        if (!order || order.ec != 200) return session.text(".not-found-order");
        session.user.afdianId = order.data.list[0].user_private_id;
        return "绑定成功";
      });

    ctx
      .command("afdian/check <user:user>")
      .action(async ({ session }, user) => {
        const target = await session.getUser(user);
        const sponsor = await this.afdian.querySponsor({
          user_id: target.afdianId,
        });
        if (!sponsor || sponsor.ec != 200) return "未找到信息。";
        const plan = sponsor.data.list[0].current_plan;
        return `目前计划 ${plan.name} \n 价格 ${plan.show_price}`;
      });
  }

  async start() {
    let { token, userId } = this.config;

    this.afdian = new afdian({
      token: token,
      userId: userId,
    });

    try {
      const res = await this.afdian.ping();
      if (res.ec != 200)
        throw new TypeError("Failed to verify Afdian API：" + res.em);
    } catch (e) {
      if (e instanceof TypeError) {
        throw e;
      }
      throw new Error("访问 Afdian API 失败，请检查网络是否通常");
    }
  }
}

Context.service("Afdian", Afdian);
export default Afdian;

export namespace Afdian {
  export interface Config {
    path: string;
    token: string;
    userId: string;
  }

  export const Config: Schema<Config> = Schema.object({
    path: Schema.string().description("Afdian webhook path").default("/afdian"),
    token: Schema.string().description("Afdian API token"),
    userId: Schema.string().description("Afdian userId"),
  }).i18n({
    zh: {
      path: "爱发电 Webhook 路径",
      token: "访问 API 的令牌",
      userId: "爱发电用户ID",
    },
  });
}

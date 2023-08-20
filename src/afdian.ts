import api from "./api";
import { AfdianRequest, AfdianSignedRequest } from "./types";
import crypto from "crypto";
import {
  AfdianOrderParams,
  AfdianRequestParams,
  AfdianSponsorParams,
} from "./types/Params";
import {
  AfdianOrderResponse,
  AfdianPingResponse,
  AfdianSponsorResponse,
} from "./types/Response";

export interface AfdianApiOpts {
  userId: string;
  token: string;
}

class AfdianApi {
  private userId: string;
  private token: string;
  public constructor(opts: AfdianApiOpts) {
    const { userId, token } = opts;
    if (!userId) {
      throw new TypeError("User ID should not be empty.");
    }
    if (!token) {
      throw new TypeError("Token should not be empty.");
    }
    this.userId = userId;
    this.token = token;
  }
  public async ping(): Promise<AfdianPingResponse> {
    const res = await this.send(api.ping);
    return await res.json();
  }
  public async queryOrder(
    params: AfdianOrderParams,
  ): Promise<AfdianOrderResponse> {
    const res = await this.send(api.queryOrder, params);
    return await res.json();
  }
  public async querySponsor(
    params: AfdianSponsorParams,
  ): Promise<AfdianSponsorResponse> {
    const res = await this.send(api.querySponsor, params);
    return await res.json();
  }
  private async send(url: string, params?: AfdianRequestParams) {
    const signed = signRequest(this.token, buildRequest(this.userId, params));
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signed),
    });
  }
}

const buildRequest = (
  userId: string,
  params?: AfdianRequestParams,
): AfdianRequest => {
  const req = {
    user_id: userId,
    ts: Math.floor(Date.now() / 1000),
    params: JSON.stringify(params || { empty: true }),
  };
  return req;
};

const signRequest = (
  token: string,
  body: AfdianRequest,
): AfdianSignedRequest => {
  const toSign = `${token}params${body.params}ts${body.ts}user_id${body.user_id}`;
  const sign = crypto.createHash("md5").update(toSign).digest("hex");
  return {
    ...body,
    sign,
  };
};

export * from "./types";
export default AfdianApi;

interface AfdianBaseRequestParams {
  page?: number;
  per_page?: number;
}

export interface AfdianOrderParams extends AfdianBaseRequestParams {
  out_trade_no?: string;
}

export interface AfdianSponsorParams extends AfdianBaseRequestParams {
  user_id?: string;
}

export type AfdianRequestParams = AfdianOrderParams | AfdianSponsorParams;

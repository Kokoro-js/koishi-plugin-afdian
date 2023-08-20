export type AfdianPingResponse = AfdianBasicResponse<{
  uid: string;
  request: {
    user_id: string;
    params: string;
    ts: number;
    sign: string;
  };
}>;

export interface AfdianBasicResponse<T> {
  ec: number;
  em: string;
  data: T;
}

export type AfdianOrderResponse = AfdianBasicResponse<{
  list: AfdianOrderInfo[];
  total_count: number;
  total_page: number;
}>;

export type AfdianSponsorResponse = AfdianBasicResponse<{
  total_count: number;
  total_page: number;
  list: AfdianSponsorInfo[];
}>;

// Order
export interface AfdianOrderInfo {
  out_trade_no: string;
  custom_order_id: string;
  user_id: string;
  user_private_id: string; // 根据描述，这可能是一个用户的唯一ID
  plan_id: string;
  month: number;
  total_amount: string;
  show_amount: string;
  status: number;
  remark: string;
  redeem_id: string;
  product_type: number;
  discount: string;
  sku_detail: SkuDetail[];
  address_person: string;
  address_phone: string;
  address_address: string;
}

interface SkuDetail {
  sku_id: string;
  count: number;
  name: string;
  album_id: string;
  pic: string;
}

// Sponsor
export interface AfdianSponsorInfo {
  sponsor_plans: AfdianPlanInfo[];
  current_plan: AfdianPlanInfo;
  all_sum_amount: string;
  create_time: number;
  first_pay_time: number;
  last_pay_time: number;
  user: {
    user_id: string;
    name: string;
    avatar: string;
  };
}

export interface AfdianPlanInfo {
  plan_id: string;
  rank: number;
  user_id: string;
  status: number;
  name: string;
  pic: string;
  desc: string;
  price: string;
  update_time: number;
  pay_month: number;
  show_price: string;
  independent: number;
  permanent: number;
  can_buy_hide: number;
  need_address: number;
  product_type: number;
  sale_limit_count: number;
  need_invite_code: boolean;
  expire_time: number;
}

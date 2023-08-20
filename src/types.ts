export interface AfdianWebhookData {
  ec: number;
  em: string;
  data: {
    type: string;
    order: {
      out_trade_no: string;
      user_id: string;
      plan_id: string;
      month: number;
      total_amount: string;
      show_amount: string;
      status: number;
      remark: string;
      redeem_id: string;
      product_type: number;
      discount: string;
      sku_detail: any[];
      address_person: string;
      address_phone: string;
      address_address: string;
    };
  };
}

export interface AfdianRequest {
  user_id: string;
  params?: string;
  ts: number;
}

export interface AfdianSignedRequest {
  user_id: string;
  params?: string;
  ts: number;
  sign: string;
}

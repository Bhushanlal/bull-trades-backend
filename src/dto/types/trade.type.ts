import { Document, Schema } from "mongoose";
import { CallOrPut, TradeSentiment, TradeType } from "../../utils/enum";

export interface ITrade extends Document {
  isFavourite: boolean;
  entryDate: Date;
  entryTime: string;
  expirationDate: Date;
  expirationTime: string;
  strike: number;
  spot: number;
  callOrPut: CallOrPut;
  details: string;
  sentiment: TradeSentiment;
  execution: number;
  moneyNess: number;
  openInterest: number;
  volume: number;
  prem: number;
  datesToExpire: number | null;
  type: TradeType;
  ticker: string;
  accountId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

import { Document, Schema } from "mongoose";
import { CallOrPut, Position, RiskLevel, TradeType } from "../../utils/enum";

export interface ITrade extends Document {
  isFavourite: boolean;
  entryDate: Date;
  entryTime: string;
  expirationDate: Date;
  strike: number;
  price: number;
  callOrPut: CallOrPut;
  volume: number;
  type: TradeType;
  ticker: string;
  accountId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  riskLevel: RiskLevel,
  position : Position
}

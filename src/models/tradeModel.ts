import { ITrade } from "../dto/types/trade.type";
import { CallOrPut, TradeSentiment, TradeType } from "../utils/enum";
import mongoose, { Schema } from "mongoose";

const tradeSchema = new Schema<ITrade>(
  {
    isFavourite: {
      type: Boolean,
      default: false,
    },
    entryDate: {
      type: Date,
      required: true,
    },
    entryTime: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    expirationTime: {
      type: String,
      required: true,
    },
    strike: {
      type: Number,
      required: true,
    },
    spot: {
        type: Number,
        required: true,
      },
    callOrPut: {
      type: String,
      enum: Object.values(CallOrPut),
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      enum: Object.values(TradeSentiment),
      required: true,
    },
    execution: {
      type: Number,
      required: true,
    },
    moneyNess: {
        type: Number,
        required: true,
      },
    openInterest: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    prem: {
      type: Number,
      required: true,
    },
    datesToExpire: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(TradeType),
      required: true,
    },
    ticker: {
      type: String,
      required: true,
      default: null,
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: "Account", 
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Trade || mongoose.model("Trade", tradeSchema);

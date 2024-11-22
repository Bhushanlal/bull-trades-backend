import { ITrade } from "../dto/types/trade.type";
import { CallOrPut, Position, RiskLevel, TradeType } from "../utils/enum";
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
    strike: {
      type: Number,
      required: true,
    },
    price: {
        type: Number,
        required: true,
      },
    callOrPut: {
      type: String,
      enum: Object.values(CallOrPut),
      required: true,
    },
    volume: {
      type: Number,
      required: true,
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
    riskLevel: {
      type: String,
      enum: Object.values(RiskLevel),
      required: true,
    },
    position: {
      type: String,
      enum: Object.values(Position),
      required: true,
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
      isDeleted: {
        type : Boolean,
        default: false
      },
      deletedAt : {
        type : Date,
        default : null
      }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Trade || mongoose.model("Trade", tradeSchema);

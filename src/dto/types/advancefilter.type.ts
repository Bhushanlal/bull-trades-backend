
import mongoose from "mongoose";
import {CallOrPut, Sentiments } from "../../utils/enum";

export interface IAdvanceFilter extends Document {
    userId: mongoose.Types.ObjectId;
    otmCalls: boolean;
    otmPuts: boolean;
    priceLessThanTwo: boolean;
    sizeGreater500: boolean;
    sentiment: Sentiments;
    callOrPut: CallOrPut;
    priceStart: number;
    priceEnd: number;
    expirationStart: Date;
    expirationEnd: Date;
    createdAt: Date;
    updatedAt: Date;
  }
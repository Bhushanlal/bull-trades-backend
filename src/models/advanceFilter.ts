
import mongoose, { Schema } from 'mongoose';
import { CallOrPut, Sentiments } from '../utils/enum';
import { IAdvanceFilter } from '../dto/types/advancefilter.type';

const advanceFilterSchema = new Schema<IAdvanceFilter>({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otmCalls: {
      type: Boolean,
      default: false
    },
    otmPuts: {
      type: Boolean,
      default: false
    },
    priceLessThanTwo: {
      type: Boolean,
      default: false
    },
    sizeGreater500: {
      type: Boolean,
      default: false
    },
    sentiment: {
      type: String,
      enum: Object.values(Sentiments),
      default: null
    },
    callOrPut: {
      type: String,
      enum: Object.values(CallOrPut),
      default: null
    },
    priceStart: {
      type: Number,
      default: null
    },
    priceEnd: {
      type: Number,
      default: null
    },
    expirationStart: {
      type: Date,
      default: null
    },
    expirationEnd: {
      type: Date,
      default: null
    }
  }, {
    timestamps: true
  });
  
  
  export default mongoose.models.AdvanceFilter || mongoose.model('AdvanceFilter', advanceFilterSchema);
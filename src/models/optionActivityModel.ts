import mongoose, { Schema, Document } from 'mongoose';
import { IOptionActivity } from '../dto/types/optionActivity.type';

// Create the option activity schema
const optionActivitySchema = new Schema<IOptionActivity>({
  id: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true 
  },
  ticker: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  description_extended: {
    type: String,
    required: true
  },
  updated: {
    type: Number,
    required: true
  },
  sentiment: {
    type: String,
    required: true
  },
  aggressor_ind: {
    type: String, 
    required: true
  },
  option_symbol: {
    type: String,
    required: true
  },
  underlying_type: {
    type: String,
    required: true
  },
  underlying_price: {
    type: String, 
    required: true
  },
  cost_basis: {
    type: String, 
    required: true
  },
  put_call: {
    type: String,
    required: true
  },
  strike_price: {
    type: String, 
    required: true
  },
  price: {
    type: String, 
    required: true
  },
  size: {
    type: String, 
    required: true
  },
  date_expiration: {
    type: String,
    required: true
  },
  option_activity_type: {
    type: String,
    required: true
  },
  trade_count: {
    type: String,
    required: true
  },
  open_interest: {
    type: String, 
    required: true
  },
  volume: {
    type: String, 
    required: true
  },
  bid: {
    type: String, 
    required: true
  },
  ask: {
    type: String, 
    required: true
  },
  midpoint: {
    type: String, 
  },
  execution_estimate: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Export the model
export default mongoose.models.OptionActivity || mongoose.model('OptionActivity', optionActivitySchema); 
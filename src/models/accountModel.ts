import mongoose, { Schema } from 'mongoose';
import { IAccount } from '../dto/types/account.type';

// Create the user schema
const accountSchema = new Schema<IAccount>({
  name: {
    type: String,
    default: ""
  },
}, {
  timestamps: true
});

// Export the model
export default mongoose.models.Account || mongoose.model('Account', accountSchema);
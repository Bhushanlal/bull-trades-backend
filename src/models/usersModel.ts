import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../dto/types/user.type';
import { ProfileVisibility, Provider, UserStatus } from '../utils/enum';

// Create the user schema
const userSchema = new Schema<IUser>({
  token: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: Object.values(Provider),
    required: true
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  profilePicture: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    sparse: true
  },
  country: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    trim: true,
    default: 'en'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profileVisibility: {
    type: String,
    enum: Object.values(ProfileVisibility),
    default: ProfileVisibility.PUBLIC
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Export the model
export default mongoose.models.User || mongoose.model('User', userSchema);
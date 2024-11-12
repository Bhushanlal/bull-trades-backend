import { ProfileVisibility, Provider, UserStatus } from "../../utils/enum";

// Define the interface for the user document
export interface IUser extends Document {
    token: string | null;
    provider: Provider;
    uuid: string;
    email: string;
    fullname: string;
    profilePicture: string | null;
    phoneNumber?: string;
    country?: string;
    language?: string;
    bio?: string;
    profileVisibility: ProfileVisibility;
    isVerified: boolean;
    isDeleted: boolean;
    status: UserStatus;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date | null;
  }
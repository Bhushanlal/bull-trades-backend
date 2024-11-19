
export interface IAccount extends Document {
    name: string | null;
    updatedAt: Date;
    createdAt: Date;
  }
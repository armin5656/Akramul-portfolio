import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  password: string;
  email: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

const Admin =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;

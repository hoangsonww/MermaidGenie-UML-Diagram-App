import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: The user's full name
 *         email:
 *           type: string
 *           format: email
 *           description: Unique email address
 *         password:
 *           type: string
 *           format: password
 *           description: Hashed password (never returned in API responses)
 *         bio:
 *           type: string
 *           description: A short biography
 *           default: ""
 *         avatarUrl:
 *           type: string
 *           format: uri
 *           description: Link to the user's avatar image
 *           default: ""
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *       example:
 *         _id: "60abf9c2e1b4f45b8c8f5678"
 *         name: "Jane Doe"
 *         email: "jane.doe@example.com"
 *         password: "$2a$10$abcdefg..."
 *         bio: "Full-stack developer and Mermaid enthusiast."
 *         avatarUrl: "https://example.com/avatar.jpg"
 *         createdAt: "2025-08-08T12:34:56.000Z"
 *         updatedAt: "2025-08-08T12:34:56.000Z"
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);

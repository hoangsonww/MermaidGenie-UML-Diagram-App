import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const signToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const register = async (req: Request, res: Response) => {
  const { name, email, password, bio, avatarUrl } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // only include optional fields if provided
    const userData: Partial<IUser> = { name, email, password };
    if (bio !== undefined) userData.bio = bio;
    if (avatarUrl !== undefined) userData.avatarUrl = avatarUrl;

    const user = new User(userData);
    await user.save();

    const token = signToken(user._id.toString());
    res.status(201).json({ token });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id.toString());
    res.json({ token });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getProfile = (req: AuthRequest, res: Response) => {
  const user = req.user as IUser;
  res.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user as IUser;
  const { name, bio, avatarUrl } = req.body;

  try {
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    await user.save();
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      updatedAt: user.updatedAt,
    });
  } catch (err: any) {
    console.error("UpdateProfile error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const user = req.user as IUser;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.error("ChangePassword error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const signToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

/**
 * Register a new user.
 *
 * @param req - Express request object containing user details.
 * @param res - Express response object to send the response.
 */
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

/**
 * Login an existing user.
 *
 * @param req - Express request object containing email and password.
 * @param res - Express response object to send the response.
 */
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

/**
 * Get the profile of the authenticated user.
 *
 * @param req - Authenticated request object containing user details.
 * @param res - Express response object to send the profile data.
 */
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

/**
 * Update the profile of the authenticated user.
 *
 * @param req - Authenticated request object containing updated profile data.
 * @param res - Express response object to send the updated profile data.
 */
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

/**
 * Change the password of the authenticated user.
 *
 * @param req - Authenticated request object containing current and new passwords.
 * @param res - Express response object to send the result of the password change.
 */
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

/**
 * Verify that a given email is registered in the system.
 *
 * @param req - Express request object containing the email to verify.
 * @param res - Express response object to send the verification result.
 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const exists = !!(await User.findOne({ email }));
    res.json({ exists });
  } catch (err: any) {
    console.error("VerifyEmail error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Reset the password for a user identified by their email.
 *
 * @param req - Express request object containing the email and new password.
 * @param res - Express response object to send the result of the password reset.
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and newPassword are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password has been reset successfully" });
  } catch (err: any) {
    console.error("ResetPassword error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

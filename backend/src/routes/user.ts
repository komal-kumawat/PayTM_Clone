import express, { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Account } from "../db";
import { authMiddleware, authRequest } from "../middleware";

dotenv.config();

const userRouter = express.Router();

// ----------------- Validation Schemas -----------------
const signupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const updateBody = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
});

// ----------------- Routes -----------------

// Signup
userRouter.post("/signup", async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    await Account.create({
      userId: user._id,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Signup error", err });
  }
});

// Signin
userRouter.post("/signin", async (req: Request, res: Response) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const { email, password } = parsed.data;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error in signing" });
  }
});

// Update user
userRouter.put("/", authMiddleware, async (req: authRequest, res: Response) => {
  const parsed = updateBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.userId, parsed.data, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error in updating", err });
  }
});

// Get all users
userRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", err });
  }
});

// Search users (bulk)
userRouter.get("/bulk", async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Please send name as a query parameter" });
  }

  try {
    const users = await User.find({ name: new RegExp(name, "i") });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", err });
  }
});

export default userRouter;

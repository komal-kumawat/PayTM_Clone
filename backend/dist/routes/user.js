"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../db");
const middleware_1 = require("../middleware");
dotenv_1.default.config();
const userRouter = express_1.default.Router();
// ----------------- Validation Schemas -----------------
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const updateBody = zod_1.z.object({
    name: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
});
// ----------------- Routes -----------------
// Signup
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
    }
    try {
        const { name, email, password } = parsed.data;
        const existingUser = yield db_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const user = yield db_1.User.create({ name, email, password });
        yield db_1.Account.create({
            userId: user._id,
            balance: 1 + Math.random() * 10000,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ message: "User created successfully", token });
    }
    catch (err) {
        res.status(500).json({ message: "Signup error", err });
    }
}));
// Signin
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
    }
    try {
        const { email, password } = parsed.data;
        const user = yield db_1.User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ error: "Error in signing" });
    }
}));
// Update user
userRouter.put("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = updateBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
    }
    try {
        const updatedUser = yield db_1.User.findByIdAndUpdate(req.userId, parsed.data, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Updated successfully", updatedUser });
    }
    catch (err) {
        res.status(500).json({ message: "Error in updating", err });
    }
}));
// Get all users
userRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.User.find({});
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching users", err });
    }
}));
// Search users (bulk)
userRouter.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
        return res.status(400).json({ message: "Please send name as a query parameter" });
    }
    try {
        const users = yield db_1.User.find({ name: new RegExp(name, "i") });
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching users", err });
    }
}));
exports.default = userRouter;

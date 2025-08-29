"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, set: (v) => v.toUpperCase() },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
});
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const AccountSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true, set: (v) => Number(v.toFixed(2)) }
});
const Account = mongoose_1.default.model("Account", AccountSchema);
exports.Account = Account;

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
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("../middleware");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const accountRouter = express_1.default.Router();
exports.accountRouter = accountRouter;
accountRouter.get("/balance", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield db_1.Account.findOne({ userId: req.userId });
        if (!account) {
            res.status(404).json({ message: "account not found" });
            return;
        }
        res.status(201).json({ balance: account.balance });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}));
accountRouter.post("/transfer", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        const { amount, to } = req.body;
        const account = yield db_1.Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            yield session.abortTransaction();
            res.status(400).json({
                message: "Insufficient balance"
            });
            return;
        }
        const toAccount = yield db_1.Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            yield session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }
        yield db_1.Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        yield db_1.Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        // Commit the transaction
        yield session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    }
    catch (err) {
        res.status(500).json({ error: "error in transfering amount" });
    }
}));

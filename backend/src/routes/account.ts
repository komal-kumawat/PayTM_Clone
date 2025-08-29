import express, {Response } from "express";
import { z } from "zod"

import { User, Account } from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware, authRequest } from "../middleware";
import mongoose from "mongoose";
dotenv.config();


const accountRouter = express.Router();
accountRouter.get("/balance", authMiddleware, async (req: authRequest, res: Response) => {
    try {
        const account = await Account.findOne({ userId: req.userId })
        if (!account) {
            res.status(404).json({ message: "account not found" });
            return;
        }
        res.status(201).json({ balance: account.balance });

    } catch (err) {
        res.status(500).json({ error: err })
    }
})

accountRouter.post("/transfer", authMiddleware, async (req: authRequest, res: Response) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Insufficient balance"
            });
            return;
        }
        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });


        }
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });



    } catch (err) {
        res.status(500).json({ error: "error in transfering amount"})
    }
})

export { accountRouter }
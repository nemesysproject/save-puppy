"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongo = async () => {
    try {
        const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`;
        await mongoose_1.default.connect(mongoUrl);
        console.log('✅ MongoDB Connected');
    }
    catch (error) {
        console.error('❌ MongoDB Connection Failed:', error);
        process.exit(1);
    }
};
exports.connectToMongo = connectToMongo;

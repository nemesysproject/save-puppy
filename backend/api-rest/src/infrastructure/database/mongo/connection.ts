import mongoose from "mongoose";

export const connectToMongo = async () => {
	try {
		const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`;

		await mongoose.connect(mongoUrl);
		console.log("✅ MongoDB Connected");
	} catch (error) {
		console.error("❌ MongoDB Connection Failed:", error);
		process.exit(1);
	}
};

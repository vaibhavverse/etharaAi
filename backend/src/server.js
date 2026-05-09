import mongoose from "mongoose";
import { app } from "./app.js";
import { config } from "./config/index.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.mongodbUri);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`⚙️  Server is running at port : ${config.port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

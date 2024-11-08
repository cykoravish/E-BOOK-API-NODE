import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
        console.log("Database Connected Successfully", );
      });
  
      mongoose.connection.on("error", (error) => {
        console.log("Error In Connection To Database",error);
      });
    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error("Database Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;

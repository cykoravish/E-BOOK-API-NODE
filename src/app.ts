/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

//Routes

app.get("/", (req, res, next) => {
  res.json({ message: "welcome to elib apis" });
});

app.use("/api/users", userRouter);

//global error handler
app.use(globalErrorHandler);

export default app;

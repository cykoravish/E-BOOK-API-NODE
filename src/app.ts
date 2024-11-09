/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();

app.use(express.json());

//Routes

app.get("/", (req, res, next) => {
  res.json({ message: "welcome to elib apis" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//global error handler
app.use(globalErrorHandler);

export default app;

import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

//Routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get("/", (req, res, next) => {
  res.json({ message: "welcome to elib apis" });
});

app.use(globalErrorHandler);

export default app;

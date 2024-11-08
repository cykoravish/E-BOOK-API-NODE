import express from "express";

const app = express();

//Routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get("/", (req,res,next)=>{
    res.json({message:"welcome to elib apis"})
})


export default app;

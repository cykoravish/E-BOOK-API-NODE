import express from "express";

const app = express();

//Routes
app.get("/", (req,res,_)=>{
    res.json({message:"welcome to elib apis"})
})


export default app;

import bodyParser from "body-parser";
import { error } from "console";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import Routes from "../src/routes/index";
const app = express();
const PORT = 3000;

//Middleware
app.use(bodyParser.json());
app.use("uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cors());

mongoose
.connect("mongodb://127.0.0.1:27017/crud_todos")
.then(() =>console.log("Connected"))
.catch((error) => console.log("MongoDB Connection eror", error));


//Routes
app.use("/api", Routes);
app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`);
})
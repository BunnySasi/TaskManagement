import express from "express";
import { Login1, Login2, Login3, Getapp, Getplan, CheckGroup, CreateTask, GetTaskByState, FindApp, PromoteTask, FindApp2, getstatebyid } from "../controllers/A3.js";

const routerA3 = express.Router();

//Assignment 3

routerA3.post("/CreateTask", Login1, Getapp, Getplan, CheckGroup, CreateTask);
routerA3.post("/GetTaskByState", Login2, FindApp, GetTaskByState);
routerA3.post("/PromoteTask2Done", Login3, getstatebyid, FindApp2, PromoteTask);

export default routerA3;

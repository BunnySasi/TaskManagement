import express from "express";
import { getUsers, Register, Login, Logout, updateUser, adminupdateUser, createGroup, CheckGroupRoute, Checkgrouptest, disableUser, get_User, get_groupslist } from "../controllers/Users.js";
import { CreateNewApp, CreateNewPlan, CreateNewTask, UpdateApp, UpdatePlan, GetApps, get_App, Get_App, get_taskid, get_plan_name, GetPlans, GetPlan, GetTasks, GetTaskInfo, GetTaskId, UpdateTask, PromoteTask, DemoteTask, getAllTaskByOpen, getAllTaskByToDo, getAllTaskByDoing, getAllTaskByDone, getAllTaskByClose } from "../controllers/App.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

//Assignment 1
router.get("/users", getUsers);
router.post("/register", Register);
router.post("/login", Login);
router.get("/users/:user", get_User);
router.post("/Users", get_User);
router.get("/Users1", get_groupslist);
router.post("/updateUser", updateUser);
router.post("/adminupdateUser", adminupdateUser);
router.post("/createGroup", createGroup);
router.post("/CheckGroup", CheckGroupRoute);
router.post("/Checkgrouptest", Checkgrouptest);
router.post("/token", refreshToken);
router.post("/logout", Logout);
router.post("/disableuser", disableUser);
router.get("/VerifyToken", verifyToken);

//Assignment 2
router.post("/CreateNewApp", CreateNewApp);
router.post("/CreateNewPlan", CreateNewPlan);
router.post("/CreateNewTask", CreateNewTask);
router.post("/UpdateApp", UpdateApp);
router.post("/UpdatePlan", UpdatePlan);
router.get("/GetApps", GetApps);
router.get("/Apps", get_App);
router.post("/Apps2", Get_App);
router.get("/GetTaskId", get_taskid);
router.post("/GetPlanName", get_plan_name);
router.post("/GetPlans", GetPlans);
router.post("/GetPlan", GetPlan);
router.get("/GetTasks", GetTasks);
router.post("/GetTaskInfo", GetTaskInfo);
router.post("/GetTaskId", GetTaskId);
router.post("/UpdateTask", UpdateTask);
router.post("/PromoteTask", PromoteTask);
router.post("/DemoteTask", DemoteTask);
router.post("/getAllTaskByOpen", getAllTaskByOpen);
router.post("/getAllTaskByToDo", getAllTaskByToDo);
router.post("/getAllTaskByDoing", getAllTaskByDoing);
router.post("/getAllTaskByDone", getAllTaskByDone);
router.post("/getAllTaskByClose", getAllTaskByClose);

export default router;

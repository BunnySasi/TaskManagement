import db from "../config/Database.js";
import { sendEmail } from "../controllers/sendEmail.js";

// 1. CREATE NEW TASK FUNCTION
export const createtask = async function (Task_Id, taskname, tasknotes, taskdesc, taskplan, appacronym, username, taskcreator, taskplancolor, callback) {
  db.query("INSERT INTO task (Task_Id, Task_Name, Task_Notes, Task_Description, Task_State, Task_Plan, Task_App_Acronym, Task_Owner, Task_Creator, Task_Create_Date, Task_Plan_Color) VALUES ?", [[[Task_Id, taskname, tasknotes, taskdesc, "Open", taskplan, appacronym, username, taskcreator, new Date().toLocaleString(), taskplancolor]]], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const find_username = async function (username, callback) {
  db.query("SELECT * FROM accounts WHERE username =?", [username], async function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const getcolorfromplan = async function (taskplan, appacronym, callback) {
  //console.log("yooo", Task_Plan);
  db.query("SELECT Plan_Color FROM plan WHERE Plan_Name=? AND Plan_App_Acronym=? ", [taskplan, appacronym], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const Get_app = async function (appacronym, callback) {
  //console.log("yoo", App_Name);
  db.query("SELECT * FROM applications WHERE App_Name =? ", [appacronym], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const Get_plan = async function (appacronym, callback) {
  //console.log("yoo", App_Name);
  db.query("SELECT Plan_Name FROM plan WHERE Plan_App_Acronym =? ", [appacronym], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const updateRnumber = async function (App_Rnumber, appacronym, callback) {
  //console.log("a", typeof App_Rnumber);
  //console.log("b", App_Name);
  db.query("UPDATE applications SET App_Rnumber=? WHERE App_Name=?", [App_Rnumber, appacronym], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const checkgroup = async function (username, callback) {
  const thisquery = "SELECT * FROM accounts WHERE username =?";
  db.query(thisquery, [username], function (err, result) {
    //console.log("err reached", err);
    //console.log("result reached", result);
    if (err) {
      //console.log("reached error");
      callback(err, null);
      return;
    } //console.log(result);
    else {
      console.log("result");
      callback(null, result);
    }
  });
};

// 2. GET TASK BY STATE FUNCTION
export const Get_all_task_by_state = async function (A_acronym, T_state, callback) {
  console.log(A_acronym, T_state);
  db.query("SELECT * FROM task WHERE Task_App_Acronym=? AND Task_State =? ", [A_acronym, T_state], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

// 3. PROMOTE TASK FUNCTION

export const Find_TaskId = async function (Task_Id, callback) {
  db.query("SELECT Task_App_Acronym FROM task WHERE Task_Id=?", [Task_Id], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const getstatebyID = async function (Task_Id, callback) {
  db.query("SELECT * FROM task WHERE Task_Id=?", [Task_Id], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const promotetask = async function (Task_Id, Task_State, Task_Owner, Task_Notes, callback) {
  console.log(Task_Id, Task_State, Task_Owner);
  if (Task_State == "Doing") {
    db.query("UPDATE task SET Task_State='Done', Task_Owner=?, Task_Notes=CONCAT(?, Task_Notes)  WHERE Task_Id=?", [Task_Owner, Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });

    sendEmail(Task_Id, Task_Owner);
  }
};

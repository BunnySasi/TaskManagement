import { createapp, find_appname, createplan, find_planname, createtask, find_taskId, updateapp, updateplan, get_apps, get_app, Get_app, get_task_id, Get_taskid, get_plan_Name, get_plans, get_plan, get_tasks, get_taskinfo, updatetask, promotetask, demotetask, getcolorfromplan, updateRnumber, Get_all_task_by_open, Get_all_task_by_todo, Get_all_task_by_doing, Get_all_task_by_done, Get_all_task_by_close } from "../models/AppModel.js";
import bcrypt from "bcrypt";
import e from "express";
import jwt from "jsonwebtoken";
import deasync from "deasync";
import { sendEmail } from "./sendEmail.js";

//CREATE NEW APPLICATION FUNCTION
export const CreateNewApp = async (req, res) => {
  const { App_Name, App_Description, App_Rnumber, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done } = req.body;
  //console.log(req.body);
  if (!App_Name || !App_Rnumber) {
    res.status(400).json({ msg: "Please fill in the necessary fields." });
    return;
  }

  // if (App_Name) {
  //   const regex_App_Name = /^\S*$/;
  //   if (!regex_App_Name.test(App_Name)) {
  //     res.status(401).json({ msg: "Application name should not contain any spacings." });
  //     return;
  //   }
  // }

  find_appname(App_Name, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      if (data.length == 1) {
        //console.log(data.length);
        res.status(403).json({ msg: "Application name already exists." });
        return;
      }
    }
    //insert all the info into database
    await createapp(App_Name, App_Description, App_Rnumber, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done, function (err, data) {
      if (err) {
        console.log("ERROR:", err);

        if (err.errno == "1062") {
          res.status(400).json({ msg: "Duplicate Entry." });
        } else {
          res.status(400).json({ msg: err });
        }
      } else {
        //console.log("result from db is : ", data);
        res.json({ msg: "Application Successfully Created!" });
      }
    });
  });
};

//CREATE NEW PLAN FUNCTION
export const CreateNewPlan = async (req, res) => {
  const { Plan_Name, Plan_Start_Date, Plan_End_Date, Plan_App_Acronym, Plan_Color } = req.body;
  //console.log(typeof req.body.Plan_Start_Date);
  if (!Plan_Name) {
    res.status(400).json({ msg: "Please fill in the plan name." });
    return;
  }

  // if (Plan_Name) {
  //   const regex_Plan_Name = /^\S*$/;
  //   if (!regex_Plan_Name.test(Plan_Name)) {
  //     res.status(401).json({ msg: "Plan name should not contain any spacings." });
  //     return;
  //   }
  // }

  find_planname(Plan_Name, async function (err, data) {
    // if (err) {
    //   console.log("ERROR:", err);
    // } else {
    //   if (data.length == 1) {
    //     console.log(data.length);
    //     res.status(403).json({ msg: "Plan name already exists." });
    //     return;
    //   }
    // }

    //insert all the info into database
    await createplan(Plan_Name, Plan_Start_Date, Plan_End_Date, Plan_App_Acronym, Plan_Color, function (err, data) {
      if (err) {
        console.log("ERROR:", err);
        res.status(400).json({ msg: err });
      } else {
        //console.log("result from db is : ", data);
        res.json({ msg: "Plan Successfully Created!" });
      }
    });
  });
};

//CREATE NEW TASK FUNCTION

export const CreateNewTask = async (req, res) => {
  const { App_Name, App_Rnumber, Task_Name, Task_Notes, Task_Description, Task_State, Task_Plan, Task_App_Acronym, Task_Owner, Task_Creator } = req.body;
  //console.log(req.body);
  if (!Task_Name) {
    res.status(400).json({ msg: "Please fill in the Task name." });
    return;
  }

  var Task_Plan_Color = "";
  //console.log(Task_Plan);
  if (Task_Plan) {
    await getcolorfromplan(Task_Plan, App_Name, async function (err, data) {
      Task_Plan_Color = data[0].Plan_Color;

      var Task_Id = App_Name + "_" + App_Rnumber;

      //insert all the info into database
      await createtask(Task_Id, Task_Name, Task_Notes, Task_Description, Task_Plan, Task_App_Acronym, Task_Owner, Task_Creator, Task_Plan_Color, function (err, data) {
        if (err) {
          console.log("ERROR:", err);
          res.status(400).json({ msg: err });
        } else {
          //console.log(App_Rnumber);
          var App_Rnumber1 = App_Rnumber + 1;
          updateRnumber(App_Rnumber1, App_Name, function (err, data) {});
          //console.log("result from db is : ", data);
          res.json({ msg: "Task Successfully Created!" });
        }
      });
    });
  } else {
    Task_Plan_Color = "#FFFFFF";

    var Task_Id = App_Name + "_" + App_Rnumber;

    //insert all the info into database
    await createtask(Task_Id, Task_Name, Task_Notes, Task_Description, Task_Plan, Task_App_Acronym, Task_Owner, Task_Creator, Task_Plan_Color, function (err, data) {
      if (err) {
        console.log("ERROR:", err);
        res.status(400).json({ msg: err });
      } else {
        //console.log(App_Rnumber);
        var App_Rnumber1 = App_Rnumber + 1;
        updateRnumber(App_Rnumber1, App_Name, function (err, data) {});
        //console.log("result from db is : ", data);
        res.json({ msg: "Task Successfully Created!" });
      }
    });
  }
};

//UPDATE APPLICATION FUNCTION
export const UpdateApp = async (req, res) => {
  const { App_Name, App_Description, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done } = req.body;
  //console.log(req.body);
  if (!App_Description && !App_Start_Date && !App_End_Date && !App_Permit_Create && !App_Permit_Open && !App_Permit_Todolist && !App_Permit_Doing && !App_Permit_Done) {
    res.status(400).json({ msg: "Please enter at least one field to update application information." });
    return;
  }

  //update info in database
  await updateapp(App_Name, App_Description, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
  });
  res.json({ msg: "Application information updated!" });
};

//UPDATE PLAN FUNCTION
export const UpdatePlan = async (req, res) => {
  const { Plan_Name, Plan_Start_Date, Plan_End_Date } = req.body;
  //console.log("plan udpate", req.body);
  if (!Plan_Name && !Plan_Start_Date && !Plan_End_Date) {
    res.status(400).json({ msg: "Please enter at least one field to update application information." });
    return;
  }

  //update info in database
  await updateplan(Plan_Name, Plan_Start_Date, Plan_End_Date, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
  });
  res.json({ msg: "Plan information updated!" });
};

//GETAPPS FUNCTION
export const GetApps = async (req, res) => {
  get_apps(function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
      const Data = Array.from(data);
      //console.log(Data);
      res.json(Data);
    }
  });
};

//GET APP FUNCTION
export const get_App = async (req, res) => {
  //console.log(req.body);
  const App_Name = req.body;
  get_app(App_Name, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.json(data);
      //console.log(data);
    }
  });
};

//GET APP FUNCTION 2
export const Get_App = async (req, res) => {
  //console.log(req.body);
  const { App_Name } = req.body;
  Get_app(App_Name, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.json(data);
      //console.log(data);
    }
  });
};

//GET THE DIFF TASK_ID FUNCTION
export const get_taskid = async (req, res) => {
  get_task_id(function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log(data);
      res.json(data);
    }
  });
};

//GET THE PLAN NAMES FUNCTION
export const get_plan_name = async (req, res) => {
  const { Plan_App_Acronym } = req.body;
  get_plan_Name(Plan_App_Acronym, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log(data);
      res.json(data);
    }
  });
};

//GETPLANS FUNCTION
export const GetPlans = async (req, res) => {
  const { Plan_App_Acronym } = req.body;
  get_plans(Plan_App_Acronym, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
    const Data = Array.from(data);
    res.json(Data);
  });
};

//GET ONE PLAN FUNCTION
export const GetPlan = async (req, res) => {
  const { Plan_App_Acronym, Plan_Name } = req.body;
  console.log("he", Plan_App_Acronym);
  console.log("she", Plan_Name);
  get_plan(Plan_App_Acronym, Plan_Name, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
    // const Data = Array.from(data);
    // res.json(Data);
    res.json(data);
    console.log("hey", data);
  });
};

//GETTASKS FUNCTION
export const GetTasks = async (req, res) => {
  get_tasks(function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
    const Data = Array.from(data);
    res.json(Data);
  });
};

//GET TASK INFO FUNCTION
export const GetTaskInfo = async (req, res) => {
  const { Task_Id } = req.body;
  console.log("this", req.body);
  get_taskinfo(Task_Id, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
    const Data = Array.from(data);
    res.json(Data);
  });
};

//GETTASKID FUNCTION
export const GetTaskId = async (req, res) => {
  const { Task_App_Acronym, Task_Name } = req.body;
  Get_taskid(Task_App_Acronym, Task_Name, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
    const Data = Array.from(data);
    res.json(Data);
    console.log("yo", Data);
  });
};

//UPDATE TASK FUNCTION
export const UpdateTask = async (req, res) => {
  var { Task_Id, Task_Notes, Task_Description, Task_Owner, Task_State, Task_Create_Date, Task_Plan, Task_Plan_Color } = req.body;
  console.log("update task", req.body);
  if (!Task_Notes && !Task_Description && !Task_Plan) {
    res.status(400).json({ msg: "Please enter at least one field to update task information." });
    return;
  }

  //update info in database

  Task_Notes = Task_Notes + "\n";
  await updatetask(Task_Id, Task_Notes, Task_Description, Task_Owner, Task_State, Task_Create_Date, Task_Plan, Task_Plan_Color, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
  });
  res.json({ msg: "Task information updated!" });
};

//PROMOTE TASK FUNCTION
export const PromoteTask = async (req, res) => {
  var { Task_Id, Task_State, user_group, Task_Owner, Task_Notes } = req.body;
  // console.log("Hey", req.body);
  // console.log("yoo", req.body.Task_Id);

  //update info in database
  Task_Notes = Task_Notes + "\n";
  await promotetask(Task_Id, Task_State, user_group, Task_Owner, Task_Notes, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    }
    // if ((Task_State = "Doing")) {
    //   sendEmail(req.body);
    // } else {
    //   //console.log("result from db is : ", data);
    // }
  });
  res.json({ msg: "Task information updated!" });
};

//DEMOTE TASK FUNCTION
export const DemoteTask = async (req, res) => {
  var { Task_Id, Task_State, user_group, Task_Owner, Task_Notes } = req.body;

  //update info in database
  Task_Notes = Task_Notes + "\n";
  await demotetask(Task_Id, Task_State, user_group, Task_Owner, Task_Notes, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
  });
  res.json({ msg: "Task information updated!" });
};

// //GET USER GROUP OF USER FUNCTION
// export const GetGroup = async (req, res) => {
//   const { username } = req.body;

//   await getgroup(username, function (err, data) {
//     if (err) {
//       console.log("ERROR:", err);
//     } else {
//       //console.log("result from db is : ", data);
//     }
//   });
//   res.json({ msg: "Get group obtained." });
// };

//GET ALL TASK BY OPEN STATE FUNCTION
export const getAllTaskByOpen = async (req, res) => {
  // console.log(req.body);
  const { Task_App_Acronym, Task_State } = req.body;
  Get_all_task_by_open(Task_App_Acronym, Task_State, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      return res.json(data);
      res.json(data);
      //console.log(data);
    }
  });
};

//GET ALL TASK BY TODO STATE FUNCTION
export const getAllTaskByToDo = async (req, res) => {
  // console.log(req.body);
  const { Task_App_Acronym, Task_State } = req.body;
  Get_all_task_by_todo(Task_App_Acronym, Task_State, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      return res.json(data);
      res.json(data);
      //console.log(data);
    }
  });
};

//GET ALL TASK BY DOING STATE FUNCTION
export const getAllTaskByDoing = async (req, res) => {
  // console.log(req.body);
  const { Task_App_Acronym, Task_State } = req.body;
  Get_all_task_by_doing(Task_App_Acronym, Task_State, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      return res.json(data);
      res.json(data);
      //console.log(data);
    }
  });
};

//GET ALL TASK BY DONE STATE FUNCTION
export const getAllTaskByDone = async (req, res) => {
  // console.log(req.body);
  const { Task_App_Acronym, Task_State } = req.body;
  Get_all_task_by_done(Task_App_Acronym, Task_State, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      return res.json(data);
      res.json(data);
      //console.log(data);
    }
  });
};

//GET ALL TASK BY CLOSE STATE FUNCTION
export const getAllTaskByClose = async (req, res) => {
  // console.log(req.body);
  const { Task_App_Acronym, Task_State } = req.body;
  Get_all_task_by_close(Task_App_Acronym, Task_State, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      return res.json(data);
      res.json(data);
      //console.log(data);
    }
  });
};

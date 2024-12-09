import db from "../config/Database.js";
import { sendEmail } from "../controllers/sendEmail.js";

//CREATE NEW APPLICATION FUNCTION
export const createapp = async function (App_Name, App_Description, App_Rnumber, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done, callback) {
  db.query("INSERT INTO applications (App_Name, App_Description, App_Rnumber, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done) VALUES ?", [[[App_Name.trim(), App_Description, App_Rnumber, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done]]], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//SEARCH IF APP NAME ALR EXIST IN DB FUNCTION
export const find_appname = async function (App_Name, callback) {
  db.query("SELECT * FROM applications WHERE App_Name =?", [App_Name], async function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//CREATE NEW PLAN FUNCTION
export const createplan = async function (Plan_Name, Plan_Start_Date, Plan_End_Date, Plan_App_Acronym, Plan_Color, callback) {
  db.query("INSERT INTO plan (Plan_Name, Plan_Start_Date, Plan_End_Date, Plan_App_Acronym, Plan_Color) VALUES ?", [[[Plan_Name, Plan_Start_Date, Plan_End_Date, Plan_App_Acronym, Plan_Color]]], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//SEARCH IF PLAN NAME ALR EXIST IN DB FUNCTION
export const find_planname = async function (Plan_Name, callback) {
  db.query("SELECT * FROM plan WHERE Plan_Name =?", [Plan_Name], async function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//CREATE NEW TASK FUNCTION
export const createtask = async function (Task_Id, Task_Name, Task_Notes, Task_Description, Task_Plan, Task_App_Acronym, Task_Owner, Task_Creator, Task_Plan_Color, callback) {
  db.query("INSERT INTO task (Task_Id, Task_Name, Task_Notes, Task_Description, Task_State, Task_Plan, Task_App_Acronym, Task_Owner, Task_Creator, Task_Create_Date, Task_Plan_Color) VALUES ?", [[[Task_Id, Task_Name, Task_Notes, Task_Description, "Open", Task_Plan, Task_App_Acronym, Task_Owner, Task_Creator, new Date().toLocaleString(), Task_Plan_Color]]], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const getcolorfromplan = async function (Task_Plan, App_Name, callback) {
  //console.log("yooo", Task_Plan);
  db.query("SELECT Plan_Color FROM plan WHERE Plan_Name=? AND Plan_App_Acronym=? ", [Task_Plan, App_Name], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const updateRnumber = async function (App_Rnumber, App_Name, callback) {
  //console.log("a", typeof App_Rnumber);
  //console.log("b", App_Name);
  db.query("UPDATE applications SET App_Rnumber=? WHERE App_Name=?", [App_Rnumber, App_Name], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//SEARCH IF TASK NAME ALR EXIST IN DB FUNCTION
export const find_taskId = async function (Task_Id, callback) {
  db.query("SELECT * FROM task WHERE Task_Id =?", [Task_Id], async function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//UPDATE APP FUNCTION

export const updateapp = async function (App_Name, App_Description, App_Start_Date, App_End_Date, App_Permit_Create, App_Permit_Open, App_Permit_Todolist, App_Permit_Doing, App_Permit_Done, callback) {
  if (App_Description) {
    db.query("UPDATE applications SET App_Description=? WHERE App_Name=?", [App_Description, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
  if (App_Start_Date) {
    db.query("UPDATE applications SET App_Start_Date=? WHERE App_Name=?", [App_Start_Date, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (App_End_Date) {
    db.query("UPDATE applications SET App_End_Date=? WHERE App_Name=?", [App_End_Date, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (App_Permit_Create) {
    db.query("UPDATE applications SET App_Permit_Create=? WHERE App_Name=?", [App_Permit_Create, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (App_Permit_Open) {
    db.query("UPDATE applications SET App_Permit_Open=? WHERE App_Name=?", [App_Permit_Open, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (App_Permit_Todolist) {
    db.query("UPDATE applications SET App_Permit_Todolist=? WHERE App_Name=?", [App_Permit_Todolist, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (App_Permit_Doing) {
    db.query("UPDATE applications SET App_Permit_Doing=? WHERE App_Name=?", [App_Permit_Doing, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (App_Permit_Done) {
    db.query("UPDATE applications SET App_Permit_Done=? WHERE App_Name=?", [App_Permit_Done, App_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
};

//UPDATE PLAN FUNCTION

export const updateplan = async function (Plan_Name, Plan_Start_Date, Plan_End_Date, callback) {
  // if (Plan_Description) {
  //   db.query("UPDATE plan SET Plan_Description=? WHERE Plan_Name=?", [Plan_Description, Plan_Name], function (err, result) {
  //     if (err) callback(err, null);
  //     else callback(null, result);
  //   });
  // }
  if (Plan_Start_Date) {
    db.query("UPDATE plan SET Plan_Start_Date=? WHERE Plan_Name=?", [Plan_Start_Date, Plan_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Plan_End_Date) {
    db.query("UPDATE plan SET Plan_End_Date=? WHERE Plan_Name=?", [Plan_End_Date, Plan_Name], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  // if (Plan_Notes) {
  //   db.query("UPDATE plan SET Plan_Notes=? WHERE Plan_Notes=?", [Plan_Notes, Plan_Name], function (err, result) {
  //     if (err) callback(err, null);
  //     else callback(null, result);
  //   });
  // }

  // if (Add_Task) {
  //   db.query("UPDATE plan SET Add_Task=? WHERE Plan_Name=?", [Add_Task, Plan_Name], function (err, result) {
  //     if (err) callback(err, null);
  //     else callback(null, result);
  //   });
  // }
};

//GET APPLICATIONS FUNCTION
export const get_apps = async function (callback) {
  db.query("SELECT *  FROM applications", async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GETAPP FUNCTION
export const get_app = async function (App_Name, callback) {
  console.log(App_Name.App_Name);
  db.query("SELECT * FROM accounts WHERE App_Name =? ", [App_Name.App_Name], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GETAPP FUNCTION 2
export const Get_app = async function (App_Name, callback) {
  //console.log("yoo", App_Name);
  db.query("SELECT * FROM applications WHERE App_Name =? ", [App_Name], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET THE DIFF TASK_ID FUNCTION
export const get_task_id = function (callback) {
  db.query("SELECT Task_Id FROM task", function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET THE PLAN NAMES FUNCTION
export const get_plan_Name = function (Plan_App_Acronym, callback) {
  db.query("SELECT Plan_Name FROM plan WHERE Plan_App_Acronym=?", [Plan_App_Acronym], async function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET PLANS FUNCTION
export const get_plans = async function (Plan_App_Acronym, callback) {
  db.query("SELECT Plan_Name,  Plan_End_Date, Plan_Start_Date, Plan_Color FROM plan WHERE Plan_App_Acronym = ? ", [Plan_App_Acronym], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET ONE PLAN FUNCTION
export const get_plan = async function (Plan_App_Acronym, Plan_Name, callback) {
  db.query("SELECT Plan_Color FROM plan WHERE Plan_App_Acronym = ? AND Plan_Name = ? ", [Plan_App_Acronym, Plan_Name], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET TASKS FUNCTION
export const get_tasks = async function (callback) {
  db.query("SELECT Task_Id, Task_Notes, Task_Description, Task_Plan, Task_State FROM task", async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET TASK INFO FUNCTION
export const get_taskinfo = async function (Task_Id, callback) {
  db.query("SELECT * FROM task WHERE Task_Id = ?", [Task_Id], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET TASKID FUNCTION
export const Get_taskid = async function (Task_App_Acronym, Task_Name, callback) {
  db.query("SELECT Task_Id FROM task WHERE Task_App_Acronym =? AND Task_Name=?", [Task_App_Acronym, Task_Name], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//UPDATE TASK FUNCTION

export const updatetask = async function (Task_Id, Task_Notes, Task_Description, Task_Owner, Task_State, Task_Create_Date, Task_Plan, Task_Plan_Color, callback) {
  if (Task_Description) {
    db.query("UPDATE task SET Task_Description=? WHERE Task_Id=?", [Task_Description, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
  // if (Task_Start_Date) {
  //   db.query("UPDATE task SET Task_Start_Date=? WHERE Task_Id=?", [Task_Start_Date, Task_Id], function (err, result) {
  //     if (err) callback(err, null);
  //     else callback(null, result);
  //   });
  // }

  // if (Task_End_Date) {
  //   db.query("UPDATE task SET Task_End_Date=? WHERE Task_Id=?", [Task_End_Date, Task_Id], function (err, result) {
  //     if (err) callback(err, null);
  //     else callback(null, result);
  //   });
  // }
  //console.log(Task_Notes);
  if (Task_Notes) {
    db.query("UPDATE task SET Task_Notes= CONCAT(?, Task_Notes) WHERE Task_Id=?", [Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_Owner) {
    db.query("UPDATE task SET Task_Owner=? WHERE Task_Id=?", [Task_Owner, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_State) {
    db.query("UPDATE task SET Task_State=? WHERE Task_Id=?", [Task_State, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_Create_Date) {
    db.query("UPDATE task SET Task_Create_Date=? WHERE Task_Id=?", [Task_Create_Date, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_Plan) {
    //console.log(Task_Plan);
    db.query("UPDATE task SET Task_Plan=? WHERE Task_Id=?", [Task_Plan, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_Plan_Color) {
    console.log(Task_Plan_Color);
    db.query("UPDATE task SET Task_Plan_Color=? WHERE Task_Id=?", [Task_Plan_Color, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
};

//PROMOTE TASK FUNCTION

export const promotetask = async function (Task_Id, Task_State, user_group, Task_Owner, Task_Notes, callback) {
  if (Task_State == "Open" && user_group === true) {
    db.query("UPDATE task SET Task_State='ToDo', Task_Owner=?, Task_Notes=CONCAT(?, Task_Notes) WHERE Task_Id=?", [Task_Owner, Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_State == "ToDo" && user_group === true) {
    db.query("UPDATE task SET Task_State='Doing', Task_Owner=?, Task_Notes=CONCAT(?, Task_Notes) WHERE Task_Id=?", [Task_Owner, Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_State == "Doing" && user_group === true) {
    db.query("UPDATE task SET Task_State='Done', Task_Owner=?, Task_Notes=CONCAT(?, Task_Notes) WHERE Task_Id=?", [Task_Owner, Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });

    sendEmail(Task_Id, Task_Owner);
  }

  if (Task_State == "Done" && user_group == true) {
    db.query("UPDATE task SET Task_State='Close', Task_Owner=?, Task_Notes=CONCAT(?, Task_notes) WHERE Task_Id=?", [Task_Owner, Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
};

//DEMOTE TASK FUNCTION

export const demotetask = async function (Task_Id, Task_State, user_group, Task_Owner, Task_Notes, callback) {
  if (Task_State == "Doing" && user_group == true) {
    db.query("UPDATE task SET Task_State='ToDo', Task_Owner=?, Task_Notes=CONCAT(?, Task_Notes) WHERE Task_Id=?", [Task_Owner, Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  if (Task_State == "Done" && user_group == true) {
    db.query("UPDATE task SET Task_State='Doing', Task_Owner=?, Task_Notes=CONCAT(?, Task_Notes) WHERE Task_Id=?", [Task_Owner, Task_Notes, Task_Id], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
};

//GET ALL TASK BY OPEN FUNCTION
export const Get_all_task_by_open = async function (Task_App_Acronym, Task_State, callback) {
  //console.log(Task_App_Acronym, Task_State);
  db.query("SELECT * FROM task WHERE Task_App_Acronym=? AND Task_State =? ", [Task_App_Acronym, Task_State], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET ALL TASK BY TODO FUNCTION
export const Get_all_task_by_todo = async function (Task_App_Acronym, Task_State, callback) {
  //console.log(Task_App_Acronym, Task_State);
  db.query("SELECT * FROM task WHERE Task_App_Acronym=? AND Task_State =? ", [Task_App_Acronym, Task_State], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET ALL TASK BY DOING FUNCTION
export const Get_all_task_by_doing = async function (Task_App_Acronym, Task_State, callback) {
  //console.log(Task_App_Acronym, Task_State);
  db.query("SELECT * FROM task WHERE Task_App_Acronym=? AND Task_State =? ", [Task_App_Acronym, Task_State], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET ALL TASK BY DONE FUNCTION
export const Get_all_task_by_done = async function (Task_App_Acronym, Task_State, callback) {
  //console.log(Task_App_Acronym, Task_State);
  db.query("SELECT * FROM task WHERE Task_App_Acronym=? AND Task_State =? ", [Task_App_Acronym, Task_State], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET ALL TASK BY DONE FUNCTION
export const Get_all_task_by_close = async function (Task_App_Acronym, Task_State, callback) {
  //console.log(Task_App_Acronym, Task_State);
  db.query("SELECT * FROM task WHERE Task_App_Acronym=? AND Task_State =? ", [Task_App_Acronym, Task_State], async function (err, result) {
    // console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

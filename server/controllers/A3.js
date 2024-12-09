import { createtask, Get_all_task_by_state, Get_app, Get_plan, promotetask, find_username, updateRnumber, getcolorfromplan, checkgroup, getstatebyID, Find_TaskId } from "../models/A3Model.js";
import bcrypt from "bcrypt";
import deasync from "deasync";

// 1. CREATE NEW TASK FUNCTION

// export const CreateTask = async (req, res, next) => {
//   const { username, password, A_acronym, T_name, T_desc, T_notes, T_plan } = req.body;
//   console.log("user info", req.body);

export const Login1 = async (req, res, next) => {
  const { username, password, A_acronym, T_name, T_desc, T_notes, T_plan } = req.body;
  console.log("user info", req.body);

  const keys = Object.keys(req.body);

  const MandatoryKeysArrays = ["username", "password", "A_acronym", "T_name", "T_desc", "T_notes", "T_plan"];
  let isCorrectParams = MandatoryKeysArrays.every(data => keys.includes(data)) && keys.length == 7;

  if (!isCorrectParams) {
    res.status(398).json({ Code: "398" });
    return;
  }

  if (!username) {
    res.status(399).json({ Code: "399" });
    return;
  }

  if (!password) {
    res.status(399).json({ Code: "399" });
    return;
  }

  if (!A_acronym) {
    res.status(399).json({ Code: "399" });
    return;
  }
  if (!T_name) {
    res.status(399).json({ Code: "399" });
    return;
  }

  find_username(username, async function (err, data) {
    console.log("find_username", data);
    if (err) {
      console.log("ERROR:", err);
      res.status(401).json({ Code: "401" });
      return;
    } else if (data.length == 0) {
      //if username does not exist in database, no entry

      res.status(401).json({ Code: "401" });
      return;
    } else {
      if (data[0].status == "0") {
        //if status is inactive, no entry
        res.status(401).json({ Code: "401" });
        return;
      }

      const match = await bcrypt.compare(req.body.password, data[0].password);
      if (!match) {
        res.status(401).json({ Code: "401" });
        return;
      }
      next();
    }
  });
};

export const Getapp = async (req, res, next) => {
  const { username, password, A_acronym, T_name, T_desc, T_notes, T_plan } = req.body;
  await Get_app(A_acronym, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
      return;
    } else if (data.length == 0) {
      res.status(402).json({ Code: "402" });
      return;
    }
    req.getappdata = data;
    next();
  });
};

export const Getplan = async (req, res, next) => {
  const { username, password, A_acronym, T_name, T_desc, T_notes, T_plan } = req.body;
  await Get_plan(A_acronym, async function (err, data) {
    console.log(data);
    let Tplancheck = false;
    const grouplist = data;
    for (let group of grouplist) {
      console.log(group.Plan_Name);
      if (T_plan == group.Plan_Name || T_plan == "") {
        Tplancheck = true;
      }
    }

    if (err) {
      console.log("ERROR:", err);
      return;
    } else if (Tplancheck == false) {
      res.status(403).json({ Code: "403" });
      return;
    }
    next();
  });
};

export const CheckGroup = async (req, res, next) => {
  const { username, password, A_acronym, T_name, T_desc, T_notes, T_plan } = req.body;
  console.log("checkgrp", req.getappdata[0].App_Permit_Create);

  // let sync = true;
  let usersinGroup = false;
  await checkgroup(username, (err, data) => {
    let groupname = req.getappdata[0].App_Permit_Create;
    if (err) {
      console.log("err", err);
    } else {
      if (data[0].usergroup == groupname) {
        usersinGroup = true;
      } else {
        usersinGroup = false;
      }
    }
    // sync = false;
    console.log("usersinGroup", usersinGroup);
    if (usersinGroup == false) {
      res.status(405).json({ Code: "405" });
      return;
    }
    next();
  });
  // while (sync) {
  //   deasync.sleep(10);
  // }
};

export const CreateTask = async (req, res, next) => {
  const { username, password, A_acronym, T_name, T_desc, T_notes, T_plan } = req.body;
  console.log("getapp", req.getappdata[0]);

  var App_Rnumber = req.getappdata[0].App_Rnumber;
  console.log("appRnumber", req.getappdata[0].App_Rnumber);

  var tasknotes = "Task" + " " + T_name + " " + " was created by" + " " + username + " " + "on" + " " + new Date().toLocaleString() + " " + "with" + " " + "Task Notes added:" + " " + T_notes;

  var taskplancolor = "";
  console.log(T_plan);
  if (T_plan) {
    await getcolorfromplan(T_plan, A_acronym, async function (err, data) {
      console.log(data);

      taskplancolor = data[0].Plan_Color;
      console.log("TPC", taskplancolor);

      var Task_Id = A_acronym + "_" + App_Rnumber;
      console.log("Task_id", Task_Id);

      var taskcreator = username;
      console.log("TC", taskcreator);

      //insert all the info into database
      await createtask(Task_Id, T_name, tasknotes, T_desc, T_plan, A_acronym, username, taskcreator, taskplancolor, function (err, data) {
        if (err) {
          console.log("ERROR:", err);
          res.status(400).json({ msg: err });
        } else {
          //console.log(App_Rnumber);
          var App_Rnumber1 = App_Rnumber + 1;
          updateRnumber(App_Rnumber1, A_acronym, function (err, data) {});
          console.log("result from db is : ", data);
          res.status(201).json({ Code: "201", Task_id: Task_Id });
        }
      });
    });
  } else {
    taskplancolor = "#FFFFFF";

    var Task_Id = A_acronym + "_" + App_Rnumber;

    //insert all the info into database
    await createtask(Task_Id, T_name, T_notes, T_desc, T_plan, A_acronym, username, username, taskplancolor, function (err, data) {
      if (err) {
        console.log("ERROR:", err);
        res.status(400).json({ msg: err });
      } else {
        console.log(App_Rnumber);
        var App_Rnumber1 = App_Rnumber + 1;
        updateRnumber(App_Rnumber1, A_acronym, function (err, data) {});
        console.log("result from db is : ", data);
        res.status(201).json({ Code: "201", Task_id: Task_Id });
      }
    });
  }
};

// // 2. GET TASK BY STATE FUNCTION
export const Login2 = async (req, res, next) => {
  const { username, password, A_acronym, T_state } = req.body;
  console.log("user info", req.body);
  console.log(Object.keys(req.body).length);

  const keys = Object.keys(req.body);

  const MandatoryKeysArrays = ["username", "password", "A_acronym", "T_state"];
  let isCorrectParams = MandatoryKeysArrays.every(data => keys.includes(data)) && keys.length == 4;

  if (!isCorrectParams) {
    res.status(398).json({ Code: "398" });
    return;
  }

  if (!username) {
    res.status(399).json({ Code: "399" });
    return;
  }

  if (!password) {
    res.status(399).json({ Code: "399" });
    return;
  }

  if (!A_acronym) {
    res.status(399).json({ Code: "399" });
    return;
  }
  if (!T_state) {
    res.status(399).json({ Code: "399" });
    return;
  }

  find_username(username, async function (err, data) {
    console.log("find_username", data);
    if (err) {
      console.log("ERROR:", err);
      res.status(401).json({ Code: "401" });
      return;
    } else if (data.length == 0) {
      //if username does not exist in database, no entry

      res.status(401).json({ Code: "401" });
      return;
    } else {
      if (data[0].status == "0") {
        //if status is inactive, no entry
        res.status(401).json({ Code: "401" });
        return;
      }

      const match = await bcrypt.compare(req.body.password, data[0].password);
      if (!match) {
        res.status(401).json({ Code: "401" });
        return;
      }
      next();
    }
  });
};

export const FindApp = async (req, res, next) => {
  //console.log(req.body);
  const { username, password, A_acronym, T_state } = req.body;

  Get_app(A_acronym, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else if (data.length == 0) {
      res.status(402).json({ Code: "402" });

      return;
    }
    next();
  });
};

export const GetTaskByState = async (req, res, next) => {
  const { username, password, A_acronym, T_state } = req.body;
  console.log(req.body);

  if (T_state != "Open" && T_state != "ToDo" && T_state != "Doing" && T_state != "Done" && T_state != "Close") {
    res.status(403).json({ Code: "403" });
    return;
  }

  await Get_all_task_by_state(A_acronym, T_state, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.status(201).json({ Code: "201", Tasks: data });
      console.log("Code:201", data);
    }
  });
};

// // 3. PROMOTE TASK FUNCTION
export const Login3 = async (req, res, next) => {
  const { username, password, T_id } = req.body;
  console.log("user info", req.body);
  console.log(Object.keys(req.body).length);

  const keys = Object.keys(req.body);

  const MandatoryKeysArrays = ["username", "password", "T_id"];
  let isCorrectParams = MandatoryKeysArrays.every(data => keys.includes(data)) && keys.length == 3;

  if (!isCorrectParams) {
    res.status(398).json({ Code: "398" });
    return;
  }

  if (!username) {
    res.status(399).json({ Code: "399" });
    return;
  }

  if (!password) {
    res.status(399).json({ Code: "399" });
    return;
  }

  if (!T_id) {
    res.status(399).json({ Code: "399" });
    return;
  }

  find_username(username, async function (err, data) {
    console.log("find_username", data);
    if (err) {
      console.log("ERROR:", err);
      res.status(401).json({ Code: "401" });
      return;
    } else if (data.length == 0) {
      //if username does not exist in database, no entry

      res.status(401).json({ Code: "401" });
      return;
    } else {
      if (data[0].status == "0") {
        //if status is inactive, no entry
        res.status(401).json({ Code: "401" });
        return;
      }

      const match = await bcrypt.compare(req.body.password, data[0].password);
      if (!match) {
        res.status(401).json({ Code: "401" });
        return;
      }
      next();
    }
  });
};

// export const FindTaskId = async (req, res, next) => {
//   const { username, password, T_id } = req.body;
//   Find_TaskId(T_id, async function (err, data) {
//     console.log("APPNAME", data);
//     if (err) {
//       console.log("ERROR:", err);
//     } else {
//       console.log("AppINFO", data[0].Task_App_Acronym);
//     }
//     req.getappname = data[0].Task_App_Acronym;
//     req.getstate = data[0].Task_State;
//     next();
//   });
// };

export const getstatebyid = async (req, res, next) => {
  const { username, password, T_id } = req.body;
  await getstatebyID(T_id, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
      return;
    } else if (data.length == 0) {
      res.status(402).json({ Code: "402" });
      return;
    } else if (data[0].Task_State != "Doing") {
      console.log("state by id", data);
      res.status(403).json({ Code: "403" });
      return;
    }
    req.getappname = data[0].Task_App_Acronym;
    req.getstate = data[0].Task_State;
    next();
  });
};

export const FindApp2 = async (req, res, next) => {
  //console.log(req.body);
  const { username, password, T_id } = req.body;

  Get_app(req.getappname, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    }
    // else if (data.length == 0) {
    //   res.status(400).json({ Code: "400", msg: "Invalid App_Acronym requested" });
    //   console.log("Err Code 400", data);
    //   return;
    // }
    else {
      console.log("AppINFO", data[0]);
      var AppPermitDoing = data[0].App_Permit_Doing;
    }

    // let sync = true;
    //console.log("hello", username, groupname);
    let usersinGroup = false;
    await checkgroup(username, (err, data) => {
      let groupname = AppPermitDoing;
      if (err) {
        console.log("err", err);
      } else {
        if (data[0].usergroup == groupname) {
          usersinGroup = true;
        } else {
          usersinGroup = false;
        }
      }
      // sync = false;
      console.log("usersinGroup", usersinGroup);
      if (usersinGroup == false) {
        res.status(405).json({ Code: "405" });
        return;
      }
      next();
    });
    // while (sync) {
    //   deasync.sleep(10);
    // }
  });
};

export const PromoteTask = async (req, res) => {
  var { T_id, username } = req.body;

  //update info in database
  // Task_Notes = Task_Notes + "\n";

  console.log("STATE", req.getstate);
  var Task_Notes = "Task" + " " + T_id + " " + "was promoted from 'Doing' to 'Done' state by" + " " + username + " " + "on" + " " + new Date().toLocaleString();

  promotetask(T_id, req.getstate, username, Task_Notes, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log(data);
    }
  });
  res.json({ Code: "201" });
};

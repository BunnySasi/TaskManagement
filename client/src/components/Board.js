import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateTimePicker from "react-datetime-picker";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { HexColorPicker } from "react-colorful";
import LinesEllipsis from "react-lines-ellipsis";

const Board = () => {
  var [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [user_group, setUser_group] = useState([]);
  const [plan_group, setPlan_group] = useState("");
  const [user_group_Create, setUser_group_Create] = useState([]);
  const [user_group_db, setUser_group_db] = useState([]);
  const [user_group_db1, setUser_group_db1] = useState([]);
  const [plan_name_db, setPlan_name_db] = useState([]);
  const [msg, setMsg] = useState("");
  const [Create_Plan, setCreate_Plan] = useState("");
  const [submit, setSubmit] = useState("");
  const [color, setColor] = useState("");
  const [taskList, setTaskList] = useState([]);

  const [Plan_Name, setPlan_Name] = useState("");
  const [Plan_Notes, setPlan_Notes] = useState("");
  const [Plan_Description, setPlan_Description] = useState("");
  const [Add_Task, setAdd_Task] = useState("");
  const [Plan_Start_Date, setPlan_Start_Date] = useState(new Date());
  const [Plan_End_Date, setPlan_End_Date] = useState(new Date());
  const [plans, setPlans] = useState([]);

  const [Task_Id, setTask_Id] = useState("");
  const [Task_Notes, setTask_Notes] = useState("");
  const [Task_Description, setTask_Description] = useState("");
  const [Task_Plan, setTask_Plan] = useState("");
  const [Task_Name, setTask_Name] = useState("");
  const [Task_Start_Date, setTask_Start_Date] = useState(new Date());
  const [Task_End_Date, setTask_End_Date] = useState(new Date());
  const [Task_State, setTask_State] = useState("");
  const [Task_Create_Date, setTask_Create_Date] = useState("");
  const [Task_Owner, setTask_Owner] = useState("");
  const [Task_App_Acronym, setTask_App_Acronym] = useState("");
  const [tasks, setTasks] = useState([]);
  const [Audit_Trail, setAudit_Trail] = useState([]);

  const [user_state_perm_create, setUser_state_perm_create] = useState(false);
  const [user_state_perm_open, setUser_state_perm_open] = useState(false);
  const [user_state_perm_todo, setUser_state_perm_todo] = useState(false);
  const [user_state_perm_doing, setUser_state_perm_doing] = useState(false);
  const [user_state_perm_done, setUser_state_perm_done] = useState(false);

  const { user } = useParams();
  const { app_name } = useParams();
  const app = useParams().app;

  useEffect(() => {
    getPlans();
    // getTasks();
    getAllTaskByState();
    updateTask();
    setSubmit(false);
    gettaskinfo();
  }, [submit]);

  useEffect(() => {
    // getAllTaskByState();
    get_groupslist();
    get_planlist();
    State_Create();
    State_Open();
    State_Todo();
    State_Doing();
    State_Done();
    Createplan();
    refreshToken();
  }, []);

  // refreshToken();
  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:3001/token", {
        username: user
      });
      console.log(response);
      if (response.data == true) {
        console.log("reached");
      } else {
        await axios.post("http://localhost:3001/logout");
        navigate("/");
        sessionStorage.clear();
      }
    } catch (error) {
      // setToken(response.data.accessToken);
      // const decoded = jwt_decode(response.data.accessToken);
      // setUsername(decoded.name);
      // setExpire(decoded.exp);
      if (error.response) {
        navigate("/");
      }
    }
  };

  const getPlans = async () => {
    const response = await axios.post("http://localhost:3001/GetPlans", {
      Plan_App_Acronym: app_name
    });
    setPlans(response.data);
    //console.log(response.data);
  };

  // const getTasks = async () => {
  //   const response = await axios.get("http://localhost:3001/GetTasks", {});
  //   setTasks(response.data);
  //   //console.log(response.data);
  // };

  // CREATE NEW TASK MODAL

  const createtaskButton = document.querySelector("#createtask");
  const modalBg4 = document.querySelector("#modal-bg4");
  const modal4 = document.querySelector("#modal4");

  if (createtaskButton) {
    createtaskButton.addEventListener("click", () => {
      setTask_Name("");
      setTask_Notes("");
      setTask_Description("");
      modal4.classList.add("is-active");
    });
  }

  if (modalBg4) {
    modalBg4.addEventListener("click", () => {
      modal4.classList.remove("is-active");
      const form = document.getElementById("form4");
      form.reset();
      setTask_Name("");
      setTask_Notes("");
      setTask_Description("");
    });
  }

  //MULTI SELECT PLAN FUNCTION
  const handleChangePlan = e => {
    console.log(e);
    console.log(Object.keys(e).length);
    if (Object.keys(e).length) {
      setPlan_group(e);
    } else {
    } //updated to the latest usergroups selected
  };

  const get_planlist = async () => {
    try {
      const response = await axios.post("http://localhost:3001/GetPlanName", {
        Plan_App_Acronym: app_name
      }); //get all the diff taskID in the task table
      var new_array = []; //create an array format
      for (let i = 0; i < response.data.length; i++) {
        new_array.push({ value: response.data[i].Plan_Name, label: response.data[i].Plan_Name });
      }
      setPlan_name_db(new_array); //updated to latest usergroups and shown in multi-select option below

      //console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setMsg(error.response.data.msg);
      }
    }
  };

  //MULTI SELECT TASK FUNCTION
  const handleChange = e => {
    console.log(e);
    setUser_group(e); //updated to the latest usergroups selected
  };

  const get_groupslist = async () => {
    try {
      const response = await axios.get("http://localhost:3001/GetTaskId", {}); //get all the diff taskID in the task table
      var new_array = []; //create an array format
      for (let i = 0; i < response.data.length; i++) {
        new_array.push({ value: response.data[i].Task_Id, label: response.data[i].Task_Id });
      }
      setUser_group_db(new_array); //updated to latest usergroups and shown in multi-select option below
      setUser_group_db1(new_array);
      //console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setMsg(error.response.data.msg);
      }
    }
  };

  // const getUsers = async () => {
  //   const response = await axiosJWT.get("http://localhost:3001/users", {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  //   setUsers(response.data);

  // CREATE NEW PLAN MODAL
  const createplanButton = document.querySelector("#createplan");
  const modalBg1 = document.querySelector("#modal-bg1");
  const modal1 = document.querySelector("#modal1");

  if (createplanButton) {
    createplanButton.addEventListener("click", () => {
      setPlan_Start_Date("");
      setPlan_End_Date("");
      modal1.classList.add("is-active");
    });
  }

  if (modalBg1) {
    modalBg1.addEventListener("click", () => {
      modal1.classList.remove("is-active");
      const form = document.getElementById("form2");
      form.reset();
    });
  }

  // EDIT PLAN MODAL
  const editmodalOpen = document.querySelector("#modal");
  const modalBg = document.querySelector("#modal-bg");

  function EditPlan(plan) {
    // console.log(app.App_Permit_Create);
    editmodalOpen.classList.add("is-active");
    if (modalBg) {
      modalBg.addEventListener("click", () => editmodalOpen.classList.remove("is-active"));
    }

    var plan_name_arr = []; //create new var array
    plan_name_arr.push({ value: plan.Plan_Name, label: plan.Plan_Name });
    // var plan_description_arr = []; //create new var array
    // plan_description_arr.push({ value: plan.Plan_Description, label: plan.Plan_Description });
    // var plan_notes_arr = []; //create new var array
    // plan_notes_arr.push({ value: plan.Plan_Notes, label: plan.Plan_Notes });
    // console.log(plan);
    // console.log(plan.Plan_Start_Date);
    // console.log(plan.Plan_End_Date);
    var plan_start_date_arr = []; //create new var array
    plan_start_date_arr.push({ value: plan.Plan_Start_Date, label: plan.Plan_Start_Date });
    var plan_end_date_arr = []; //create new var array
    plan_end_date_arr.push({ value: plan.Plan_End_Date, label: plan.Plan_End_Date });

    setPlan_Name(plan_name_arr[0].label);
    // setPlan_Description(plan_description_arr[0].label);
    // setPlan_Notes(plan_notes_arr[0].label);
    setPlan_Start_Date(plan_start_date_arr[0].label);
    setPlan_End_Date(plan_end_date_arr[0].label);
  }

  // VIEW TASK MODAL (ONLY VIEW)
  const editmodalOpen5 = document.querySelector("#modal5");
  const modalBg5 = document.querySelector("#modal-bg5");

  function ViewTask(task) {
    editmodalOpen5.classList.add("is-active");
    if (modalBg5) {
      modalBg5.addEventListener("click", () => editmodalOpen5.classList.remove("is-active"));
    }

    var task_id_arr = []; //create new var array
    task_id_arr.push(task.Task_Id);
    var task_name_arr = []; //create new var array
    task_name_arr.push(task.Task_Name);
    var task_description_arr = []; //create new var array
    task_description_arr.push(task.Task_Description);
    var task_notes_arr = []; //create new var array
    task_notes_arr.push(task.Task_Notes);
    var task_owner_arr = [];
    task_owner_arr.push(sessionStorage.getItem("Username"));
    var task_state_arr = [];
    task_state_arr.push(task.Task_State);
    var task_create_date_arr = [];
    task_create_date_arr.push(new Date().toLocaleString());
    var task_change_plan_arr = [];
    task_change_plan_arr.push(task.Task_Plan);

    setTask_Id(task_id_arr);
    setTask_Name(task_name_arr);
    setTask_Description(task_description_arr);
    setTask_Notes(task_notes_arr);
    setTask_Owner(task_owner_arr);
    setTask_State(task_state_arr);
    setTask_Create_Date(task_create_date_arr);
    setAudit_Trail(task.Task_Notes);
    setPlan_group(task_change_plan_arr);
  }

  // EDIT TASK MODAL FOR ALL STATES EXCEPT CLOSE STATE
  const editmodalOpen2 = document.querySelector("#modal2");
  const modalBg2 = document.querySelector("#modal-bg2");

  const gettaskinfo = async e => {
    try {
      var GetTaskInfo = await axios.post("http://localhost:3001/GetTaskInfo", {
        Task_Id: Task_Id
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
    console.log(Task_Id);
    console.log(GetTaskInfo.data[0].Task_Plan);

    //setPlan_group(GetTaskInfo.data[0].Task_Plan);
    setTask_Description(GetTaskInfo.data[0].Task_Description);
    setAudit_Trail(GetTaskInfo.data[0].Task_Notes);
  };
  // gettaskinfo();

  function EditTask(task) {
    //console.log(task);
    // console.log(app.App_Permit_Create);
    editmodalOpen2.classList.add("is-active");
    setTask_Notes("");
    if (modalBg2) {
      modalBg2.addEventListener("click", () => editmodalOpen2.classList.remove("is-active"));
      setTask_Notes("");
    }

    var task_id_arr = []; //create new var array
    task_id_arr.push(task.Task_Id);
    var task_name_arr = []; //create new var array
    task_name_arr.push(task.Task_Name);
    var task_description_arr = []; //create new var array
    task_description_arr.push(task.Task_Description);
    var task_notes_arr = []; //create new var array
    task_notes_arr.push(task.Task_Notes);
    var task_owner_arr = [];
    task_owner_arr.push(sessionStorage.getItem("Username"));
    var task_state_arr = [];
    task_state_arr.push(task.Task_State);
    var task_create_date_arr = [];
    task_create_date_arr.push(new Date().toLocaleString());
    var task_change_plan_arr = [];
    task_change_plan_arr.push({ value: task.Task_Plan, label: task.Task_Plan });

    console.log(task_change_plan_arr);

    setTask_Id(task_id_arr);
    setTask_Name(task_name_arr);
    setTask_Description(task_description_arr);
    setTask_Notes("");
    setTask_Owner(task_owner_arr);
    setTask_State(task_state_arr);
    setTask_Create_Date(task_create_date_arr);
    setPlan_group({ value: task.Task_Plan, label: task.Task_Plan });
    //setTask_Notes("Task notes:" + " " + task.Task_Notes + ", " + "Logon Userid is:" + " " + sessionStorage.getItem("Username") + ", " + "Task State is:" + " " + task.Task_State + ", " + "Task Updated on:" + " " + new Date().toLocaleString());
    setAudit_Trail(task.Task_Notes);
    //setSubmit(true);
  }

  // EDIT TASK MODAL FOR CLOSE STATE
  const editmodalOpen3 = document.querySelector("#modal3");
  const modalBg3 = document.querySelector("#modal-bg3");

  function EditTaskClose(task) {
    // console.log(app.App_Permit_Create);
    editmodalOpen3.classList.add("is-active");
    if (modalBg3) {
      modalBg3.addEventListener("click", () => editmodalOpen3.classList.remove("is-active"));
    }

    var task_id_arr = []; //create new var array
    task_id_arr.push(task.Task_Id);
    var task_name_arr = []; //create new var array
    task_name_arr.push(task.Task_Name);
    var task_description_arr = []; //create new var array
    task_description_arr.push(task.Task_Description);
    var task_notes_arr = []; //create new var array
    task_notes_arr.push(task.Task_Notes);
    var task_owner_arr = [];
    task_owner_arr.push(sessionStorage.getItem("Username"));
    var task_state_arr = [];
    task_state_arr.push(task.Task_State);
    var task_create_date_arr = [];
    task_create_date_arr.push(new Date().toLocaleString());

    setTask_Id(task_id_arr);
    setTask_Name(task_name_arr);
    setTask_Description(task_description_arr);
    setTask_Notes(task_notes_arr);
    setTask_Owner(task_owner_arr);
    setTask_State(task_state_arr);
    setTask_Create_Date(task_create_date_arr);
    //setTask_Notes("Task notes:" + " " + task.Task_Notes + ", " + "Logon Userid is:" + " " + sessionStorage.getItem("Username") + ", " + "Task State is:" + " " + task.Task_State + ", " + "Task Updated on:" + " " + new Date().toLocaleString());
    setAudit_Trail(task.Task_Notes);
  }

  //CREATE NEW PLAN FUNCTION
  const CreatePlan = async e => {
    e.preventDefault();
    var form = document.getElementById("form2");
    form.reset();
    // console.log(JSON.stringify(user_group_Create.value));
    // console.log(typeof user_group_Create.label);

    const response = await axios.post("http://localhost:3001/Apps2", {
      App_Name: app_name
    });

    var Plan_App_Acronym = response.data[0].App_Name;
    //console.log(Plan_App_Acronym);
    console.log(Plan_Start_Date);

    try {
      await axios.post("http://localhost:3001/CreateNewPlan", {
        Plan_Name: Plan_Name,
        Plan_Start_Date: Plan_Start_Date,
        Plan_End_Date: Plan_End_Date,
        Plan_App_Acronym: Plan_App_Acronym,
        Plan_Color: color
      });
      //setMsg("New Application Created.");
      //console.log("Success");

      toast.success("New plan created.");
      setSubmit(true);
      get_planlist();
      setPlan_Name("");
      // setPlan_Notes([]);
      // setPlan_Description([]);
      setPlan_Start_Date("");
      setPlan_End_Date("");
      setColor("");
    } catch (error) {
      if (error.response) {
        console.log(error.response);

        //setMsg(error.response.data.msg);
        // toast.error("App name already exist.");
        toast.error(error.response.data.msg);
      }
    }
  };

  //CREATE NEW TASK FUNCTION
  const CreateTask = async e => {
    e.preventDefault();
    const form = document.getElementById("form4");
    form.reset();

    var plan_group_str = ""; //create new var as string

    console.log(plan_group);

    if (Object.keys(plan_group).length && typeof plan_group !== "undefined") {
      plan_group_str += plan_group.label; //append in the groups as string to send it back to database

      console.log(plan_group.label);

      //setPlan_group(plan_group_str);
    } else {
      plan_group_str = "";
    }

    //console.log(Task_Id, Task_Name, Task_Description, Task_Notes, Task_Plan);

    const response = await axios.post("http://localhost:3001/Apps2", {
      App_Name: app_name
    });
    //console.log(app_name);
    //console.log(response.data[0].App_Name);

    var App_Name = response.data[0].App_Name;
    var App_Rnumber = response.data[0].App_Rnumber;

    console.log(plan_group_str);

    // var task_creation = "";
    // if (Task_Notes) {
    //   task_creation.append("Task" + " " + Task_Name + " " + " was created by" + " " + sessionStorage.getItem("Username") + " " + "on" + " " + new Date().toLocaleString() + " " + "with" + " " + "Task Notes added:" + " " + Task_Notes);
    // } else {
    //   task_creation.append("Task" + " " + Task_Name + " " + " was created by" + " " + sessionStorage.getItem("Username") + " " + "on" + " " + new Date().toLocaleString());
    // }

    // console.log(task_creation);

    try {
      await axios.post("http://localhost:3001/CreateNewTask", {
        App_Name: App_Name,
        App_Rnumber: App_Rnumber,
        Task_Name: Task_Name,
        Task_Description: Task_Description,
        Task_Notes: "Task" + " " + Task_Name + " " + " was created by" + " " + sessionStorage.getItem("Username") + " " + "on" + " " + new Date().toLocaleString() + " " + "with" + " " + "Task Notes added:" + " " + Task_Notes,
        //Task_Notes: task_creation,
        Task_Plan: plan_group_str,
        Task_App_Acronym: app_name,
        Task_Owner: sessionStorage.getItem("Username"),
        Task_Creator: sessionStorage.getItem("Username")
      });
      //setMsg("New Task Created.");
      toast.success("New Task Created");
      form.reset();
      setSubmit(true);
      setTask_Name("");
      setTask_Description("");
      setTask_Notes("");
      setTask_Plan("");
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        //setMsg(error.response.data.msg);
        toast.error(error.response.data.msg);
      }
    }
  };

  //EDIT PLAN FUNCTION

  const updatePlan = async e => {
    e.preventDefault();
    const form = document.getElementById("form1");
    //form.reset();
    //console.log(Plan_Name);

    try {
      await axios.post("http://localhost:3001/UpdatePlan", {
        Plan_Name: Plan_Name,
        // Plan_Notes: Plan_Notes,
        // Plan_Description: Plan_Description,
        Plan_Start_Date: Plan_Start_Date,
        Plan_End_Date: Plan_End_Date
        //Add_Task: Add_Task
      });
      //setMsg("Plan information updated.");
      toast.success("Plan information updated.");
      setSubmit(true);
      // setUsergroup([]);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        //setMsg(error.response.data.msg);
        toast.error(error.response.data.msg);
      }
    }
  };

  //EDIT TASK FUNCTION

  const updateTask = async e => {
    e.preventDefault();
    const form = document.getElementById("form3");
    //form.reset();

    var plan_group_str = ""; //create new var as string

    console.log(plan_group);
    console.log(typeof plan_group.label);

    if (plan_group && typeof plan_group !== "undefined") {
      plan_group_str += plan_group.label;
    }
    //append in the groups as string to send it back to database

    // console.log(plan_group_str);
    // console.log(app_name);

    console.log(plan_group_str);

    try {
      var res = await axios.post("http://localhost:3001/GetPlan", {
        Plan_App_Acronym: app_name,
        Plan_Name: plan_group_str
      });

      console.log("asd", Object.keys(res.data).length);

      if (Object.keys(res.data).length) {
        var plan_color = res.data[0].Plan_Color;
        var plan_group_str = "";
        console.log("reached");
      } else {
        plan_color = "";

        console.log("nothing");
      }

      console.log(res.data);
      // setUsergroup([]);
      // setColor(res.data[0].Plan_Color);

      console.log(app_name);
      console.log(Task_Name);

      var get_taskid = await axios.post("http://localhost:3001/GetTaskId", {
        Task_App_Acronym: app_name,
        Task_Name: Task_Name
      });

      console.log(get_taskid.data[0].Task_Id);

      console.log(app_name);
      console.log(Task_Name);
      console.log(Task_Notes);

      if (Task_Notes) {
        var edit_task_info = "Task" + " " + Task_Name + " " + "was updated by" + " " + Task_Owner + " " + "at the" + " " + Task_State + " " + "State" + " " + "on" + " " + Task_Create_Date + " " + "with" + " " + "Task Notes added:" + " " + Task_Notes;
      } else {
        console.log("reached");
        edit_task_info = "";
      }

      // if (Task_Notes) {
      //   edit_task_info.append("Task" + " " + Task_Name + " " + "was updated by" + " " + Task_Owner + " " + "at the" + " " + Task_State + " " + "State" + " " + "on" + " " + Task_Create_Date + " " + "with" + " " + "Task Notes added:" + " " + Task_Notes);
      // }

      await axios.post("http://localhost:3001/UpdateTask", {
        Task_Id: get_taskid.data[0].Task_Id,
        Task_Notes: edit_task_info,
        Task_Description: Task_Description,
        Task_Owner: Task_Owner,
        Task_State: Task_State,
        Task_Create_Date: Task_Create_Date,
        Task_Plan: plan_group_str,
        Task_Plan_Color: plan_color
      });

      //console.log(Task_Id);

      //setTask_Notes(Task_Notes.append(Task_Notes));

      //setAudit_Trail("Task notes:" + " " + Task_Notes + ", " + "Logon Userid is:" + " " + Task_Owner + ", " + "Task State is:" + " " + Task_State + ", " + "Task Updated on:" + " " + Task_Create_Date);

      //setMsg("Plan information updated.");
      //console.log(Task_Notes);

      toast.success("Task information updated.");
      setSubmit(true);
      setTask_Notes("");
      // setUsergroup([]);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        //setMsg(error.response.data.msg);
      }
    }

    // console.log(res);
    // console.log(res.data[0].Plan_Color);
    // console.log(color);

    // console.log(Task_Id);
    // console.log(Task_Notes);
  };

  //PROMOTE FUNCTION
  async function Createplan() {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = "Project Manager";

    username = sessionStorage.getItem("Username");

    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      setCreate_Plan(true);
    }
    // console.log(Create_Plan);
  }
  //Createplan();

  async function State_Create() {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Create;

    username = sessionStorage.getItem("Username");

    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      setUser_state_perm_create(true);
    }
  }
  //State_Create();
  //console.log(user_state_perm_create);

  async function State_Open() {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Open;

    username = sessionStorage.getItem("Username");

    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      setUser_state_perm_open(true);
    }
    //console.log(user_state_perm_open);
  }
  //State_Open();

  async function State_Todo() {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Todolist;

    username = sessionStorage.getItem("Username");

    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      setUser_state_perm_todo(true);
    }
    //console.log(user_state_perm_todo);
  }
  //State_Todo();

  async function State_Doing() {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Doing;

    username = sessionStorage.getItem("Username");

    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      setUser_state_perm_doing(true);
    }
    //console.log(user_state_perm_todo);
  }
  //State_Doing();

  async function State_Done() {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Done;

    username = sessionStorage.getItem("Username");

    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    console.log(checkgroup);
    if (checkgroup.data === true) {
      setUser_state_perm_done(true);
    }
    //console.log(user_state_perm_done);
  }
  //State_Done();

  async function PromoteOpen(task) {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });
    // console.log(app_data.data[0].App_Permit_Open);

    var groupname = app_data.data[0].App_Permit_Open;
    var username = sessionStorage.getItem("Username");
    //console.log(username);
    var user_state_perm_open = "";
    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      user_state_perm_open = true;
    }
    try {
      axios.post("http://localhost:3001/PromoteTask", {
        Task_Id: task.Task_Id,
        Task_State: task.Task_State,
        user_group: user_state_perm_open,
        Task_Owner: username,
        Task_Notes: "Task" + " " + task.Task_Name + " " + "was promoted from 'Open' to 'To Do' state by" + " " + username + " " + "on" + " " + new Date().toLocaleString()
      });
      //setMsg("New Application Created.");
      toast.success("Task Promoted.");
      console.log(Task_Owner);
      setSubmit(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  }

  async function PromoteToDo(task) {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Todolist;
    var username = sessionStorage.getItem("Username");
    //console.log(username);
    var user_state_perm_todo = "";
    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    console.log(task.Task_Id);
    if (checkgroup.data === true) {
      user_state_perm_todo = true;
    }

    try {
      axios.post("http://localhost:3001/PromoteTask", {
        Task_Id: task.Task_Id,
        Task_State: task.Task_State,
        user_group: user_state_perm_todo,
        Task_Owner: username,
        Task_Notes: "Task" + " " + task.Task_Name + " " + "was promoted from 'To Do' to 'Doing' state by" + " " + username + " " + "on" + " " + new Date().toLocaleString()
      });
      //setMsg("New Application Created.");
      toast.success("Task Promoted.");
      setSubmit(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  }

  async function PromoteDone(task) {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Done;
    var username = sessionStorage.getItem("Username");
    //console.log(username);
    var user_state_perm_done = "";
    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      user_state_perm_done = true;
    }
    try {
      axios.post("http://localhost:3001/PromoteTask", {
        Task_Id: task.Task_Id,
        Task_State: task.Task_State,
        user_group: user_state_perm_done,
        Task_Owner: username,
        Task_Notes: "Task" + " " + task.Task_Name + " " + "was promoted from 'Done' to 'Close' state by" + " " + username + " " + "on" + " " + new Date().toLocaleString()
      });
      //setMsg("New Application Created.");
      toast.success("Task Promoted.");
      setSubmit(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  }

  async function PromoteDoing(task) {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Doing;
    var username = sessionStorage.getItem("Username");
    //console.log(username);
    var user_state_perm_doing = "";
    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      user_state_perm_doing = true;
    }
    try {
      axios.post("http://localhost:3001/PromoteTask", {
        Task_Id: task.Task_Id,
        Task_State: task.Task_State,
        user_group: user_state_perm_doing,
        Task_Owner: username,
        Task_Notes: "Task" + " " + task.Task_Name + " " + "was promoted from 'Doing' to 'Done' state by" + " " + username + " " + "on" + " " + new Date().toLocaleString()
      });
      //setMsg("New Application Created.");
      toast.success("Task Promoted.");
      setSubmit(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  }

  //DEMOTE FUNCTION
  async function DemoteDoing(task) {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Doing;
    var username = sessionStorage.getItem("Username");
    //console.log(username);
    var user_state_perm_doing = "";
    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      user_state_perm_doing = true;
    }
    try {
      axios.post("http://localhost:3001/DemoteTask", {
        Task_Id: task.Task_Id,
        Task_State: task.Task_State,
        user_group: user_state_perm_doing,
        Task_Owner: username,
        Task_Notes: "Task" + " " + task.Task_Name + " " + "was demoted from 'Doing' to 'To Do' state by" + " " + username + " " + "on" + " " + new Date().toLocaleString()
      });
      //setMsg("New Application Created.");
      toast.success("Task Demoted.");
      setSubmit(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  }

  async function DemoteDone(task) {
    var App_Name = app_name;
    var app_data = await axios.post("http://localhost:3001/Apps2", { App_Name });

    var groupname = app_data.data[0].App_Permit_Done;
    var username = sessionStorage.getItem("Username");
    //console.log(username);
    var user_state_perm_done = "";
    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });
    //console.log(checkgroup);
    if (checkgroup.data === true) {
      user_state_perm_done = true;
    }
    try {
      axios.post("http://localhost:3001/DemoteTask", {
        Task_Id: task.Task_Id,
        Task_State: task.Task_State,
        user_group: user_state_perm_done,
        Task_Owner: username,
        Task_Notes: "Task" + " " + task.Task_Name + " " + "was demoted from 'Done' to 'Doing' state by" + " " + username + " " + "on" + " " + new Date().toLocaleString()
      });
      //setMsg("New Application Created.");
      toast.success("Task Demoted.");
      setSubmit(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  }

  const getAllTaskByState = async () => {
    let AppName = app_name;
    let openList = [];
    let todoList = [];
    let doingList = [];
    let doneList = [];
    let closeList = [];

    const openTask = {
      Task_App_Acronym: AppName,
      Task_State: "Open"
    };
    const todoTask = {
      Task_App_Acronym: AppName,
      Task_State: "ToDo"
    };
    const doingTask = {
      Task_App_Acronym: AppName,
      Task_State: "Doing"
    };
    const doneTask = {
      Task_App_Acronym: AppName,
      Task_State: "Done"
    };
    const closeTask = {
      Task_App_Acronym: AppName,
      Task_State: "Close"
    };

    try {
      const response = await axios.post("http://localhost:3001/getAllTaskByOpen", {
        ...openTask
      });
      //console.log("openlist success");
      //console.log(response.data);
      if (response.data.length) {
        openList = { name: "Open", task: response.data };
      } else {
        openList = { name: "Open", task: [] };
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }

    try {
      const response = await axios.post("http://localhost:3001/getAllTaskByToDo", {
        ...todoTask
      });
      //console.log("todolist success");
      //console.log(response.data);
      if (response.data.length) {
        todoList = { name: "ToDo", task: response.data };
      } else {
        todoList = { name: "ToDo", task: [] };
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }

    try {
      const response = await axios.post("http://localhost:3001/getAllTaskByDoing", {
        ...doingTask
      });
      //console.log("doinglist success");
      //console.log(response.data);
      if (response.data.length) {
        doingList = { name: "Doing", task: response.data };
      } else {
        doingList = { name: "Doing", task: [] };
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }

    try {
      const response = await axios.post("http://localhost:3001/getAllTaskByDone", {
        ...doneTask
      });
      //console.log("donelist success");
      //console.log(response.data);
      if (response.data.length) {
        doneList = { name: "Done", task: response.data };
      } else {
        doneList = { name: "Done", task: [] };
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }

    try {
      const response = await axios.post("http://localhost:3001/getAllTaskByClose", {
        ...closeTask
      });
      //console.log("closelist success");
      //console.log(response.data);
      if (response.data.length) {
        closeList = { name: "Close", task: response.data };
      } else {
        closeList = { name: "Close", task: [] };
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
    setTaskList([openList, todoList, doingList, doneList, closeList]);
  };

  // function Verify() {
  //   var UserSession = sessionStorage.getItem("Username");
  //   if (user == UserSession) {
  return (
    <div>
      <div className="columns">
        <div className="column is-four-fifths">
          <table className="table is-striped is-fullwidth mx-1">
            <thead>Application Name: {app_name}</thead>
            <span>
              <tbody>
                <Grid container spacing={3.5} wrap="nowrap">
                  <Grid item xs={2.2} justifyContent="center">
                    <Paper sx={{ width: 175, minHeight: 400 }}>
                      <p>Open</p>
                      {taskList
                        .filter(taskList => taskList.name == "Open")
                        .map(result => {
                          return result.task.map(task => {
                            return (
                              <Box sx={{ height: 185, width: 175 }}>
                                <Card elevation={4} sx={{ minwidth: 100 }} style={{ borderTop: `10px solid ${task.Task_Plan_Color}` }}>
                                  <CardHeader
                                    sx={{
                                      display: "flex",
                                      overflow: "hidden",
                                      "& .MuiCardHeader-content": {
                                        overflow: "hidden"
                                      }
                                    }}
                                    // action={
                                    //   <IconButton
                                    //     aria-label="settings"
                                    //     onClick={() => {
                                    //       EditTask(task);
                                    //     }}
                                    //     id="edittask"
                                    //   >
                                    //     <MoreVertIcon />
                                    //   </IconButton>
                                    // }
                                    title={task.Task_Name}
                                  />
                                  <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                      <p>
                                        <h1> Task Id: {task.Task_Id} </h1>
                                        <h1> Task Owner: {task.Task_Owner} </h1>

                                        {user_state_perm_open ? (
                                          <button
                                            class="button is-small is-primary is-outlined is-link"
                                            onClick={() => {
                                              PromoteOpen(task);
                                            }}
                                            id="editplan"
                                            type="submit"
                                          >
                                            {">"}
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {!user_state_perm_open ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              ViewTask(task);
                                            }}
                                            id="viewtask"
                                          >
                                            View Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {user_state_perm_open ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              EditTask(task);
                                            }}
                                            id="edittask"
                                          >
                                            Edit Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                      </p>
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Box>
                            );
                          });
                        })}
                    </Paper>
                  </Grid>

                  <Grid item xs={2.2}>
                    <Paper sx={{ width: 175, minHeight: 400 }}>
                      <p>To Do</p>

                      {taskList
                        .filter(taskList => taskList.name == "ToDo")
                        .map(result => {
                          return result.task.map(task => {
                            return (
                              <Card elevation={4} sx={{ minwidth: 100 }} style={{ borderTop: `10px solid ${task.Task_Plan_Color}` }}>
                                <CardHeader
                                  sx={{
                                    display: "flex",
                                    overflow: "hidden",
                                    "& .MuiCardHeader-content": {
                                      overflow: "hidden"
                                    }
                                  }}
                                  // action={
                                  //   <IconButton
                                  //     aria-label="settings"
                                  //     onClick={() => {
                                  //       EditTask(task);
                                  //     }}
                                  //     id="edittask"
                                  //   >
                                  //     <MoreVertIcon />
                                  //   </IconButton>
                                  // }
                                  title={task.Task_Name}
                                />
                                <CardContent>
                                  <Typography variant="subtitle2" color="textSecondary">
                                    <p>
                                      <h1> Task Id: {task.Task_Id} </h1>
                                      <h1> Task Owner: {task.Task_Owner} </h1>
                                      <div>
                                        {user_state_perm_todo ? (
                                          <button
                                            class="button is-small is-primary is-outlined is-link"
                                            onClick={() => {
                                              PromoteToDo(task);
                                            }}
                                            id="editplan"
                                          >
                                            {">"}
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {!user_state_perm_todo ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              ViewTask(task);
                                            }}
                                            id="viewtask"
                                          >
                                            View Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {user_state_perm_todo ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              EditTask(task);
                                            }}
                                            id="edittask"
                                          >
                                            Edit Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </p>
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          });
                        })}
                    </Paper>
                  </Grid>

                  <Grid item xs={2.2}>
                    <Paper sx={{ width: 175, minHeight: 400 }}>
                      <p>Doing</p>
                      {taskList
                        .filter(taskList => taskList.name == "Doing")
                        .map(result => {
                          return result.task.map(task => {
                            return (
                              <Card elevation={4} sx={{ minwidth: 100 }} style={{ borderTop: `10px solid ${task.Task_Plan_Color}` }}>
                                <CardHeader
                                  sx={{
                                    display: "flex",
                                    overflow: "hidden",
                                    "& .MuiCardHeader-content": {
                                      overflow: "hidden"
                                    }
                                  }}
                                  // action={
                                  //   <IconButton
                                  //     aria-label="settings"
                                  //     onClick={() => {
                                  //       EditTask(task);
                                  //     }}
                                  //     id="edittask"
                                  //   >
                                  //     <MoreVertIcon />
                                  //   </IconButton>
                                  // }
                                  title={task.Task_Name}
                                />
                                <CardContent>
                                  <Typography variant="subtitle2" color="textSecondary">
                                    <p>
                                      <h1> Task Id: {task.Task_Id} </h1>
                                      <h1> Task Owner: {task.Task_Owner} </h1>
                                      <div>
                                        {user_state_perm_doing ? (
                                          <button
                                            class="button is-small is-primary is-outlined is-link"
                                            onClick={() => {
                                              DemoteDoing(task);
                                            }}
                                            id="editplan"
                                            type="submit"
                                          >
                                            {"<"}
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {user_state_perm_doing ? (
                                          <button
                                            class="button is-small is-primary is-outlined is-link"
                                            onClick={() => {
                                              PromoteDoing(task);
                                            }}
                                            id="editplan"
                                            type="submit"
                                          >
                                            {">"}
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {!user_state_perm_doing ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              ViewTask(task);
                                            }}
                                            id="viewtask"
                                          >
                                            View Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {user_state_perm_doing ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              EditTask(task);
                                            }}
                                            id="edittask"
                                          >
                                            Edit Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </p>
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          });
                        })}
                    </Paper>
                  </Grid>

                  <Grid item xs={2.2}>
                    <Paper sx={{ width: 175, minHeight: 400 }}>
                      <p>Done</p>
                      {taskList
                        .filter(taskList => taskList.name == "Done")
                        .map(result => {
                          return result.task.map(task => {
                            return (
                              <Card elevation={4} sx={{ minwidth: 100 }} style={{ borderTop: `10px solid ${task.Task_Plan_Color}` }}>
                                <CardHeader
                                  sx={{
                                    display: "flex",
                                    overflow: "hidden",
                                    "& .MuiCardHeader-content": {
                                      overflow: "hidden"
                                    }
                                  }}
                                  // action={
                                  //   <IconButton
                                  //     aria-label="settings"
                                  //     onClick={() => {
                                  //       EditTask(task);
                                  //     }}
                                  //     id="edittask"
                                  //   >
                                  //     <MoreVertIcon />
                                  //   </IconButton>
                                  // }
                                  title={task.Task_Name}
                                />
                                <CardContent>
                                  <Typography variant="subtitle2" color="textSecondary">
                                    <p>
                                      <h1> Task Id: {task.Task_Id} </h1>
                                      <h1> Task Owner: {task.Task_Owner} </h1>
                                      <div>
                                        {user_state_perm_done ? (
                                          <button
                                            class="button is-small is-primary is-outlined is-link"
                                            onClick={() => {
                                              DemoteDone(task);
                                            }}
                                            id="editplan"
                                            type="submit"
                                          >
                                            {"<"}
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {user_state_perm_done ? (
                                          <button
                                            class="button is-small is-primary is-outlined is-link"
                                            onClick={() => {
                                              PromoteDone(task);
                                            }}
                                            id="editplan"
                                            type="submit"
                                          >
                                            {">"}
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {!user_state_perm_done ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              ViewTask(task);
                                            }}
                                            id="viewtask"
                                          >
                                            View Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                        {user_state_perm_done ? (
                                          <button
                                            class="button is-small is-info "
                                            onClick={() => {
                                              EditTask(task);
                                            }}
                                            id="edittask"
                                          >
                                            Edit Task
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </p>
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          });
                        })}
                    </Paper>
                  </Grid>

                  <Grid item xs={2.2}>
                    <Paper sx={{ width: 175, minHeight: 400 }}>
                      <p>Close</p>
                      {taskList
                        .filter(taskList => taskList.name == "Close")
                        .map(result => {
                          return result.task.map(task => {
                            return (
                              <Card elevation={4} sx={{ minwidth: 100 }} style={{ borderTop: `10px solid ${task.Task_Plan_Color}` }}>
                                <CardHeader
                                  sx={{
                                    display: "flex",
                                    overflow: "hidden",
                                    "& .MuiCardHeader-content": {
                                      overflow: "hidden"
                                    }
                                  }}
                                  // action={
                                  //   <IconButton
                                  //     aria-label="settings"
                                  //     onClick={() => {
                                  //       EditTaskClose(task);
                                  //     }}
                                  //     id="edittask"
                                  //   >
                                  //     <MoreVertIcon />
                                  //   </IconButton>
                                  // }
                                  title={task.Task_Name}
                                />
                                <CardContent>
                                  <Typography variant="subtitle2" color="textSecondary">
                                    <p>
                                      <h1> Task Id: {task.Task_Id} </h1>
                                      <h1> Task Owner: {task.Task_Owner} </h1>
                                      <div>
                                        <button
                                          class="button is-small is-info "
                                          onClick={() => {
                                            ViewTask(task);
                                          }}
                                          id="viewtask"
                                        >
                                          View Task
                                        </button>
                                      </div>
                                    </p>
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          });
                        })}
                    </Paper>
                  </Grid>
                </Grid>
              </tbody>
            </span>
          </table>
        </div>

        <div className="column is-one-fifth">
          <table className="table is-striped is-narrow is-fullwidth mx-1">
            <thead>
              <div>
                {/* CREATE PLAN MODAL */}
                <div>
                  {Create_Plan ? (
                    <button className="button is-small is-rounded is-link " id="createplan">
                      Create Plan
                    </button>
                  ) : (
                    <></>
                  )}
                </div>

                {/* CREATE TASK MODAL */}
                <div>
                  {user_state_perm_create ? (
                    <button className="button is-small is-rounded is-link " id="createtask">
                      Create New Task
                    </button>
                  ) : (
                    <></>
                  )}
                </div>

                {/* EDIT PLAN MODAL */}
                <tbody>
                  <label>Plan Names</label>
                  {plans.map((plan, index) => (
                    <div>
                      <tr>
                        <td style={{ backgroundColor: `${plan.Plan_Color}` }}></td>

                        <h1>{plan.Plan_Name}</h1>
                        {/* <LinesEllipsis text={plan.Plan_Name} basedOn="letters" ellipsis={<span style={{ color: "black" }}>...</span>} style={{ "overflow-wrap": "break-word", "white-space": "pre-wrap" }} /> */}
                        {Create_Plan ? (
                          <button
                            class="button is-small is-rounded is-link "
                            onClick={() => {
                              EditPlan(plan);
                            }}
                            id="editplan"
                          >
                            Edit Plan
                          </button>
                        ) : (
                          <></>
                        )}
                      </tr>
                    </div>
                  ))}
                </tbody>
              </div>
            </thead>
          </table>
        </div>
      </div>

      {/* EDIT PLAN MODAL */}
      <div className="modal" id="modal">
        <div className="modal-background" id="modal-bg"></div>
        <div className="modal-content has-background-white py-5 px-5">
          <div className="title is-4">Edit Plan</div>
          <form onSubmit={updatePlan} className="box" id="form1">
            {/* <p className="has-text-danger">{msg}</p> */}

            <div className="field mt-3">
              <label className="label">Plan Name</label>
              <div className="controls">
                <input type="text" className="input" value={Plan_Name} disabled onChange={e => setPlan_Name(e.target.value)} />
              </div>
            </div>

            {/* <div className="field mt-3">
              <label className="label">Plan Notes</label>
              <div className="controls">
                <input type="text" className="input" value={Plan_Notes} onChange={e => setPlan_Notes(e.target.value)} />
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Plan Description</label>
              <div className="controls">
                <textarea type="textarea" className="input" value={Plan_Description} onChange={e => setPlan_Description(e.target.value)}></textarea>
              </div>
            </div> */}

            <div className="field">
              <h1 className="label">Start Date</h1>
              <DateTimePicker onChange={setPlan_Start_Date} value={Plan_Start_Date} />
            </div>

            <div className="field">
              <h1 className="label">End Date</h1>
              <DateTimePicker onChange={setPlan_End_Date} value={Plan_End_Date} />
            </div>

            <div className="mt-5 has-text-centered">
              <button type="submit" className="button is-success is-fullwidth">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* VIEW TASK MODAL (VIEW ONLY) */}
      <div className="modal" id="modal5">
        <div className="modal-background" id="modal-bg5"></div>
        <div className="modal-content has-background-white py-5 px-5">
          <div className="title is-4">View Task : {Task_Name}</div>
          <form className="box" id="form3">
            <div className="field mt-3">
              <label className="label">Task Notes</label>
              <div className="controls">
                <textarea type="textarea" className="input" disabled onChange={e => setTask_Notes(e.target.value)}></textarea>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Task Description</label>
              <div className="controls">
                <textarea type="textarea" className="input" disabled value={Task_Description} onChange={e => setTask_Description(e.target.value)}></textarea>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Change Plan</label>
              <div className="control">
                <input type="text" className="input" value={plan_group} disabled onChange={handleChangePlan} />
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Audit Trail</label>
              <div className="controls">
                <textarea type="textarea" className="input" value={Audit_Trail} disabled onChange={e => setAudit_Trail(e.target.value)}></textarea>
              </div>
            </div>

            <div className="mt-5 has-text-centered"></div>
          </form>
        </div>
      </div>

      {/* EDIT TASK MODAL */}
      <div className="modal" id="modal2">
        <div className="modal-background" id="modal-bg2"></div>
        <div className="modal-content has-background-white py-5 px-5">
          <div className="title is-4">Edit Task : {Task_Name}</div>
          <form
            onSubmit={updateTask}
            // onSubmit={e => {
            //   e.preventDefault();
            //   e.stopPropagation();
            //   updateTask();
            // }}
            className="box"
            id="form3"
          >
            {/* <p className="has-text-danger">{msg}</p> */}

            <div className="field mt-3">
              <label className="label">Task Notes</label>
              <div className="controls">
                <textarea type="textarea" className="input" value={Task_Notes} onChange={e => setTask_Notes(e.target.value)}></textarea>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Task Description</label>
              <div className="controls">{user_state_perm_doing ? <textarea type="textarea" className="input" value={Task_Description} disabled onChange={e => setTask_Description(e.target.value)}></textarea> : <textarea type="textarea" className="input" value={Task_Description} onChange={e => setTask_Description(e.target.value)}></textarea>}</div>
            </div>

            <div className="field mt-3">
              <label className="label">Plan</label>
              <div className="control">{user_state_perm_doing ? <Select value={plan_group} options={plan_name_db} isDisabled={true} onChange={handleChangePlan}></Select> : <Select value={plan_group} options={plan_name_db} onChange={handleChangePlan}></Select>}</div>
            </div>

            <div className="field mt-3">
              <label className="label">Audit Trail</label>
              <div className="controls">
                <textarea type="textarea" className="input" value={Audit_Trail} disabled onChange={e => setAudit_Trail(e.target.value)}></textarea>
              </div>
            </div>

            <div className="mt-5 has-text-centered">
              <button type="submit" className="button is-success is-fullwidth">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* EDIT TASK MODAL FOR CLOSE STATE */}
      <div className="modal" id="modal3">
        <div className="modal-background" id="modal-bg3"></div>
        <div className="modal-content has-background-white py-5 px-5">
          <div className="title is-4">Edit Task : {Task_Name}</div>
          <form
            onSubmit={updateTask}
            // onSubmit={e => {
            //   updateTask();
            //   e.preventDefault();
            //   e.stopPropagation();
            // }}
            className="box"
            id="form3"
          >
            {/* <p className="has-text-danger">{msg}</p> */}

            <div className="field mt-3">
              <label className="label">Task Notes</label>
              <div className="controls">
                <textarea type="textarea" className="input" disabled onChange={e => setTask_Notes(e.target.value)}></textarea>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Task Description</label>
              <div className="controls">
                <textarea type="textarea" className="input" disabled value={Task_Description} onChange={e => setTask_Description(e.target.value)}></textarea>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Audit Trail</label>
              <div className="controls">
                <textarea type="textarea" className="input" value={Audit_Trail} disabled onChange={e => setAudit_Trail(e.target.value)}></textarea>
              </div>
            </div>

            <div className="mt-5 has-text-centered">
              <button type="submit" className="button is-success is-fullwidth">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CREATE NEW PLAN MODAL */}
      <div className="modal" id="modal1">
        <div className="modal-background" id="modal-bg1"></div>
        <div className="modal-content has-background-white py-5 px-5">
          <div className="title is-5">Create New Plan</div>
          <form onSubmit={CreatePlan} className="box" id="form2">
            {/* <p className="has-text-danger">{msg}</p> */}
            <div className="field">
              <h2 className="label">Enter Plan Name</h2>
              <div className="control">
                <input type="text" className="input" placeholder="Plan Name" required onChange={e => setPlan_Name(e.target.value)} />
              </div>
            </div>
            {/* <div className="field">
              <h2 className="label">Enter Plan Notes</h2>
              <div className="control">
                <input type="text" className="input" placeholder="Plan Notes" required onChange={e => setPlan_Notes(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <h2 className="label">Plan Description</h2>
              <div className="control">
                <textarea className="textarea" placeholder="Plan Description" onChange={e => setPlan_Description(e.target.value)}></textarea>
              </div>
            </div> */}
            <div className="field">
              <h1 className="label">Start Date</h1>
              <DateTimePicker onChange={setPlan_Start_Date} value={Plan_Start_Date} />
            </div>
            <div className="field">
              <h1 className="label">End Date</h1>
              <DateTimePicker onChange={setPlan_End_Date} value={Plan_End_Date} />
            </div>
            {/* <div className="field mt-3">
                <label className="label">Add Existing Task</label>
                <div className="control">
                  <Select value={user_group} isMulti options={user_group_db1} onChange={handleChange}></Select>
                </div>
              </div> */}

            <div className="field">
              <h1 className="label">Select color</h1>
              <HexColorPicker color={color} onChange={setColor} />
            </div>
            <div className="mt-6 has-text-centered">
              <button type="submit" className="button is-success is-fullwidth">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CREATE NEW TASK MODAL */}

      <div className="modal" id="modal4">
        <div className="modal-background" id="modal-bg4"></div>
        <div className="centered-div">
          <div className="column is-4-desktop">
            <div className="modal-content has-background-white py-5 px-5">
              <div className="title is-5">Create New Task</div>
              <form onSubmit={CreateTask} className="box" id="form4">
                {/* <p className="has-text-danger">{msg}</p> */}

                <div className="field mt-3">
                  <label className="label">Task Name</label>
                  <div className="controls">
                    <input type="text" className="input" placeholder="Task Name" required onChange={e => setTask_Name(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-3">
                  <label className="label">Task Notes</label>
                  <div className="controls">
                    <textarea className="textarea" placeholder="Task Notes" onChange={e => setTask_Notes(e.target.value)}></textarea>
                  </div>
                </div>
                <div className="field mt-3">
                  <label className="label">Task Description</label>
                  <div className="controls">
                    <textarea className="textarea" placeholder="Task Description" onChange={e => setTask_Description(e.target.value)}></textarea>
                  </div>
                </div>
                <div className="field mt-3">
                  <label className="label">Assign Plan</label>
                  <div className="control">
                    <Select value={plan_group} options={plan_name_db} onChange={handleChangePlan}></Select>
                  </div>
                </div>
                {/* <div className="field mt-3">
                  <label className="label">Audit Trail</label>
                  <div className="controls">
                    <input type="password" className="textarea" placeholder="Audit Trail" onChange={e => setAudit_trail(e.target.value)} />
                  </div>
                </div> */}

                <div className="mt-5 has-text-centered">
                  <button type="submit" className="button is-success is-fullwidth">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer draggable="true" position="top-center" autoClose={1000} />
    </div>
  );

  //   } else {
  //     navigate(`Home/${username}`);
  //   }
  // }

  // return Verify();
};

export default Board;

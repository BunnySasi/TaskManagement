import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateTimePicker from "react-datetime-picker";

const Applications = () => {
  var [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();
  const [usergroup, setUsergroup] = useState("");
  const [plan_group, setPlan_group] = useState("");
  const [user_group, setUser_group] = useState([]);
  const [user_group_Create, setUser_group_Create] = useState("");
  const [user_group_Open, setUser_group_Open] = useState("");
  const [user_group_ToDo, setUser_group_ToDo] = useState("");
  const [user_group_Doing, setUser_group_Doing] = useState("");
  const [user_group_Done, setUser_group_Done] = useState("");
  const [user_group_db, setUser_group_db] = useState([]);
  const [user_group_db1, setUser_group_db1] = useState([]);
  const [plan_name_db, setPlan_name_db] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("1");
  const [submit, setSubmit] = useState("");
  const user = useParams().user;
  const app = useParams().app;
  const [admin, setAdmin] = useState(false);

  const [App_Name, setApp_Name] = useState("");
  const [App_Description, setApp_Description] = useState("");
  const [App_Rnumber, setApp_Rnumber] = useState([]);
  const [App_Start_Date, setApp_Start_Date] = useState(new Date());
  const [App_End_Date, setApp_End_Date] = useState(new Date());
  const [App_Permit_Create, setApp_Permit_Create] = useState("");
  const [App_Permit_Open, setApp_Permit_Open] = useState("");
  const [App_Permit_Todolist, setApp_Permit_Todolist] = useState("");
  const [App_Permit_Doing, setApp_Permit_Doing] = useState("");
  const [App_Permit_Done, setApp_Permit_Done] = useState("");
  const [Task_Id, setTask_Id] = useState("");
  const [Task_Name, setTask_Name] = useState("");
  const [Task_Description, setTask_Description] = useState("");
  const [Task_Notes, setTask_Notes] = useState("");
  const [Task_Plan, setTask_Plan] = useState("");
  const [permit_app_create, setPermit_app_create] = useState(false);

  useEffect(() => {
    setSubmit(false);
    refreshToken();
    getApps();
  }, [submit]);

  useEffect(() => {
    //get_groupslist();
    // get_planlist();
    getApps();
    refreshToken();
    //App_Create();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:3001/token", {
        username: user
      });
      //console.log(response);
      if (response.data == true) {
        console.log("refreshtoken complete");
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

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async config => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:3001/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setUsername(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  const getApps = async () => {
    const response = await axiosJWT.get("http://localhost:3001/GetApps", {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    });
    console.log(response);
    setApps(response.data);
    //console.log(response.data);
  };

  // EDIT APP MODAL
  const editmodalOpen = document.querySelector("#modal");
  const modalBg = document.querySelector("#modal-bg");

  function EditApp(app) {
    //console.log(app.App_Permit_Create);
    editmodalOpen.classList.add("is-active");
    if (modalBg) {
      modalBg.addEventListener("click", () => editmodalOpen.classList.remove("is-active"));
    }

    var app_name_arr = []; //create new var array
    app_name_arr.push({ value: app.App_Name, label: app.App_Name });
    var app_description_arr = []; //create new var array
    app_description_arr.push({ value: app.App_Description, label: app.App_Description });
    var app_rnumber_arr = []; //create new var array
    app_rnumber_arr.push({ value: app.App_Rnumber, label: app.App_Rnumber });

    var app_start_date_arr = []; //create new var array
    app_start_date_arr.push({ value: app.App_Start_Date, label: app.App_Start_Date });
    //console.log(app_start_date_arr);
    var app_end_date_arr = []; //create new var array
    app_end_date_arr.push({ value: app.App_End_Date, label: app.App_End_Date });
    //console.log(app_end_date_arr);

    var user_group_create_arr = []; //create new var array
    user_group_create_arr.push({ value: app.App_Permit_Create, label: app.App_Permit_Create });
    var user_group_open_arr = []; //create new var array
    user_group_open_arr.push({ value: app.App_Permit_Open, label: app.App_Permit_Open });
    var user_group_todo_arr = []; //create new var array
    user_group_todo_arr.push({ value: app.App_Permit_Todolist, label: app.App_Permit_Todolist });
    var user_group_doing_arr = []; //create new var array
    user_group_doing_arr.push({ value: app.App_Permit_Doing, label: app.App_Permit_Doing });
    var user_group_done_arr = []; //create new var array
    user_group_done_arr.push({ value: app.App_Permit_Done, label: app.App_Permit_Done });

    console.log(app_start_date_arr[0]);

    setApp_Name(app_name_arr[0].label);
    setApp_Rnumber(app_rnumber_arr[0].label);
    setApp_Description(app_description_arr[0].label);
    setApp_Start_Date(app_start_date_arr[0].label);
    setApp_End_Date(app_end_date_arr[0].label);
    setUser_group_Create(user_group_create_arr);
    setUser_group_Open(user_group_open_arr);
    setUser_group_ToDo(user_group_todo_arr);
    setUser_group_Doing(user_group_doing_arr);
    setUser_group_Done(user_group_done_arr);
    get_groupslist();
  }

  // CREATE NEW APP MODAL
  const createappButton = document.querySelector("#createapp");
  const modalBg1 = document.querySelector("#modal-bg1");
  const modal1 = document.querySelector("#modal1");

  if (createappButton) {
    createappButton.addEventListener("click", () => {
      setApp_Start_Date("");
      setApp_End_Date("");
      setUser_group_Create([]);
      setUser_group_Open([]);
      setUser_group_ToDo([]);
      setUser_group_Doing([]);
      setUser_group_Done([]);
      modal1.classList.add("is-active");
    });
  }

  if (modalBg1) {
    modalBg1.addEventListener("click", () => {
      modal1.classList.remove("is-active");
      const form = document.getElementById("form2");
      form.reset();
      setUser_group_Create([]);
      setUser_group_Open([]);
      setUser_group_ToDo([]);
      setUser_group_Doing([]);
      setUser_group_Done([]);
    });
  }

  // CREATE NEW TASK MODAL

  const createtaskButton = document.querySelector("#createtask");
  const modalBg2 = document.querySelector("#modal-bg2");
  const modal2 = document.querySelector("#modal2");

  if (createtaskButton) {
    createtaskButton.addEventListener("click", () => {
      setTask_Id("");
      setTask_Name("");
      setTask_Notes("");
      setTask_Description("");
      modal2.classList.add("is-active");
    });
  }

  if (modalBg2) {
    modalBg2.addEventListener("click", () => {
      modal2.classList.remove("is-active");
      const form = document.getElementById("form3");
      form.reset();
      setTask_Id("");
      setTask_Name("");
      setTask_Notes("");
      setTask_Description("");
    });
  }

  //SELECT PLAN FUNCTION
  const handleChange = e => {
    console.log(e);
    setPlan_group(e); //updated to the latest plan selected
  };

  //MULTI SELECT USERGROUP FUNCTION

  const handleChangeCreate = e => {
    console.log(e);
    setUser_group_Create(e);
  };

  const handleChangeOpen = e => {
    console.log(e);
    setUser_group_Open(e); //updated to the latest usergroups selected
  };

  const handleChangeToDo = e => {
    console.log(e);
    setUser_group_ToDo(e); //updated to the latest usergroups selected
  };

  const handleChangeDoing = e => {
    console.log(e);
    setUser_group_Doing(e); //updated to the latest usergroups selected
  };

  const handleChangeDone = e => {
    console.log(e);
    setUser_group_Done(e); //updated to the latest usergroups selected
  };

  const get_groupslist = async () => {
    try {
      const response = await axios.get("http://localhost:3001/Users1", {}); //get all the diff groups in usergroup table
      var new_array = []; //create an array format to show on the app
      for (let i = 0; i < response.data.length; i++) {
        new_array.push({ value: response.data[i].user_group, label: response.data[i].user_group });
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

  // const get_planlist = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/GetPlanName", {}); //get all the diff taskID in the task table
  //     var new_array = []; //create an array format
  //     for (let i = 0; i < response.data.length; i++) {
  //       new_array.push({ value: response.data[i].Plan_Name, label: response.data[i].Plan_Name });
  //     }
  //     setPlan_name_db(new_array); //updated to latest usergroups and shown in multi-select option below

  //     //console.log(response.data);
  //   } catch (error) {
  //     if (error.response) {
  //       console.log(error.response);
  //       setMsg(error.response.data.msg);
  //     }
  //   }
  // };

  //EDIT APP FUNCTION

  const updateApp = async e => {
    e.preventDefault();
    const form = document.getElementById("form1");
    //form.reset();
    //console.log(user_group_Create); //user_group alr updated to the latest usergroups selected

    var user_group_create_str = "";
    var user_group_open_str = "";
    var user_group_ToDo_str = "";
    var user_group_Doing_str = "";
    var user_group_Done_str = "";

    if (user_group_Create && typeof user_group_Create !== "undefined") {
      user_group_create_str += user_group_Create.label;
    }

    if (user_group_Open && typeof user_group_Open !== "undefined") {
      user_group_open_str += user_group_Open.label;
    }

    if (user_group_ToDo && typeof user_group_ToDo !== "undefined") {
      user_group_ToDo_str += user_group_ToDo.label;
    }

    if (user_group_Doing && typeof user_group_Doing !== "undefined") {
      user_group_Doing_str += user_group_Doing.label;
    }

    if (user_group_Done && typeof user_group_Done !== "undefined") {
      user_group_Done_str += user_group_Done.label;
    }

    try {
      await axios.post("http://localhost:3001/UpdateApp", {
        App_Name: App_Name,
        App_Rnumber: App_Rnumber,
        App_Description: App_Description,
        App_Start_Date: App_Start_Date,
        App_End_Date: App_End_Date,
        App_Permit_Create: user_group_create_str,
        App_Permit_Open: user_group_open_str,
        App_Permit_Todolist: user_group_ToDo_str,
        App_Permit_Doing: user_group_Doing_str,
        App_Permit_Done: user_group_Done_str
      });
      //setMsg("User information updated.");
      toast.success("Application information updated.");
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

  //CREATE NEW APP FUNCTION
  const CreateApp = async e => {
    e.preventDefault();
    var form = document.getElementById("form2");
    form.reset();
    // console.log(JSON.stringify(user_group_Create.value));
    // console.log(typeof user_group_Create.label);

    var user_group_create_str = "";
    var user_group_open_str = "";
    var user_group_ToDo_str = "";
    var user_group_Doing_str = "";
    var user_group_Done_str = "";
    if (user_group_Create && typeof user_group_Create !== "undefined") {
      user_group_create_str += user_group_Create.label;
    }
    if (user_group_Open && typeof user_group_Open !== "undefined") {
      user_group_open_str += user_group_Open.label;
    }
    if (user_group_ToDo && typeof user_group_ToDo !== "undefined") {
      user_group_ToDo_str += user_group_ToDo.label;
    }
    if (user_group_Doing && typeof user_group_Doing !== "undefined") {
      user_group_Doing_str += user_group_Doing.label;
    }
    if (user_group_Done && typeof user_group_Done !== "undefined") {
      user_group_Done_str += user_group_Done.label;
    }

    try {
      await axios.post("http://localhost:3001/CreateNewApp", {
        App_Name: App_Name,
        App_Rnumber: App_Rnumber,
        App_Description: App_Description,
        App_Start_Date: App_Start_Date,
        App_End_Date: App_End_Date,
        App_Permit_Create: user_group_create_str,
        App_Permit_Open: user_group_open_str,
        App_Permit_Todolist: user_group_ToDo_str,
        App_Permit_Doing: user_group_Doing_str,
        App_Permit_Done: user_group_Done_str
      });
      //setMsg("New Application Created.");
      toast.success("New application created.");
      setSubmit(true);
      setUser_group_Create([]);
      setUser_group_Open([]);
      setUser_group_ToDo([]);
      setUser_group_Doing([]);
      setUser_group_Done([]);
      //get_groupslist();
    } catch (error) {
      if (error.response) {
        console.log(error.response);

        //setMsg(error.response.data.msg);
        // toast.error("App name already exist.");
        toast.error(error.response.data.msg);
      }
    }
  };

  async function App_Create() {
    var groupname = "Project Lead";
    username = sessionStorage.getItem("Username");

    var checkgroup = await axios.post("http://localhost:3001/CheckGroup", { username, groupname });

    if (checkgroup.data === true) {
      setPermit_app_create(true);
    }
  }
  App_Create();

  // function Verify() {
  //   var UserSession = sessionStorage.getItem("Username");
  //   var GroupSession = sessionStorage.getItem("Usergroup");
  // if (user == UserSession) {
  return (
    <div style={{ display: "flex", alightItems: "center", justifyContent: "center" }}>
      <table className="table is-striped is-narrow mx-6">
        <thead>
          <tr>
            <th className="has-text-centered is-size-2">Applications</th>
          </tr>
        </thead>
        <thead>
          <tr>
            <h3 className="has-text-centered">Choose existing applications</h3>
          </tr>
        </thead>
        <tbody className="column is-narrow">
          {apps.map((app, index) => (
            <tr key={app.id}>
              <td>{index + 1}</td>
              <td>{app.App_Name}</td>
              <td>
                {permit_app_create ? (
                  <button
                    className="button is-small is-rounded is-link"
                    onClick={() => {
                      EditApp(app);
                    }}
                    id="editapp"
                  >
                    Edit App
                  </button>
                ) : (
                  <></>
                )}
                <button
                  className="button is-small is-rounded is-link"
                  onClick={() => {
                    navigate(`/Board/${user}/${app.App_Name}`);
                  }}
                >
                  View Board
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <div style={{ display: "flex", alightItems: "center", justifyContent: "center" }}>
          <span>
            {/* CREATE APP MODAL */}

            {permit_app_create ? (
              <button className="button is-small is-rounded is-link" id="createapp">
                Create New App
              </button>
            ) : (
              <></>
            )}
          </span>
        </div>
      </table>

      {/* EDIT APP MODAL */}
      <div className="modal" id="modal">
        <div className="modal-background" id="modal-bg"></div>
        <div className="modal-content has-background-white py-5 px-5">
          <div className="title is-4">Edit Application</div>
          <form onSubmit={updateApp} className="box" id="form1">
            <p className="has-text-danger">{msg}</p>

            <div className="field mt-3">
              <label className="label">Application Name</label>
              <div className="controls">
                <input type="text" className="input" value={App_Name} disabled onChange={e => setApp_Name(e.target.value)} />
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Application Rnumber</label>
              <div className="controls">
                <input type="number" className="input" value={App_Rnumber} disabled onChange={e => setApp_Rnumber(e.target.value)} />
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Application Description</label>
              <div className="controls">
                <textarea type="textarea" className="input" value={App_Description} onChange={e => setApp_Description(e.target.value)}></textarea>
              </div>
            </div>

            {/* <div className="field">
                  <h1 className="text-center">Start Date</h1>
                  <div className="calendar-container">
                    <Calendar onChange={setApp_Start_Date} value={App_Start_Date} />
                  </div>
                  <p className="text-center">
                    <span className="bold">Selected Date:</span> {App_Start_Date.toDateString()}
                  </p>
                </div> */}

            <div className="field">
              <h1 className="text-center">Start Date</h1>
              <DateTimePicker onChange={setApp_Start_Date} value={App_Start_Date} />
            </div>

            {/* <div className="field">
                  <h1 className="text-center">End Date</h1>
                  <div className="calendar-container">
                    <Calendar onChange={setApp_End_Date} value={App_End_Date} />
                  </div>
                  <p className="text-center">
                    <span className="bold">Selected Date:</span> {App_End_Date.toDateString()}
                  </p>
                </div> */}

            <div className="field">
              <h1 className="text-center">End Date</h1>
              <DateTimePicker onChange={setApp_End_Date} value={App_End_Date} />
            </div>

            <div className="field mt-3">
              <label className="label">Create</label>
              <div className="control">
                <Select value={user_group_Create} options={user_group_db} onChange={handleChangeCreate}></Select>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Open</label>
              <div className="control">
                <Select value={user_group_Open} options={user_group_db} onChange={handleChangeOpen}></Select>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">To Do</label>
              <div className="control">
                <Select value={user_group_ToDo} options={user_group_db} onChange={handleChangeToDo}></Select>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Doing</label>
              <div className="control">
                <Select value={user_group_Doing} options={user_group_db} onChange={handleChangeDoing}></Select>
              </div>
            </div>

            <div className="field mt-3">
              <label className="label">Done</label>
              <div className="control">
                <Select value={user_group_Done} options={user_group_db} onChange={handleChangeDone}></Select>
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

      {/* CREATE NEW APP MODAL */}
      <div className="modal" id="modal1">
        <div className="modal-background" id="modal-bg1"></div>
        <div className="modal-content has-background-white py-5 px-5">
          <div className="title is-5">Create New Application</div>
          <form onSubmit={CreateApp} className="box" id="form2">
            {/* <p className="has-text-danger">{msg}</p> */}
            <div className="field">
              <h2 className="label">Enter Application Name</h2>
              <div className="control">
                <input type="text" className="input" placeholder="Application Name" required onChange={e => setApp_Name(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <h2 className="label">Enter Application Rnumber</h2>
              <div className="control">
                <input type="number" min="0" className="input" placeholder="Application Rnumber" required onChange={e => setApp_Rnumber(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <h2 className="label">Application Description</h2>
              <div className="control">
                <textarea className="textarea" placeholder="Application Description" onChange={e => setApp_Description(e.target.value)}></textarea>
              </div>
            </div>

            <div className="field">
              <h1 className="text-center">Start Date</h1>
              <DateTimePicker onChange={setApp_Start_Date} value={App_Start_Date} />
            </div>

            <div className="field">
              <h1 className="text-center">End Date</h1>
              <DateTimePicker onChange={setApp_End_Date} value={App_End_Date} />
            </div>
            <div className="field mt-3">
              <label className="label">Create</label>
              <div className="control">
                <Select value={user_group_Create} options={user_group_db1} onChange={handleChangeCreate}></Select>
              </div>
            </div>
            <div className="field mt-3">
              <label className="label">Open</label>
              <div className="control">
                <Select value={user_group_Open} options={user_group_db1} onChange={handleChangeOpen}></Select>
              </div>
            </div>
            <div className="field mt-3">
              <label className="label">To Do</label>
              <div className="control">
                <Select value={user_group_ToDo} options={user_group_db1} onChange={handleChangeToDo}></Select>
              </div>
            </div>
            <div className="field mt-3">
              <label className="label">Doing</label>
              <div className="control">
                <Select value={user_group_Doing} options={user_group_db1} onChange={handleChangeDoing}></Select>
              </div>
            </div>
            <div className="field mt-3">
              <label className="label">Done</label>
              <div className="control">
                <Select value={user_group_Done} options={user_group_db1} onChange={handleChangeDone}></Select>
              </div>
            </div>
            <div className="mt-6 has-text-centered">
              <button type="submit" className="button is-success is-fullwidth">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer draggable="true" position="top-center" autoClose={3000} />
    </div>
  );
  //   } else {
  //     navigate(`Home/${username}`);
  //   }
  // }
  // return Verify();
};

export default Applications;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [usergroup, setUsergroup] = useState("");
  const [user_group, setUser_group] = useState([]);
  const [user_group_db, setUser_group_db] = useState([]);
  const [user_group_db1, setUser_group_db1] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("1");
  const [submit, setSubmit] = useState("");
  const user = useParams().user;
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setSubmit(false);
    getUsers();
    getUserByUsername();
  }, [submit]);

  useEffect(() => {
    get_groupslist();
    refreshToken();
    getUsers();
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

  const getUsers = async () => {
    const response = await axios.get("http://localhost:3001/users", {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    });
    setUsers(response.data);
    console.log("getUsers", response.data);
  };

  // EDIT MODAL
  const editmodalOpen = document.querySelector("#modal");
  const modalBg = document.querySelector("#modal-bg");

  function EditUser(user) {
    //console.log(user);
    editmodalOpen.classList.add("is-active");
    if (modalBg) {
      modalBg.addEventListener("click", () => editmodalOpen.classList.remove("is-active"));
    }

    var group_arr = user.usergroup.split(","); //remove all the commas in usergroup
    var user_group_arr = []; //create new var array
    // console.log(typeof user.usergroup);
    // console.log(group_arr.length);
    for (let i = 0; i < group_arr.length; i++) {
      if (group_arr[i].length != 0) user_group_arr.push({ value: group_arr[i], label: group_arr[i] }); //create objects in array in the form of value and label
    }
    console.log(user_group_arr);
    // console.log(admin);
    for (let i = 0; i < user_group_arr.length; i++) {
      console.log(user_group_arr[i].label);
      setAdmin(false);
      if (user_group_arr[i].label == "Admin") {
        setAdmin(true);
        break;
      }
    }
    console.log(admin);

    setUsername(user.username);
    setEmail(user.email);
    setUsergroup(user.usergroup);
    setStatus(user.status);
    setUser_group(user_group_arr);
    get_groupslist();
  }

  // CREATE NEW GROUP MODAL
  const creategroupButton = document.querySelector("#creategroup");
  const modalBg1 = document.querySelector("#modal-bg1");
  const modal1 = document.querySelector("#modal1");

  if (creategroupButton) {
    creategroupButton.addEventListener("click", () => modal1.classList.add("is-active"));
  }

  if (modalBg1) {
    modalBg1.addEventListener("click", () => {
      modal1.classList.remove("is-active");
      const form = document.getElementById("form2");
      form.reset();
    });
  }

  // CREATE NEW USER MODAL

  const createuserButton = document.querySelector("#createuser");
  const modalBg2 = document.querySelector("#modal-bg2");
  const modal2 = document.querySelector("#modal2");

  if (createuserButton) {
    createuserButton.addEventListener("click", () => {
      setUsername("");
      setEmail("");
      setUser_group([]);
      setStatus("1");
      modal2.classList.add("is-active");
    });
  }

  if (modalBg2) {
    modalBg2.addEventListener("click", () => {
      modal2.classList.remove("is-active");
      const form = document.getElementById("form3");
      form.reset();
      setUsername("");
      setEmail("");
      setUser_group([]);
      setStatus("1");
    });
  }

  //MULTI SELECT USERGROUP FUNCTION

  const handleChange = e => {
    console.log(e);
    setUser_group(e); //updated to the latest usergroups selected
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
      console.log("getgrouplist", response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  //ADMIN UPDATE USER FUNCTION

  const getUserByUsername = async () => {
    try {
      await axios.get("http://localhost:3001/Users", {});
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        // setMsg(error.response.data.msg);
      }
    }
    console.log("getuserbyusername");
  };

  const updateUser = async e => {
    e.preventDefault();
    const form = document.getElementById("form1");
    form.reset();
    console.log(user_group); //user_group alr updated to the latest usergroups selected

    var user_group_str = ""; //create new var as string
    for (let i = 0; i < user_group.length; i++) {
      user_group_str += user_group[i].label; //append in the groups as string to send it back to database
      user_group_str += ",";
      console.log(user_group_str);
    }

    if (user_group_str.length != 0) {
      //if there is a group, remove the last comma
      user_group_str = user_group_str.slice(0, user_group_str.length - 1);
    }
    //console.log(user_group_str);
    setUsergroup(user_group_str);

    try {
      await axios.post("http://localhost:3001/adminupdateUser", {
        username: username,
        password: password,
        email: email,
        usergroup: user_group_str,
        status: status
      });
      //setMsg("User information updated.");
      toast.success("User information updated.");
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

  //CREATE NEW GROUP FUNCTION
  const CreateGroup = async e => {
    e.preventDefault();
    var form = document.getElementById("form2");
    form.reset();
    try {
      await axios.post("http://localhost:3001/createGroup", {
        usergroup: usergroup
      });
      //setMsg("New User Group Created.");
      toast.success("New user group created.");
      setSubmit(true);
      get_groupslist();
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        //setMsg(error.response.data.msg);
        toast.error("Group name already exist.");
      }
    }
  };

  //CREATE NEW USER FUNCTION
  const Register = async e => {
    e.preventDefault();
    const form = document.getElementById("form3");

    var user_group_str = ""; //create new var as string
    for (let i = 0; i < user_group.length; i++) {
      user_group_str += user_group[i].label; //append in the groups as string to send it back to database
      user_group_str += ",";
      console.log(user_group_str);
    }
    if (user_group_str.length != 0) {
      //if there is a group, remove the last comma
      user_group_str = user_group_str.slice(0, user_group_str.length - 1);
    }

    setUsergroup(user_group_str);

    try {
      console.log(status);
      await axios.post("http://localhost:3001/register", {
        username: username,
        email: email,
        password: password,
        usergroup: user_group_str,
        status: status
      });
      //setMsg("New User Created.");
      toast.success("New User Created");
      form.reset();
      setSubmit(true);
      setUsername("");
      setEmail("");
      setUser_group([]);
      setStatus("1");
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        //setMsg(error.response.data.msg);
        toast.error(error.response.data.msg);
      }
    }
  };

  function Verify() {
    var UserSession = sessionStorage.getItem("Username");
    var GroupSession = sessionStorage.getItem("Usergroup");
    if (user == UserSession && "Admin" == GroupSession) {
      return (
        <div>
          <table className="table is-striped is-fullwidth mx-6">
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                {/* <th>Password</th> */}
                <th>Email</th>
                <th>User Group</th>
                <th>Status</th>
                <th>Actions</th>

                <th>
                  <span>
                    {/* CREATE GROUP MODAL */}
                    <button className="button is-small is-rounded is-link " id="creategroup">
                      Create New Group
                    </button>
                    {/* CREATE USER MODAL */}
                    <button className="button is-small is-rounded is-link " id="createuser">
                      Create New User
                    </button>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  {/* <td>**********</td> */}
                  <td>{user.email}</td>
                  <td>{user.usergroup}</td>
                  <td>{user.status ? "Active" : "Inactive"}</td>

                  <td>
                    <button
                      class="button is-small is-rounded is-link"
                      onClick={() => {
                        EditUser(user);
                      }}
                      id="edituser"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EDIT USER MODAL */}
          <div className="modal" id="modal">
            <div className="modal-background" id="modal-bg"></div>
            <div className="modal-content has-background-white py-5 px-5">
              <div className="title is-4">Update User Information</div>
              <form onSubmit={updateUser} className="box" id="form1">
                <p className="has-text-danger">{msg}</p>

                <div className="field mt-3">
                  <label className="label">Username</label>
                  <div className="controls">
                    <input type="text" className="input" value={username} disabled onChange={e => setUsername(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-3">
                  <label className="label">Email</label>
                  <div className="controls">
                    <input type="text" className="input" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-3">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input type="password" className="input" placeholder="******" onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>

                <div className="field mt-3">
                  <label className="label">User Group</label>
                  <div className="control">
                    <Select value={user_group} isMulti options={user_group_db} onChange={handleChange}></Select>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Status</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select value={status} disabled={admin} onChange={e => setStatus(e.target.value)}>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
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

          {/* CREATE NEW GROUP MODAL */}
          <div className="modal" id="modal1">
            <div className="modal-background" id="modal-bg1"></div>
            <div className="modal-content has-background-white py-5 px-5">
              <div className="title is-5">Create New Group</div>
              <form onSubmit={CreateGroup} className="box" id="form2">
                {/* <p className="has-text-danger">{msg}</p> */}
                <div className="field">
                  <h2 className="label">Enter new group here</h2>
                  <div className="control">
                    <input type="text" className="input" placeholder="Group Name" required onChange={e => setUsergroup(e.target.value)} />
                  </div>
                </div>
                <div className="mt-6 has-text-centered">
                  <button type="submit" className="button is-success is-fullwidth">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CREATE NEW USER MODAL */}

          <div className="modal" id="modal2">
            <div className="modal-background" id="modal-bg2"></div>
            <div className="centered-div">
              <div className="column is-4-desktop">
                <div className="modal-content has-background-white py-5 px-5">
                  <div className="title is-5">Create New User</div>
                  <form onSubmit={Register} className="box" id="form3">
                    {/* <p className="has-text-danger">{msg}</p> */}
                    <div className="field">
                      <h2 className="label">Username</h2>
                      <div className="controls">
                        <input type="text" className="input" placeholder="Username" required onChange={e => setUsername(e.target.value)} />
                      </div>
                    </div>

                    <div className="field mt-3">
                      <label className="label">Email</label>
                      <div className="controls">
                        <input type="text" className="input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                      </div>
                    </div>

                    <div className="field mt-3">
                      <label className="label">Password</label>
                      <div className="controls">
                        <input type="password" className="input" placeholder="******" required onChange={e => setPassword(e.target.value)} />
                      </div>
                    </div>
                    <div className="field mt-3">
                      <label className="label">User Group</label>
                      <div className="control">
                        {/* <div className="select is-fullwidth"> */}
                        {/* <select onChange={e => setUsergroup(e.target.value)}> */}
                        <Select value={user_group} isMulti options={user_group_db1} onChange={handleChange}></Select>
                        {/* </div> */}
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Status</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select onChange={e => setStatus(e.target.value)}>
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 has-text-centered">
                      <button type="submit" className="button is-success is-fullwidth">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer draggable="true" position="top-center" autoClose={3000} />
        </div>
      );
    } else {
      navigate(`Home/${username}`);
    }
  }

  return Verify();
};

export default Dashboard;

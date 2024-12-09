import { register, getusers, get_user, get_groups, updateuser, adminupdateuser, creategroup, find_username, add_refresh_token, checkgroup, find_refresh_token, update_refreshtoken, disableuser } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import e from "express";
import jwt from "jsonwebtoken";
import deasync from "deasync";

//GETUSERS FUNCTION
export const getUsers = async (req, res) => {
  getusers(function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
    const Data = Array.from(data);
    res.json(Data);
  });
};

//CREATE NEW USER FUNCTION
export const Register = async (req, res) => {
  const { username, email, password, usergroup, status } = req.body;
  if (!username || !password) {
    res.status(400).json({ msg: "Please enter username, password and email." });
    return;
  }

  if (username) {
    const regex_username = /^\S*$/;
    if (!regex_username.test(username)) {
      res.status(401).json({ msg: "Username should not contain any spacings." });
      return;
    }
  }

  if (email) {
    const regex_email = /^\S+@\S+\.\S+$/;
    if (!regex_email.test(email)) {
      res.status(401).json({ msg: "Email should contain an '@', '.com' and should not contain any spacings." });
      return;
    }
  }

  if (password) {
    const regex_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/;
    if (!regex_password.test(password)) {
      res.status(401).json({ msg: "Password should contain min 8, max 10 characters and comprise of alphabets, numbers and special character." });
      return;
    }
  }

  // if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match." });

  find_username(username, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      if (data.length == 1) {
        //console.log(data.length);
        res.status(403).json({ msg: "Username already exists." });
        return;
      }
    }
    //insert all the info into database
    await register(username, password, email, usergroup, status, function (err, data) {
      if (err) {
        console.log("ERROR:", err);
        res.status(400).json({ msg: err });
      } else {
        //console.log("result from db is : ", data);
        res.json({ msg: "Registration Successful!" });
      }
    });
  });
};

//LOGIN FUNCTION
export const Login = async (req, res) => {
  const { username, password } = req.body;
  //console.log(username, password);
  if (!username || !password) {
    res.status(400).json({ msg: "Please enter username or password." });
    return;
  }

  find_username(username, async function (err, data) {
    //console.log(data);
    if (err) {
      console.log("ERROR:", err);
      res.status(401).json({ msg: "Invalid Username or Password." });
    } else if (data.length == 0) {
      //if username does not exist in database, no entry

      res.status(401).json({ msg: "Invalid Username or Password." });
    } else {
      if (data[0].status == "0") {
        //if status is inactive, no entry
        res.status(403).json({ msg: "Invalid Username or Password." });
        return;
      }

      const match = await bcrypt.compare(req.body.password, data[0].password);
      if (!match) {
        res.status(402).json({ msg: "Invalid Username or Password." });
        return;
      }
      const username = data[0].username;
      const password = data[0].password;
      const email = data[0].email;
      const accessToken = jwt.sign({ username, password, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "40s"
      });
      //console.log(accessToken);
      const refreshToken = jwt.sign({ username, password, email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d"
      });

      add_refresh_token(refreshToken, username, async function (err, data) {
        if (err) {
          console.log("ERROR:", err);
        } else {
          //console.log("result from db is : ", data);
        }
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
      res.json({ message: "Login Success!", accessToken });
    }
  });
};

//LOGOUT FUNCTION
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  //find where refresh token is at in the database
  find_refresh_token(refreshToken, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
      if (!data[0]) return res.sendStatus(204);
      const username = data[0].username;

      //clear the refreshtoken in the database
      update_refreshtoken(username, function (err, data) {
        if (err) {
          console.log("ERROR:", err);
        } else {
          //console.log("result from db is : ", data);
          console.log("Token cleared.");
        }
      });

      res.clearCookie("refreshToken");
      return res.sendStatus(200);
    }
  });
};

//UPDATE USER FUNCTION
export const updateUser = async (req, res) => {
  const { username, password, email } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  if (!password && !email) {
    res.status(400).json({ msg: "Please enter new password or email to update user information." });
    return;
  }

  if (password) {
    const regex_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/;
    if (!regex_password.test(password)) {
      res.status(401).json({ msg: "Password should contain min 8, max 10 characters and comprise of alphabets, numbers and special character." });
      return;
    }
  }

  if (email) {
    const regex_email = /^\S+@\S+\.\S+$/;
    if (!regex_email.test(email)) {
      res.status(401).json({ msg: "Email should contain an '@', '.com' and should not contain any spacings." });
      return;
    }
  }

  //update the info in database
  updateuser(username, password, email, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
  });

  res.json({ msg: "User information updated!" });
};

//ADMINUPDATEUSER FUNCTION
export const adminupdateUser = async (req, res) => {
  const { username, password, email, usergroup, status } = req.body;
  //console.log(req.body);
  if (!password && !email && !usergroup && !status) {
    res.status(400).json({ msg: "Please enter at least one field to update user information." });
    return;
  }

  if (password) {
    const regex_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/;
    if (!regex_password.test(password)) {
      res.status(401).json({ msg: "Password should contain min 8, max 10 characters and comprise of alphabets, numbers and special character." });
      return;
    }
  }
  if (username) {
    const regex_username = /^\S*$/;
    if (!regex_username.test(username)) {
      res.status(401).json({ msg: "Username should not contain any spacings." });
      return;
    }
  }

  if (email) {
    const regex_email = /^\S+@\S+\.\S+$/;
    if (!regex_email.test(email)) {
      res.status(401).json({ msg: "Email should contain an '@', '.com' and should not contain any spacings." });
      return;
    }
  }

  //update info in database
  await adminupdateuser(username, password, email, usergroup, status, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
  });
  res.json({ msg: "User information updated!" });
};

//DELETEUSER FUNCTION
//Delete row in database
export const disableUser = async (req, res) => {
  const { username } = req.body;
  disableuser(username, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log("result from db is : ", data);
    }
  });
  res.json({ msg: "User disabled!" });
};

//CREATEGROUP FUNCTION
export const createGroup = async (req, res) => {
  const { usergroup } = req.body;
  if (!usergroup) {
    res.status(400).json({ msg: "Please enter a usergroup." });
    return;
  }

  //insert a new row in the usergroup table
  await creategroup(usergroup, function (err, data) {
    console.log(err);
    if (err) {
      console.log("DUPLICATE ERROR:", err);
      res.status(403).json({ msg: "Group already exists" });
    } else {
      //console.log("result from db is : ", data);
      res.json({ msg: "New Group Created" });
    }
  });
};

//GET USER FUNCTION
export const get_User = async (req, res) => {
  //console.log("hey", req.body);
  const { username } = req.body;
  get_user(username, async function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      // console.log(data[0].usergroup);
      res.json(data);
      //console.log(data);
    }
  });
};

//GET USER GROUP FUNCTION
export const get_groupslist = async (req, res) => {
  get_groups(function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      //console.log(data);
      res.json(data);
    }
  });
};

//Checkgroup(userid, groupname)
export const CheckGroupRoute = async (req, res) => {
  const { username, groupname } = req.body;
  console.log("hello", req.body);

  const test = await Checkgroup(username, groupname);
  //console.log(test);
  res.send(test);
  return;
};

const Checkgroup = async function (userid, groupname) {
  //console.log(userid);
  let sync = true;
  //console.log("hello", userid, groupname);
  let usersinGroup = false;
  // checkgroup(userid, function (err, data) {
  // console.log(userid);
  //   //console.log(data[0].usergroup.split(","));
  //   // const grouplist = response.data[0].usergroup.split(",");
  //   // for (let group of grouplist) {
  //   //   if (groupname == group) {
  //   //     usersinGroup = true;
  //   //   }
  //   // }
  //   // sync = false;
  //   // console.log("usersinGroup", usersinGroup);
  // });
  await checkgroup(userid, (err, data) => {
    if (err) {
      console.log("err");
    } else {
      if (data[0].usergroup == groupname) {
        usersinGroup = true;
      } else {
        usersinGroup = false;
      }
    }
    // console.log(data[0].usergroup);
    //console.log(data[0].usergroup);
    // const grouplist = data[0].usergroup;
    // for (let group of grouplist) {
    //   if (groupname == group) {
    //     usersinGroup = true;
    //   }
    // }

    sync = false;
    // console.log("usersinGroup", usersinGroup);
  });
  while (sync) {
    deasync.sleep(10);
  }
  //console.log("hehe", usersinGroup);
  return usersinGroup;
};

//Checkgrouptest(userid, groupname)
export const Checkgrouptest = async (req, res) => {
  const { username, usergroup } = req.body;
  var checked = Checkgroup(username, usergroup);
  //console.log("testing", checked);
  res.send(checked);
};

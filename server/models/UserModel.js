import db from "../config/Database.js";
import bcrypt from "bcrypt";

//GET USERS FUNCTION
export const getusers = function (callback) {
  db.query("SELECT username, password, email, usergroup, status FROM accounts", function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//CREATE NEW USER FUNCTION
export const register = async function (username, password, email, usergroup, status, callback) {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  //console.log(status);
  db.query("INSERT INTO accounts (username, password, email, usergroup, status) VALUES ?", [[[username, hashPassword, email, usergroup, status]]], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//LOGIN FUNCTION
export const find_username = async function (username, callback) {
  db.query("SELECT * FROM accounts WHERE username =?", [username], async function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const add_refresh_token = async function (refreshToken, username, callback) {
  db.query("UPDATE accounts SET refresh_token =?  WHERE username =?", [refreshToken, username], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//LOGOUT FUNCTION
export const find_refresh_token = async function (refreshToken, callback) {
  db.query("SELECT * FROM accounts WHERE refresh_token =?", [refreshToken], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

export const update_refreshtoken = async function (username, callback) {
  db.query("UPDATE accounts SET refresh_token = NULL WHERE username =?", [username], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//UPDATEUSER FUNCTION
export const updateuser = async function (username, password, email, callback) {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  if (password) {
    db.query("UPDATE accounts SET password=? WHERE username=?", [hashPassword, username], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
  if (email) {
    db.query("UPDATE accounts SET email=? WHERE username=?", [email, username], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
};

//ADMINUPDATEUSER FUNCTION
export const adminupdateuser = async function (username, password, email, usergroup, status, callback) {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  if (password) {
    db.query("UPDATE accounts SET password=? WHERE username=?", [hashPassword, username], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
  {
    db.query("UPDATE accounts SET email=? WHERE username=?", [email, username], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  {
    db.query("UPDATE accounts SET usergroup=? WHERE username=?", [usergroup, username], function (err, result) {
      if (err) {
        callback(err, null);
      } else callback(null, result);
    });
  }
  if (status) {
    db.query("UPDATE accounts SET status=? WHERE username=?", [status, username], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
};

//DISABLEUSER FUNCTION
export const disableuser = async function (username, callback) {
  if (username) {
    db.query("UPDATE accounts SET status=0 WHERE username=?", [username], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
};

//GETUSER FUNCTION
export const get_user = async function (username, callback) {
  //console.log("hihi", username);
  db.query("SELECT * FROM accounts WHERE username =? ", [username], async function (err, result) {
    //console.log(result);
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//GET GROUP FUNCTION
export const get_groups = function (callback) {
  db.query("SELECT * FROM usergroup", function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

//CREATEGROUP FUNCTION
export const creategroup = async function (usergroup, callback) {
  if (usergroup) {
    db.query("INSERT INTO usergroup (user_group) VALUES ?", [[[usergroup]]], function (err, result) {
      if (err) callback(err.errno == 1062, null);
      else callback(null, result);
      //console.log(result);
    });
  }
};

//CHECKGROUP FUNCTION
// export const checkgroup = async function (username, callback) {
//   console.log("reached");
//   db.query("SELECT * FROM accounts WHERE username =?", [username], async function (err, result) {
//     if (err) {
//       console.log("reached error");
//       callback(err, null);
//       return;
//     } //console.log(result);
//     else {
//       console.log(result);
//       callback(null, result);
//     }
//   });
// };
export const checkgroup = async function (username, callback) {
  // console.log("reached");
  //console.log(username);
  // try {
  //   const users = await db.query("SELECT * FROM accounts WHERE username =?", [username], function (err, result){} );
  //   console.log(users);
  //   console.log("hagdhagsdhgashdghj");

  //   return;
  // } catch (error) {}

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

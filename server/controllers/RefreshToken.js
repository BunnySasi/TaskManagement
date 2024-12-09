//import Users from "./models/UserModel.js";
import jwt from "jsonwebtoken";
import db from "../config/Database.js";

export const refreshToken = async (req, res) => {
  const { username } = req.body;
  var token = false;
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  // db.query("SELECT * FROM accounts WHERE refresh_token =?", [refreshToken], function (err, result) {
  //   if (err) {
  //     throw err;
  //   } else console.log(result);
  // if (!result[0].refresh_token) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    // const username = result[0].username;
    // const password = result[0].password;
    // const email = result[0].email;
    // const accessToken = jwt.sign({ username, password, email }, process.env.ACCESS_TOKEN_SECRET, {
    //   expiresIn: "40s"
    if (decoded.username == username) {
      token = true;
      console.log(token);
      res.json(token);
    } else {
      console.log(token);
      res.json(token);
    }
  });
  //res.json({ accessToken });
};

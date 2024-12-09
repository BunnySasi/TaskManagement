import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; //get token from postman header
  const token = authHeader && authHeader.split(" ")[1]; //assign second term of bearer access token
  if (token == null) return res.sendStatus(401);
  console.log("bye"); //send error if token is empty
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log("bye1"); //send error if token is empty

    if (err) return res.sendStatus(403); //token no longer available
    console.log("bye2"); //send error if token is empty

    req.email = decoded.email;
    //res(decoded);
    next();
  });
  res.send(token);
};

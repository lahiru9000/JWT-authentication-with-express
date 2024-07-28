import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 9002;

app.use(express.json());

let refreshTokens = [];

const generateAccessToken = function (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
};

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.send({ accessToken });
  });
});

app.post("/login", (req, res) => {
  //Authenticate user
  const { username } = req.body;
  const user = { name: username };
  // create access token
  const accessToken = generateAccessToken(user);
  // create refresh token
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  //save refresh token
  refreshTokens.push(refreshToken);
  res.send({ accessToken, refreshToken });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});

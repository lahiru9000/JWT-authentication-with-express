import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 9000;

app.use(express.json());

const posts = [
  {
    username: "Lahiru",
    post: "post 1",
  },
  {
    username: "Jack",
    post: "post 2",
  },
];

const authenticateToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/posts", authenticateToken, (req, res) => {
  res.send(posts.filter((post) => post.username === req.user.name));
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});

const express = require("express");
const cors = require("cors");
const {
  getArticleById,
  patchArticleVotesById,
  getArticles,
  getArticleComments,
  postComment,
} = require("./controllers/articles-controller");
const { getTopics } = require("./controllers/topics-controller");
const { getUsers } = require("./controllers/users-controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/errors");

app.use(cors());

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleVotesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

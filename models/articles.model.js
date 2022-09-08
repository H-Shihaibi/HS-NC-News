const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const arrValues = [article_id];
  return db
    .query(
      `SELECT articles.*, Count(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      arrValues
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id : ${article_id}`,
        });
      }
      return rows[0];
    });
};

exports.updateArticleVotesById = (articleId, newVotesCount) => {
  const arrValues = [newVotesCount, articleId];
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      arrValues
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id : ${articleId}`,
        });
      }
      return rows[0];
    });
};

exports.selectArticleCommentCount = (article_id) => {
  const arrValues = [article_id];
  return db
    .query(
      "SELECT * FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE article_id = $1;",
      arrValues
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id : ${article_id}`,
        });
      }
      return rows[0];
    });
};

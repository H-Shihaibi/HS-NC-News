const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then((article) => {
      return article.rows[0];
    });
};

exports.updateArticleVotesById = (articleId, newVotesCount) => {
  const { votes } = newVotesCount;
  const arrValues = [votes, articleId];
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

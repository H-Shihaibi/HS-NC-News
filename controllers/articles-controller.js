const {
  selectArticleById,
  updateArticleVotesById,
  selectArticleCommentCount,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const newVotesCount = req.body.votes;
  updateArticleVotesById(article_id, newVotesCount)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotesById = (req, res, next) => {
  const input = req.params.article_id;
  const newVotesCount = req.body;
  updateArticleVotesById(input, newVotesCount)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.patchRestaurantById = (req, res) => {
  const input = req.params.restaurant_id;
  const newAreaId = req.body;
  updateRestaurantById(input, newAreaId).then((updatedRestaurant) => {
    res.status(200).send({ updatedRestaurant });
  });
};

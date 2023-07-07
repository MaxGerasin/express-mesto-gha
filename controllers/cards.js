const mongoose = require('mongoose');
const { codesError } = require('../const');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(codesError.DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

const postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(codesError.INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(codesError.DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res
          .status(codesError.NOT_FOUND_DATA)
          .send({ message: 'Карточка с указанным id не найдена' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(codesError.INCORRECT_DATA).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(codesError.DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res
          .status(codesError.NOT_FOUND_DATA)
          .send({ message: 'Передан несуществующий id карточки' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(codesError.INCORRECT_DATA).send({
          message: 'Переданы некорректные данные для установки лайка',
        });
      } else {
        res.status(codesError.DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res
          .status(codesError.NOT_FOUND_DATA)
          .send({ message: 'Передан несуществующий id карточки' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(codesError.INCORRECT_DATA).send({
          message: 'Переданы некорректные данные для удаления лайка',
        });
      } else {
        res.status(codesError.DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
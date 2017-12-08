const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');
const Joi = require('joi');
const UsersController = require('../controllers/users');

const helper = {
  validateBody: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).json(result.error);
    }

    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    }),
  },
};


module.exports = {
  initRouter: function route(app) {
    const { validateBody, schemas } = helper;

    app.route('/signup')
      .post(UsersController.signup);

    app.route('/signin')
      .post(validateBody(schemas.authSchema), passport.authenticate('local', { session: false }), UsersController.signin);

    app.route('/secret')
      .get(passport.authenticate('jwt', { session: false }), UsersController.secret);
  },
};

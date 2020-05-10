const express = require('express');
const router = express.Router();
const userController = require('./../controller/user');
const validator = require('express-joi-validation').createValidator({})
const validatorSchema = require('./../validator/validator');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: All about users
 */

/**
 * @swagger
 * /authenticate:
 *   post:
 *     summary: Authenticate user by login
 *     description: Authenticate user and get token
 *     tags: [Users]
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: body
 *         type: string
 *         required: true
 *       - name: password
 *         description: User's password
 *         in: body
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success authenticate user
 */
router.post('/authenticateUser',
  validator.body(validatorSchema.authenticateBodySchema),
  userController.authenticateUser);

module.exports = router;
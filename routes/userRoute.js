const express = require('express');

const userController = require('../controller/userController');
const authenController = require('../controller/authenController');

const router = express.Router();

router.post('/signup', authenController.signup);
router.post('/login', authenController.login);

router.post('/forgotPassword', authenController.forgotPassword);
router.patch('/resetPassword/:token', authenController.resetPassword);
router.patch(
  '/updateMyPassword',
  authenController.protect,
  authenController.updatePassword
);

router.patch('/updateMe', authenController.protect, userController.updateMe);
router.delete('/deleteMe', authenController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

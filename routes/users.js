const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users");
const {handleErrorAsync} = require("../util/err");
const { isAuth } = require('../util/auth');


router.get("/", function (req, res, next) {
	handleErrorAsync(usersCtrl.getUsers(req, res, next));
});

router.post("/sign_up", function (req, res, next) {
	handleErrorAsync(usersCtrl.signUp(req, res, next));
});

router.post("/sign_in", function (req, res, next) {
	handleErrorAsync(usersCtrl.signIn(req, res, next));
});

router.get("/profile", isAuth, function (req, res, next) {
	handleErrorAsync(usersCtrl.getProfile(req, res, next));
});

router.patch("/profile", isAuth, function (req, res, next) {
	handleErrorAsync(usersCtrl.updateProfile(req, res, next));
});

router.patch("/changePassword", isAuth, function (req, res, next) {
	handleErrorAsync(usersCtrl.changePassword(req, res, next));
});

module.exports = router;

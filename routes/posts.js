var express = require("express");
var router = express.Router();
// const Post = require("../models/modPost");
const postsCtrl = require("../controllers/posts");
const { handleErrorAsync } = require("../util/err");
const { isAuth } = require("../util/auth");

router.get("/", function (req, res, next) {
	handleErrorAsync(postsCtrl.getPosts(req, res, next));
});

router.get("/getpost/:id", function (req, res, next) {
	handleErrorAsync(postsCtrl.getPost(req, res, next));
});

router.get("/get_posts_by_user", isAuth, function (req, res, next) {
	handleErrorAsync(postsCtrl.getPostByUser(req, res, next));
});

// router.get("/getpost/:id", function (req, res, next) {
// 	handleErrorAsync(postsCtrl.getPost(req, res, next));
// });

router.post("/", isAuth, function (req, res, next) {
	handleErrorAsync(postsCtrl.postPost(req, res, next));
});

// router.delete("/", isAuth, function (req, res, next) {
// 	handleErrorAsync(postsCtrl.delPosts(req, res, next));
// });

router.delete("/:id", isAuth, function (req, res, next) {
	handleErrorAsync(postsCtrl.delPost(req, res, next));
});

router.patch("/:id", isAuth, function (req, res, next) {
	handleErrorAsync(postsCtrl.patchPost(req, res, next));
});

module.exports = router;

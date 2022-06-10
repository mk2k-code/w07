const Post = require("../models/modPost");
const User = require("../models/modUser");
const validator = require("validator");
const { appError } = require("../util/err");

const posts = {
	//  **** 查詢貼文
	async getPosts(req, res, next) {
		const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
		const q = req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
		const post = await Post.find(q)
			.populate({
				path: "user",
				select: "name photo"
			}).sort(timeSort);

		res.status(200).json({
			post
		});
	},

	//  **** 查詢單筆貼文
	async getPost(req, res, next) {
		const post_id = req.params.id;
		// const user_id = req.user.id;
		let post;
		if (validator.isMongoId(post_id)) {
			post = await Post.findById(post_id).populate({
				path: "user",
				select: "name photo"
			});
			if (post) {
				res.status(200).json({
					post
				});
			} else {
				return appError(400, "無貼文", next);
			}
		} else {
			return appError(400, "貼文 id格式錯誤，請重新輸入", next);
		}
	},

	//  **** 查詢自己的所有貼文
	async getPostByUser(req, res, next) {
		const user_id = req.user.id;
		let post;
		if (validator.isMongoId(user_id)) {
			post = await Post.find({ user: user_id }).populate({
				path: "user",
				select: "name photo "
			});
			if (post) {
				res.status(200).json({
					post
				});
			} else {
				return appError(400, "無貼文", next);
			}
		} else {
			return appError(400, "User id格式錯誤，請重新輸入", next);
		}
	},

	//  **** 新增貼文
	async postPost(req, res, next) {
		const user_id = req.user.id;
		const { content, image } = req.body;
		if (content) {
			const newPost = await Post.create({
				user: user_id,
				content: content,
				image: image || ""
			});
			res.status(200).json({
				post: newPost
			});
		} else {
			return appError(400, "沒填寫 content 資料，或欄位名稱不正確", next);
		}
	},

	// //  **** 刪除所有貼文
	// async delPosts(req, res, next) {
	// 	const posts = await Post.deleteMany({});
	// 	res.status(200).json({
	// 		post: posts
	// 	});
	// },

	//  **** 刪除自己的貼文
	async delPost(req, res, next) {
		const post_id = req.params.id;
		const user_id = req.user.id;
		let post;
		if (validator.isMongoId(post_id)) {
			post = await Post.findById(post_id);
		} else {
			return appError(400, "貼文id格式錯誤，請重新輸入", next);
		}
		if (!post) {
			return appError(400, "無此貼文ID", next);
		}
		// console.log(post.user.toString() , user_id)
		//  只能刪自己的貼文
		if (post.user.toString() === user_id) {
			const del_post = await Post.findByIdAndDelete(post_id)
			res.status(200).json({
				post: del_post
			});
			console.log("貼文刪除成功");

		} else {
			return appError(400, "貼文非本人所張貼，無法刪除", next);
		}
	},

	//  **** 修改貼文
	async patchPost(req, res, next) {
		const post_id = req.params.id;
		const user_id = req.user.id;
		let post;
		const { user, content, image } = req.body;
		if (validator.isMongoId(post_id)) {
			post = await Post.findById(post_id);
		} else {
			return appError(400, "貼文id格式錯誤，請重新輸入", next);
		}
		if (!post) {
			return appError(400, "無此貼文，請重新輸入", next);
		}
		//  只能修改自己的貼文
		if (post.user.toString() === user_id) {
			if (content) {
				const result = await Post.findByIdAndUpdate(post_id, {
					content: content,
					image: image
				}) 
				res.status(200).json({
					post:result
				});
				console.log("修改成功");
			} else {
				return appError(400, "content 資料，不可空白", next);
			}
		} else {
			return appError(400, "非本人所張貼之貼文，無法修改", next);
		}
	},
};

module.exports = posts;

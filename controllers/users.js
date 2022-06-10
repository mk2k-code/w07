const User = require("../models/modUser");
// const ObjectId = require("mongoose").Types.ObjectId;
// const headers = require("../util/httpHeader");
// const { errorHandle, resWriteData } = require("../util/httpMsg");
const { appError } = require("../util/err");
const { jwtToken } = require("../util/auth");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = {
	/* GET all users listing. */
	async getUsers(req, res, next) {
		const users = await User.find();
		res.status(200).json({
			status: "success",
			data: users,
		});
	},

	//  **** 註冊帳號
	async signUp(req, res, next) {
		let { name, email, password, confirmPassword } = req.body;
		// 欄位內容不可為空白
		if (!name || !email || !password || !confirmPassword) {
			return next(appError("400", "欄位內容不可為空白！", next));
		}
		// 密碼一致性檢查
		if (password !== confirmPassword) {
			return next(appError("400", "密碼不一致！", next));
		}
		// 密碼 6 碼以上
		if (!validator.isLength(password, { min: 6 })) {
			return next(appError("400", "密碼字數低於 6 碼", next));
		}
		// 是否為 Email
		if (!validator.isEmail(email)) {
			return next(appError("400", "Email 格式不正確", next));
		}
		// 加密密碼
		password = await bcrypt.hash(req.body.password, 12);
		const newUser = await User.create({
			name,
			email,
			password,
		});
		jwtToken(newUser, 201, res);
	},

	//  **** Login帳號，並發給 Token:jwtToken
	async signIn(req, res, next) {
		const { email, password } = req.body;
		if (!email || !password) {
			return next(appError(400, "帳號密碼不可為空白", next));
		}
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return next(appError(400, "無此帳號，您尚未註冊!", next));
		}
		const auth = await bcrypt.compare(password, user.password);
		if (!auth) {
			return next(appError(400, "密碼錯誤", next));
		}
		jwtToken(user, 200, res);
	},

	//  **** 取得本人基本資料
	async getProfile(req, res, next) {
		const user = await User.find({ _id: req.user.id }).select("+email");
		res.status(200).json({
			status: "success",
			data: user,
		});
	},

	//  **** 更新帳號資料
	async updateProfile(req, res, next) {
		const { name, email, photo } = req.body;
		if (!name || !email) {
			return next(appError("400", "姓名與郵件欄位不可為空白！", next));
		}
		// check Email 格式
		if (!validator.isEmail(email)) {
			return next(appError("400", "Email 格式不正確", next));
		}
		const userInfo = await User.findByIdAndUpdate(req.user.id, {
			name: name,
			email: email,
			photo: photo,
		}).select("+email");

		console.log(userInfo);
		res.status(200).json({
			status: "success",
			data: userInfo,
		});
	},

	//  **** 變更帳號密碼
	async changePassword(req, res, next) {
		const { password, confirmPassword } = req.body;
		if (password !== confirmPassword) {
			return next(appError("400", "密碼不一致，請重新輸入!", next));
		}
		newPassword = await bcrypt.hash(password, 12);

		const user = await User.findByIdAndUpdate(req.user.id, {
			password: newPassword,
		});
		// console.log(user);
		jwtToken(user, 200, res);
	},
};

module.exports = users;

const jwt = require("jsonwebtoken");

function jwtToken(user, statusCode, res) {
	// 產生 JWT token
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_DAY,
	});
	user.password = undefined;
	res.status(statusCode).json({
		status: "success",
		user: {
			token,
			name: user.name,
		},
	});
}

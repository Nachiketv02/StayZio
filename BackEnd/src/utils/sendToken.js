module.exports.sendToken = (user, statusCode, message, res) => {
    const token = user.generateAuthToken();
    res
    .status(statusCode)
    .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    })
    .setHeader("Authorization", `Bearer ${token}`)
    .json({ user, token, message });
}

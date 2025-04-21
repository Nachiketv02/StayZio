const userModel = require("../../model/user/user.model");

module.exports.getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users) {
      return res.status(400).json({ message: "Users not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUser controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { fullName, email, phone, gender, password, role, isVerified, isHost } =
    req.body;
  try {
    let user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (phone && phone !== user.phone) {
      const existingUser = await userModel.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.role = role || user.role;
    user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;
    user.isHost = isHost !== undefined ? isHost : user.isHost;

    if (password) {
      user.password = await userModel.hashPassword(password);
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(200)
      .json({ message: "User updated successfully", user: userResponse });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).send("Server Error");
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).send("Server Error");
  }
};

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter your full name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    required: [true, "Please enter your gender"],
    enum: ["male", "female", "other"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    trim: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode : {
    type : Number,
  },
  verificationCodeExpiry : {
    type : Date
  },
  resetPasswordToken : {
    type : String
  },
  resetPasswordTokenExpiry : {
    type : Date
  },
  isHost : {
    type : Boolean,
    default : false
  },
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.generateVerificationCode = async function(){
    const code = crypto.randomInt(Math.pow(10, 3),Math.pow(10, 4)).toString();
    this.verificationCode = code;
    this.verificationCodeExpiry = Date.now() + 5 * 60 * 1000; //5 minutes
    return code;
}

userSchema.methods.generateResetPasswordToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTokenExpiry = Date.now() + 5 * 60 * 1000;
    return resetToken;
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
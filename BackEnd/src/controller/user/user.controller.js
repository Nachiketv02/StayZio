const userModel = require("../../model/user/user.model");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { sendEmail } = require("../../utils/sendEmail");
const { sendToken } = require("../../utils/sendToken");
const blackListTokenModel = require("../../model/user/blackListTokenModel.model");

function generateEmailVerificationLink(verificationCode, fullName) {
  return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Verification Code</title>
        <style>
          /* Base styles */
          body {
            margin: 0;
            padding: 0;
            background-color: #121212;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #e0e0e0;
            -webkit-font-smoothing: antialiased;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .email-wrapper {
            background-color: #1e1e1e;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
          }
          
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 30px 20px;
            text-align: center;
          }
          
          .logo {
            width: 120px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            letter-spacing: 1px;
          }
          
          .content {
            padding: 30px 40px;
          }
          
          h1 {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 20px;
          }
          
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #b0b0b0;
            margin-bottom: 24px;
          }
          
          .otp-container {
            background-color: #252525;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #333;
          }
          
          .otp-code {
            font-family: 'Courier New', monospace;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #ffffff;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
            padding: 10px 20px;
          }
          
          .expiry {
            font-size: 14px;
            color: #888;
            margin-top: 16px;
          }
          
          .footer {
            background-color: #171717;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          
          .social-links {
            margin-top: 20px;
            margin-bottom: 20px;
          }
          
          .social-link {
            display: inline-block;
            width: 32px;
            height: 32px;
            background-color: #333;
            border-radius: 50%;
            margin: 0 8px;
          }
          
          .help-text {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #333;
            font-size: 14px;
            color: #888;
          }
          
          @media only screen and (max-width: 480px) {
            .content {
              padding: 20px;
            }
            
            .otp-container {
              padding: 20px 10px;
            }
            
            .otp-code {
              font-size: 28px;
              letter-spacing: 6px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-wrapper">
            <div class="content">
              <h1>Verification Code</h1>
              <p>Hello ${fullName},</p>
              <p>We received a request to verify your account. Please use the verification code below to complete the process:</p>
              
              <div class="otp-container">
                <div class="otp-code">${verificationCode}</div>
                <div class="expiry">This code will expire in 5 minutes</div>
              </div>
              
              <p>If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.</p>
              
              <div class="help-text">
                <p>Need help? Contact our support team at <a href="mailto:support@stayzio.com" style="color: #4f46e5;">support@stayzio.com</a></p>
              </div>
            </div>
            
            <div class="footer">
              <p>© 2025 StayZio. All rights reserved.</p>
              <p>24-458, The Grand Plaza, VIP Road, Vesu, Surat, Gujarat 395007</p>
            </div>
          </div>
        </div>
      </body>
      </html>`;
}

const sendVerificationEmail = async (verificationCode, user, res) => {
  try {
    const message = generateEmailVerificationLink(
      verificationCode,
      user.fullName
    );
    sendEmail({ email: user.email, subject: "Your Verification Code", message });
    res.status(200).json({
      message: `Verification mail sent to ${user.fullName}`,
      user: user.email,
    });
  } catch (error) {
    console.log("Error sending verification email:", error.message);
  }
};

module.exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, phone, gender, password, confirmPassword } = req.body;

    if (!fullName || !email || !phone || !gender || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number already in use" });
    }
    const hashedPassword = await userModel.hashPassword(password);

    const newUser = await userModel.create({
      fullName,
      email,
      phone,
      gender,
      password: hashedPassword,
    });

    const verificationCode = await newUser.generateVerificationCode();
    await userModel.findByIdAndUpdate(newUser._id, { verificationCode });

    await sendVerificationEmail(verificationCode, newUser, res);

  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.verifyUser = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email, isVerified: false }).sort({createdAt: -1});
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if(user.verificationCodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();
    sendToken(user, 200, "User verified successfully", res);
  } catch (error) {
    console.error("Error in verifyUser controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const newVerificationCode = await user.generateVerificationCode();
    user.verificationCode = newVerificationCode;
    user.verificationCodeExpiry = Date.now() + 5 * 60 * 1000; //5 minutes
    await user.save();
    
    const message = generateEmailVerificationLink(newVerificationCode, user.fullName);
    sendEmail({ email: user.email, subject: "Your Verification Code", message });
    res.status(200).json({ message: "Verification code resent" });

  } catch (error) {
    console.error("Error in resendOtp controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return sendToken(user, 200, "User logged in successfully", res);

  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetPasswordToken = await user.generateResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;

    const message = `Click on the following link to reset your password: ${resetUrl}`;
    sendEmail({ email: user.email, subject: "Your Password Reset Code", message });
    res.status(200).json({ message: "Password reset code sent" });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({ resetPasswordToken, resetPasswordTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = await userModel.hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
    return sendToken(user, 200, "Password reset successfully", res);
  } catch (error) {
    console.error("Error in resetPassword controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const blackListToken = await blackListTokenModel.findOne({ token });
    if (blackListToken) {
      return res
        .status(401)
        .json({ error: "blackListToken find you are Unauthorized" });
    }
    await blackListTokenModel.create({ token });
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logoutUser Controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};



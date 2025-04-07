import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSpinner, FaCheck } from "react-icons/fa";
import { verifyOTP, resendOTP } from "../services/User/UserApi";
import { UserDataContext } from "../context/UserContex";

function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserData, setIsAuthenticated } =
    useContext(UserDataContext);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 4) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await resendOTP(location.state?.email);
      setTimeLeft(30);
      setCanResend(false);
      setError("");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = Number(otp.join(""));

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOTP(location.state?.email, verificationCode);
      setUserData(response.user);
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.token,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );
      setIsAuthenticated(true);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/", { state: { verified: true } });
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/login"
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 mx-4 sm:mx-0"
        >
          <FaArrowLeft className="mr-2" />
          Back to Login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10"
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {isSuccess
                ? "Verification Successful!"
                : "Enter Verification Code"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isSuccess ? (
                "Your account has been verified successfully!"
              ) : (
                <>
                  We've sent a 4-digit code to your email
                  <br />
                  <span className="font-medium">{location.state?.email}</span>
                </>
              )}
            </p>
          </div>

          {isSuccess ? (
            <div className="mt-8 flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <FaCheck className="w-8 h-8 text-green-600" />
              </motion.div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-2xl font-semibold border-2 rounded-lg focus:border-primary-500 focus:ring-primary-500"
                    initial={{ scale: 1 }}
                    whileFocus={{ scale: 1.05 }}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-600 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <FaSpinner className="w-5 h-5 animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </motion.button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-primary-600 hover:text-primary-500 font-medium"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-gray-500">
                      Resend code in {timeLeft}s
                    </span>
                  )}
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default OTPVerification;

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/slice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// Password validation helper
const validatePassword = (password: string) => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("at least 8 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("at least 1 uppercase letter");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("at least 1 special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? ["Password must contain " + errors.join(", ")] : [],
  };
};

const Login = () => {
  const navigate = useNavigate();
  const userRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");

    if (!user || !password) {
      setErrMsg("Please enter both email and password");
      return;
    }

    // Validate password format
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrMsg(passwordValidation.errors.join(", "));
      return;
    }

    try {
      // 1. Login → get access & refresh tokens
      const loginData = await login({ email: user, password }).unwrap();

      // Backend returns the token under loginData.data.token
      const accessToken = loginData.data.user.accessToken;

      // If no refresh token is provided, set it to null or skip it
      const refreshToken = loginData.data.user.refreshToken;

      // Backend also includes user inside loginData.data.user
      const userInfo = loginData.data.user;

      // 2. Save tokens to localStorage immediately
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // 3. Save everything to Redux
      dispatch(
        setCredentials({
          accessToken,
          refreshToken,
          user: userInfo,
        })
      );

      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err?.status === 401) {
        setErrMsg("Invalid email or password");
      } else if (err?.data?.message) {
        setErrMsg(err.data.message);
      } else {
        setErrMsg("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your travel journey
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Error Message */}
            {errMsg && (
              <div className="alert alert-error bg-red-50 border border-red-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-red-700">{errMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="your.email@example.com"
                  className={`input input-bordered w-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Password
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <label className="label">
                <span className="label-text-alt text-gray-500 text-xs">
                  8+ characters, 1 uppercase & 1 special character required
                </span>
              </label>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-warning"
                />
                <span className="label-text text-gray-600">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full bg-orange-400 hover:bg-orange-500 border-none text-white font-medium py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="spinner-orange-sm"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6 text-gray-500 text-sm">OR</div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 text-sm hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

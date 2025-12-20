import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import type { RegisterData } from "../types/auth";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    fullName: "",
    age: undefined,
    address: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({ ...formData, confirmPassword });

      if (response.success && response.user) {
        // Redirect to home page after successful registration
        navigate("/");
        // Optionally reload to update auth state across the app
        window.location.reload();
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Join the Journey
          </h1>
          <p className="text-gray-600">
            Create your account and start exploring
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
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
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Full Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input input-bordered w-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    errors.fullName ? "input-error" : ""
                  }`}
                  required
                />
              </div>
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.fullName}
                  </span>
                </label>
              )}
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`input input-bordered w-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    errors.email ? "input-error" : ""
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            {/* Age Field (Optional) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Age{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                  setFormData((prev) => ({ ...prev, age: value }));
                }}
                placeholder="Enter your age"
                min="1"
                max="120"
                className="input input-bordered w-full py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Address Field (Optional) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Address{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, Country"
                className="input input-bordered w-full py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`input input-bordered w-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    errors.password ? "input-error" : ""
                  }`}
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
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                  placeholder="Re-enter your password"
                  className={`input input-bordered w-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword}
                  </span>
                </label>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-warning"
                  required
                />
                <span className="label-text text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full bg-orange-400 hover:bg-orange-500 border-none text-white font-medium py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="spinner-orange-sm"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6 text-gray-500 text-sm">OR</div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
              >
                Sign in here
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

export default Register;

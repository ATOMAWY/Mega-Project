// Authentication service layer
// Currently uses localStorage for demo, but structured to easily switch to API calls
// When database is available, replace localStorage calls with API calls

import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  AuthState,
} from "../types/auth";

const AUTH_STATE_KEY = "auth_state";

// API endpoints (to be configured when backend is ready)
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
// const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
// const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;
// const LOGOUT_ENDPOINT = `${API_BASE_URL}/auth/logout`;

/**
 * Login user
 * Currently uses localStorage, but ready for API integration
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  // TODO: Replace with actual API call when backend is ready
  // Example:
  // try {
  //   const response = await fetch(LOGIN_ENDPOINT, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(credentials),
  //   });
  //
  //   if (!response.ok) {
  //     const error = await response.json();
  //     return { success: false, message: error.message || "Login failed" };
  //   }
  //
  //   const data = await response.json();
  //   const { user, token } = data;
  //
  //   // Store auth data
  //   localStorage.setItem(AUTH_TOKEN_KEY, token);
  //   localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  //
  //   return { success: true, user, token };
  // } catch (error) {
  //   console.error("Login error:", error);
  //   return { success: false, message: "Network error. Please try again." };
  // }

  // Demo implementation using localStorage
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user exists in localStorage (demo)
    const storedUsers = localStorage.getItem("demo_users");
    const users: Array<{ email: string; password: string; user: User }> =
      storedUsers ? JSON.parse(storedUsers) : [];

    const foundUser = users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!foundUser) {
      return { success: false, message: "Invalid email or password" };
    }

    // Generate demo token
    const token = `demo_token_${Date.now()}`;

    const authState: AuthState = {
      isAuthenticated: true,
      user: foundUser.user,
      token,
    };
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));

    return { success: true, user: foundUser.user, token };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
};

/**
 * Register new user
 */
export const register = async (data: RegisterData & { confirmPassword?: string }): Promise<AuthResponse> => {
  const API_URL = import.meta.env.VITE_API || "https://cairogo.runasp.net";
  
  try {
    // Validate required fields before sending
    if (!data.age || data.age < 13 || data.age > 120) {
      return { success: false, message: "Age must be between 13 and 120" };
    }
    
    if (!data.fullName?.trim()) {
      return { success: false, message: "Full name is required" };
    }
    
    if (!data.email?.trim()) {
      return { success: false, message: "Email is required" };
    }
    
    if (!data.password || data.password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters" };
    }

    // Ensure all required fields are present and properly formatted
    const requestBody = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      age: data.age,
      address: data.address?.trim() || "",
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const response = await fetch(`${API_URL}/api/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, message: errorData.message || "Registration failed" };
    }
    
    // Registration successful
    // Parse response if available, but don't require user/token for success
    const responseData = await response.json().catch(() => null);
    
    if (responseData) {
      // Adjust based on actual API response structure
      // Common patterns: { user, token } or { data: { user, token } }
      const user = responseData.user || responseData.data?.user;
      const token = responseData.token || responseData.data?.token;
      
      if (user && token) {
        const authState: AuthState = {
          isAuthenticated: true,
          user,
          token,
        };
        localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
        return { success: true, user, token };
      }
    }

    // Return success even if we don't have user/token data
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

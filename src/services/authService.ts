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
    const response = await fetch(`${API_URL}/api/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        age: data.age,
        address: data.address,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, message: errorData.message || "Registration failed" };
    }
    
    // The API response structure may vary, adjust based on actual response
    // Assuming the response contains user data and token

    return { success: false, message: "Invalid response from server" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

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

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";
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

    // Store auth data
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(foundUser.user));

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
 * Currently uses localStorage, but ready for API integration
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // TODO: Replace with actual API call when backend is ready
  // Example:
  // try {
  //   const response = await fetch(REGISTER_ENDPOINT, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  //
  //   if (!response.ok) {
  //     const error = await response.json();
  //     return { success: false, message: error.message || "Registration failed" };
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
  //   console.error("Registration error:", error);
  //   return { success: false, message: "Network error. Please try again." };
  // }

  // Demo implementation using localStorage
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    const storedUsers = localStorage.getItem("demo_users");
    const users: Array<{ email: string; password: string; user: User }> =
      storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((u) => u.email === data.email)) {
      return { success: false, message: "Email already registered" };
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      createdAt: new Date(),
    };

    // Store user (in real app, password would be hashed on backend)
    users.push({
      email: data.email,
      password: data.password, // In production, never store plain passwords
      user: newUser,
    });
    localStorage.setItem("demo_users", JSON.stringify(users));

    // Generate demo token
    const token = `demo_token_${Date.now()}`;

    // Store auth data
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));

    const authState: AuthState = {
      isAuthenticated: true,
      user: newUser,
      token,
    };
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));

    return { success: true, user: newUser, token };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  // TODO: Call logout endpoint when backend is ready
  // Example:
  // try {
  //   await fetch(LOGOUT_ENDPOINT, {
  //     method: "POST",
  //     headers: {
  //       "Authorization": `Bearer ${getToken()}`,
  //     },
  //   });
  // } catch (error) {
  //   console.error("Logout error:", error);
  // }

  // Clear local storage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(AUTH_STATE_KEY);
};

/**
 * Get current authentication token
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get current user data
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Get authentication state
 */
export const getAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    const state = localStorage.getItem(AUTH_STATE_KEY);
    if (state) {
      return JSON.parse(state);
    }
  } catch (error) {
    console.error("Error reading auth state:", error);
  }

  // Fallback: check token and user
  const token = getToken();
  const user = getCurrentUser();
  return {
    isAuthenticated: !!(token && user),
    user,
    token,
  };
};

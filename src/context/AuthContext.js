import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getItem, removeItem, setItem } from "../services/utils";
import {
    baseURL,
    LOGIN_URL,
    REGISTER_URL,
} from "../services/constants";
import toast from "react-hot-toast";

export const ApiContext = createContext();

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const ApiProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [jwt, setJWT] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!getItem("jwt"));
    const navigate = useNavigate();

    useEffect(() => {
        const token = getItem("jwt");
        const user = getItem("userData");
        if (token && user) {
            setJWT(token);
            setUserData(user);
            setIsLoggedIn(true);
        } else {
            setJWT(null);
            setUserData(null);
            setIsLoggedIn(false);
        }
    }, []);

    // Axios Interceptors for automatic header injection and error handling
    apiClient.interceptors.request.use(
        (config) => {
            const token = getItem("jwt");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            // console.log("Request:", config.method.toUpperCase(), config.url);
            return config;
        },
        (error) => {
            console.error("Request Error:", error);
            return Promise.reject(error);
        }
    );

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.error("Unauthorized! JWT might be invalid.");
                setJWT(null);
                removeItem(["jwt", "userData"]);
                navigate("/auth/login", { replace: true });
            }
            return Promise.reject(error);
        }
    );

    const login = async (email, password) => {
        try {
            const response = await apiClient.post(LOGIN_URL, {
                email,
                password,
            });
            if (response?.data?.meta?.success) {
                const { user, token } = response?.data?.result;
                let configObj = {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                };

                setJWT(token);
                setIsLoggedIn(true);
                setItem("userData", configObj);
                setItem("jwt", token);

                toast.success("Logged in successfully!");
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error("Login Error:", error);
            if (error?.status == 404) {
                toast.error("User not found. Please register.");
            } else {
                toast.error("Login Error");
            }
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await apiClient.post(REGISTER_URL, {
                name: name,
                email: email,
                password: password,
            });
            if (response?.data?.meta?.success) {
                toast.success("register in successfully!");
                navigate("/auth/login", { replace: true });
            }
        } catch (error) {
            console.error("register Error:", error);
            toast.error("register Error");
        }
    };

    // Logout function
    const logout = () => {
        setJWT(null);
        setUserData(null);
        removeItem(["jwt", "userData"]);
        toast.success("logout successfully!");
        navigate("/auth/login", { replace: true });
    };

    return (
        <ApiContext.Provider
            value={{
                jwt,
                userData,
                login,
                logout,
                register,
                isLoggedIn,
                apiClient
            }}
        >
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => useContext(ApiContext);
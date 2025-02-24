import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    _id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return null;

            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser._id && parsedUser.email) {
                return parsedUser;
            } else {
                localStorage.removeItem("user");
                return null;
            }
        } catch (error) {
            console.error("🚨 Error parsing stored user data:", error);
            localStorage.removeItem("user");
            return null;
        }
    });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser._id && parsedUser.email) {
                    setUser(parsedUser);
                } else {
                    localStorage.removeItem("user");
                }
            }
        } catch (error) {
            console.error("🚨 Error parsing stored user data:", error);
            localStorage.removeItem("user");
        }
    }, []);

    const login = (userData: User) => {
        console.log("✅ User logged in:", userData);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        console.log("🚪 User logged out");
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

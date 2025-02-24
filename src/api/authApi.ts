import axios from 'axios';

const API_URL = 'http://localhost:5002';

export const registerUser = async (email: string, password: string): Promise<void> => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });

        if (response.data && response.data._id && response.data.email) {
            localStorage.setItem("user", JSON.stringify(response.data)); // ✅ Store full user object
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
};

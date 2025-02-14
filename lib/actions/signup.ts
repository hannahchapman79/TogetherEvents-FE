import axios from "axios";

export const signUp = async (
  name: string,
  username: string,
  email: string,
  password: string,
  isAdmin: boolean,
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
      { name, username, email, password, isAdmin },
    );

    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

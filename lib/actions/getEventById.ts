import axios from "axios";

export const getEventById = async (eventId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

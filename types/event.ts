export interface Event {
  _id: string;
  title: string;
  description: string;
  image?: string;
  startDate: Date;
  endDate?: Date;
  location: {
    type: "physical" | "online" | "hybrid";
    address?: string;
    onlineLink?: string;
  };
  organiser: string;
  attendees: string[];
  status: "draft" | "published" | "cancelled" | "completed";
  maxAttendees?: number;
  category: string;
  createdAt: Date;
}

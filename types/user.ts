export interface User {
  user_id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  name?: string;
  eventsAttended?: string[];
  createdAt?: Date;
}

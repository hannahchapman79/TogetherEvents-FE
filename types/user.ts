export interface User {
    _id: string; 
    username: string;
    name: string;
    email: string;
    isAdmin: boolean;
    eventsAttended: string[]; 
    createdAt: Date;
  }
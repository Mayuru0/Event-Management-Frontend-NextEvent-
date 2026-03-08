export interface TicketType {
  _id: string;
  userId: string;
  organizerId: string;
  profilePic: string;
  name: string;
  event_title: string;
  totalPrice: number;
  date: string;
  event_type: string;
  location: string;
  quantity: number;
  status: string;
  timestamp?: string;
}

export interface OrganizerStats {
  totalTicketsSold: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  lastYearRevenue: number[];
  totalPurchases: number;
}

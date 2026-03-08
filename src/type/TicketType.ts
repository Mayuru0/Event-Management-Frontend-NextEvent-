export interface TicketType {
  _id: string;
  userId: string;
  organizerId: string;
  eventId?: string;
  profilePic: string;
  name: string;
  event_title: string;
  totalPrice: number;
  date: string;
  event_type: string;
  location: string;
  quantity: number;
  status: "pending" | "confirmed" | "cancelled";
  stripeSessionId?: string;
  timestamp?: string;
}

export interface OrganizerStats {
  totalTicketsSold: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  lastYearRevenue: number[];
  totalPurchases: number;
}

export interface CheckoutSessionRequest {
  title: string;
  ticket_price: number;
  quantity: number;
  userId: string;
  ticketId: string;
}

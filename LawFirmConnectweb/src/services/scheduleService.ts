import api from "./api";

export interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  attendees?: string;
  caseId?: string;
  status?: string;
  type?: string;
}

const getEvents = async (): Promise<CalendarEvent[]> => {
  const response = await api.get("/schedule");
  return response.data;
};

const createEvent = async (eventData: any): Promise<CalendarEvent> => {
  const response = await api.post("/schedule", eventData);
  return response.data;
};

const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/schedule/${id}`);
};

const scheduleService = {
  getEvents,
  createEvent,
  deleteEvent,
};

export default scheduleService;

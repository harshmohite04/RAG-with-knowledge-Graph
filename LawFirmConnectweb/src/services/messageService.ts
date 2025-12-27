import api from "./api";

export const messageService = {
  getMessages: async (contactId: string) => {
    const response = await api.get(`/messages/${contactId}`);
    return response.data;
  },

  sendMessage: async (contactId: string, content: string) => {
    const response = await api.post("/messages", { contactId, content });
    return response.data;
  },

  markAsRead: async (contactId: string) => {
    const response = await api.put(`/messages/read/${contactId}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/messages/unread/count");
    return response.data;
  },
};

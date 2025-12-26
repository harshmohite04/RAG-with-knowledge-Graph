import api from "./api";

export const contactService = {
  searchUsers: async (email: string) => {
    const response = await api.get(`/contact/search?email=${email}`);
    return response.data;
  },

  sendRequest: async (contactId: string) => {
    const response = await api.post("/contact/request", { contactId });
    return response.data;
  },

  getRequests: async () => {
    const response = await api.get("/contact/requests/pending");
    return response.data;
  },

  respondToRequest: async (requestId: string, action: "accept" | "reject") => {
    const response = await api.post(`/contact/request/${requestId}/respond`, {
      action,
    });
    return response.data;
  },

  addContact: async (contactId: string) => {
    const response = await api.post("/contact/add", { contactId });
    return response.data;
  },

  getContacts: async () => {
    const response = await api.get("/contact");
    return response.data;
  },
};

import axios from "axios";

const RAG_API_URL = "https://dc027f891ff6.ngrok-free.app";

const ragService = {
  /**
   * Ingests a document into the RAG system.
   * @param caseId The ID of the case.
   * @param file The file object to upload.
   */
  ingestDocument: async (caseId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseId", caseId);

    try {
      const response = await axios.post(`${RAG_API_URL}/ingest`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("RAG Ingestion failed:", error);
      throw error;
    }
  },

  /**
   * Sends a chat message to the RAG system.
   * (Replaces direct axios calls in CaseChat.tsx for cleaner code)
   */
  chat: async (caseId: string, message: string, top_k: number = 5) => {
    try {
      const response = await axios.post(`${RAG_API_URL}/chat`, {
        message,
        caseId,
        top_k,
      });
      return response.data;
    } catch (error) {
      console.error("RAG Chat failed:", error);
      throw error;
    }
  },

  getHistory: async (caseId: string) => {
    try {
      const response = await axios.get(`${RAG_API_URL}/chat/history/${caseId}`);
      return response.data; // Expected: { history: [{role: '', content: ''}] }
    } catch (error) {
      console.error("Fetch history failed:", error);
      throw error;
    }
  },
};

export default ragService;

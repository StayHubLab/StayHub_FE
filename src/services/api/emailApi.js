import apiClient from "./apiClient";

const emailApi = {
  /**
   * Send templated email
   * @param {string} email - Recipient email
   * @param {string} templateType - Email template type
   * @param {Object} templateData - Data for template
   * @returns {Promise<Object>} API response
   */
  sendTemplatedEmail: async (email, templateType, templateData = {}) => {
    try {
      const response = await apiClient.post("/email/send", {
        email,
        templateType,
        templateData,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending templated email:", error);
      throw error;
    }
  },

  /**
   * Send bill notification email to renter
   * @param {Object} billData - Bill data
   * @param {string} renterEmail - Renter email address
   * @returns {Promise<Object>} API response
   */
  sendBillNotification: async (billData, renterEmail) => {
    try {
      const templateData = {
        billId: billData.billId,
        renterName: billData.renterName || "Người thuê",
        roomName: billData.roomName || "N/A",
        roomAddress: billData.roomAddress || "Chưa cập nhật",
        totalAmount: billData.totalAmount || 0,
        amount: billData.amount || {
          rent: 0,
          electricity: 0,
          water: 0,
          service: 0,
        },
        dueDate: billData.dueDate,
        month: billData.month,
        year: billData.year,
        type: billData.type || "monthly",
        status: billData.status || "pending",
        note: billData.note || "",
        landlordName: billData.landlordName || "Chủ trọ",
        landlordPhone: billData.landlordPhone || "",
      };

      console.log("EmailApi - Template data being sent:", templateData);

      return await emailApi.sendTemplatedEmail(
        renterEmail,
        "BILL_NOTIFICATION",
        templateData
      );
    } catch (error) {
      console.error("Error sending bill notification:", error);
      throw error;
    }
  },

  /**
   * Send test email
   * @param {string} email - Recipient email
   * @returns {Promise<Object>} API response
   */
  sendTestEmail: async (email) => {
    try {
      const response = await apiClient.post("/email/test", { email });
      return response.data;
    } catch (error) {
      console.error("Error sending test email:", error);
      throw error;
    }
  },
};

export default emailApi;

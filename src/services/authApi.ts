const API = "/api";

export const authApi = {
  requestOTP: async (username: string) => {
    const res = await fetch(`${API}/request-reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    return res.json();
  },

  resetPassword: async (params: {
    username: string;
    otp: string;
    newPassword: string;
  }) => {
    const res = await fetch(`${API}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return res.json();
  },
};
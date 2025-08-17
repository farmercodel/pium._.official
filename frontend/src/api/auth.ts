import { api, setAccessToken } from "./api";

const todayYMD = () => new Date().toLocaleDateString("en-CA");

export type SignupBody = {
  email: string;
  password: string;
  business_registration_number: string;
  p_nm: string;
  start_dt?: string;
};

export async function signup(body: SignupBody) {
  const payload = {
    ...body,
    start_dt: body.start_dt ?? todayYMD(),
  };

  console.log("signup payload", payload);

  const { data } = await api.post("/api/auth/register", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function login(body: { email: string; password: string }) {
  const { data } = await api.post<{ access_token: string }>(
    "/api/auth/login",
    body,
    { headers: { "Content-Type": "application/json" } }
  );
  setAccessToken(data.access_token);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/api/auth/me");
  return data; 
}

export function logout() {
  setAccessToken(null);
  window.location.href = "/";
}
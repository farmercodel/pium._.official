// src/api/generate.ts
import { api } from "./api";
import type { GenerateAdRequest } from "../types/SurveyTypes";

export async function generateAds(payload: GenerateAdRequest) {
  const { data } = await api.post("/generate", payload);
  return data;
}
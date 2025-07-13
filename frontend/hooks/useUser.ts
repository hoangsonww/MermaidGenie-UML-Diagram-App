"use client";
import useSWR from "swr";
import api from "../lib/api";

export default function useUser() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const fetcher = (url: string) =>
    api
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.data);
  const { data, error, mutate } = useSWR(
    token ? "/api/auth/me" : null,
    fetcher,
  );
  return {
    user: data as any,
    loading: !error && !data,
    mutate,
  };
}

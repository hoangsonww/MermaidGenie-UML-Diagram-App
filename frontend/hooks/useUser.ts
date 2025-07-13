"use client";
import useSWR from "swr";
import api from "../lib/api";

export default function useUser() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const shouldFetch = Boolean(token);

  const { data, error, mutate } = useSWR(
    shouldFetch ? "/api/auth/me" : null,
    (url) =>
      api
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.data),
  );

  return {
    user: shouldFetch ? data : null,
    loading: shouldFetch && !error && !data,
    mutate,
  };
}

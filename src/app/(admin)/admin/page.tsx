"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BlurText from "../../../components/ui/BlurText/BlurText";
import axiosInstance from "@/lib/axios";

const AdminPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axiosInstance.post("/auth/login", { email, password });
      router.push("/admin/YzIxNGRmN2U5MzY=");
      router.refresh();
    } catch (error: unknown) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "status" in error.response &&
        typeof error.response.status === "number"
          ? error.response.status
          : undefined;

      setError(
        status === 429
          ? "Too many sign-in attempts. Please try again later."
          : status === 503
            ? "Sign-in is temporarily unavailable. Please try again later."
            : "Invalid email address or password."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center">
        <BlurText
          className="text-4xl mb-8 text-center w-xl"
          text="Is that really you boss?!"
        />

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 w-full rounded-lg shadow-lg border border-slate-800 transition-all hover:shadow-xl hover:shadow-slate-900/30"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-slate-400 mb-2 text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Are you an imposter?"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-slate-400 mb-2 text-sm"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-all ${
              isLoading
                ? "bg-blue-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;

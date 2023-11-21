"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/app/lib/database.types";
import Indicator from "./Indicator";

const SigninComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [indicatorMsg, setIndicatorMsg] = useState("");
  const [indicatorStatus, setIndicatorStatus] = useState(true);

  const supabase2 = createClientComponentClient<Database>();

  const handleTimeout = () => {
    setTimeout(() => {
      setIndicatorMsg("");
      setIndicatorStatus(true);
    }, 2500);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // console.log("email", email);
    // console.log("pass", password);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        // email: "shaunniel02@gmail.com",
        // password: "Xv#6nT@YLevL3p#",
        email: email,
        password: password,
      });

      if (error) {
        setIndicatorMsg(`Login failed: ${error.message}`);
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        setEmail("");
        setPassword("");
        await supabase.auth.setSession(data.session);
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <>
      {indicatorMsg && (
        <Indicator msg={indicatorMsg} status={indicatorStatus} />
      )}
      <div className="min-h-[100dvh] flex items-center justify-center bg-purple-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 ">
          <div className="flex flex-col items-center mt-[-5rem]">
            <Image src="/LCO Logo.svg" alt="CSS Logo" width={80} height={80} />
            <h1 className="mt-2 text-center text-2xl font-extrabold text-gray-900">
              CSS Attendance System
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">Sign in</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm space-y-2">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full p-3 bg-purple-50 border border-purple-600 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full p-3 bg-purple-50 border border-purple-600 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center p-3 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Sign in
              </button>
            </div>
          </form>
        </div>
        <div className="absolute bottom-5 text-center">
          <h3 className="text-xs font-semibold">Est. 2023 - 2024</h3>
          <h3 className="text-xs text-gray-600">
            CSU - Computer Science Society
          </h3>
        </div>
      </div>
    </>
  );
};

export default SigninComponent;

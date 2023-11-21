"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Settings } from "react-feather";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/app/lib/database.types";
import { useEffect, useState } from "react";
import Indicator from "./Indicator";
import { supabaseAdmin } from "@/utils/supabase";
import { supabase } from "@/utils/supabase";

const SettingsComponent = () => {
  const [initialEmail, setInitialEmail] = useState("");
  const [email, setEmail] = useState("");
  const [isEditEmail, setIsEditEmail] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [indicatorMsg, setIndicatorMsg] = useState("");
  const [indicatorStatus, setIndicatorStatus] = useState(true);

  const router = useRouter();

  const supabase2 = createClientComponentClient<Database>();

  const handleTimeout = () => {
    setTimeout(() => {
      setIndicatorMsg("");
      setIndicatorStatus(true);
    }, 2500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        // setCurrentUser(user? || null);
        setInitialEmail(user?.email || "");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, []);

  const handleNewEmailSubmission = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) {
        // console.error("Error updating email:", error.message);
        setIndicatorMsg("An error occurred while changing the email.");
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        // console.log("Email updated successfully");
        setIndicatorMsg("Check email for confirmation of change.");
        setIndicatorStatus(true);
        handleTimeout();

        // setCreateEmail("");
        // setCreatePassword("");

        await supabase.auth.signOut();
        router.refresh();
        router.push("/signin");
      }
    } catch (error) {
      // console.error("Error updating email:", (error as Error).message);
      setIndicatorMsg("An error occurred while changing the email.");
      setIndicatorStatus(false);
      handleTimeout();
    }
  };

  const handleNewAccount = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setIsCreatingAccount(true);

    try {
      const { data: user, error } = await supabase.auth.admin.createUser({
        email: createEmail,
        password: createPassword,
        email_confirm: true,
      });

      if (error) {
        setIsCreatingAccount(false);

        // console.error("Error creating account:", error.message);
        setIndicatorMsg("An error occurred while creating the account.");
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        // console.log("Account created successfully.");
        setIndicatorMsg("Account created successfully.");
        setIndicatorStatus(true);
        handleTimeout();
        setIsCreatingAccount(false);
        setCreateEmail("");
        setCreatePassword("");

        // router.push("/signin");
      }
    } catch (error) {
      setIsCreatingAccount(false);

      // console.error("Error creating account:", (error as Error).message);
      setIndicatorMsg("An error occurred while creating the account.");
      setIndicatorStatus(false);
      handleTimeout();
    }
  };

  const handleNewPasswordSubmission = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    if (newPassword === confirmNewPassword) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          // console.error("Error updating password:", error.message);
          setIndicatorMsg("An error occurred while changing the password.");
          setIndicatorStatus(false);
          handleTimeout();
        } else {
          setIndicatorMsg("Successfully changed password.");
          setIndicatorStatus(true);
          handleTimeout();

          setNewPassword("");
          setConfirmNewPassword("");

          await supabase.auth.signOut();
          router.push("/signin");
        }
      } catch (error) {
        // console.error("Error updating password:", (error as Error).message);
        setIndicatorMsg("An error occurred while changing the password.");
        setIndicatorStatus(false);
        handleTimeout();
      }
    } else {
      // console.log("Passwords do not match.");
      setIndicatorMsg("Passwords do not match.");
      setIndicatorStatus(false);
      handleTimeout();
    }
  };

  return (
    <>
      {indicatorMsg && (
        <Indicator msg={indicatorMsg} status={indicatorStatus} />
      )}

      <div className="container mx-auto min-h-[80dvh] w-screen flex flex-col py-5">
        <div className="z-50 mx-5 my-5 flex justify-between">
          <button
            className="bg-purple-600 rounded-full px-4 py-2 text-white inline-flex items-center"
            onClick={() => router.push("/attendance")}>
            <ArrowLeft />
          </button>
        </div>
        <div className="px-5 w-full flex flex-col space-y-8">
          <div className="flex flex-col space-y-5">
            <div>
              <h1 className="font-semibold text-lg">Profile Information</h1>
              <div className="w-full px-5 border border-purple-600" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between md:items-center">
              <h1>Current User Email </h1>
              {!isEditEmail ? (
                <div className="flex items-center space-x-5">
                  {initialEmail && (
                    <h1 className="font-semibold flex-grow">{initialEmail}</h1>
                  )}
                  <button
                    className="text-blue-500 text-[12px]"
                    onClick={() => setIsEditEmail(!isEditEmail)}>
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center space-x-5 space-y-1 md:space-y-0">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter new email"
                    className="w-full bg-gray-200 bg-opacity-30 rounded-[10px] border border-purple-500 px-5 py-2"
                  />
                  <div className="flex flex-row space-x-2 items-end justify-end">
                    <button
                      className={`text-[12px] text-left ${
                        email === initialEmail || email.trim() === ""
                          ? "text-gray-500 "
                          : "text-purple-500 "
                      }`}
                      onClick={handleNewEmailSubmission}
                      disabled={email === initialEmail || email.trim() === ""}>
                      Change
                    </button>
                    <button
                      className="text-red-500 text-[12px] text-left"
                      onClick={() => setIsEditEmail(!isEditEmail)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between md:items-center">
                <h1 className="">New Password</h1>
                <input
                  type="password"
                  name="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
                  className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-purple-500 px-5 py-2"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between md:items-center">
                <h1 className="">Confirm New Password</h1>
                <input
                  type="password"
                  name="confirm_new_password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  placeholder="Re-enter your new password"
                  className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-purple-500 px-5 py-2"
                />
              </div>
              <div className="flex justify-between">
                <div />
                <button
                  className={`rounded-[10px] border border-purple-500 px-5 py-2 ${
                    newPassword === "" || confirmNewPassword === ""
                      ? "bg-gray-300"
                      : "bg-purple-400"
                  }`}
                  onClick={handleNewPasswordSubmission}
                  disabled={newPassword === "" || confirmNewPassword === ""}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            <div>
              <h1 className="font-semibold text-lg">
                Account Creation for New User
              </h1>
              <h2 className="text-[13px] italic text-justify text-blue-500">
                Note: When you create a new account, the new user must confirm
                the link sent to their email address before they can log in.
              </h2>
              <div className="w-full px-5 border border-purple-600" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between md:items-center">
                <h1 className="">Email</h1>
                <input
                  type="email"
                  name="create_email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  required
                  placeholder="Enter email"
                  className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-purple-500 px-5 py-2"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between md:items-center">
                <h1 className="">Password</h1>
                <input
                  type="password"
                  name="create_password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-purple-500 px-5 py-2"
                />
              </div>
              <div className="flex justify-between">
                <div />
                <button
                  className={`rounded-[10px] border border-purple-500 px-5 py-2 ${
                    createPassword === "" ||
                    createEmail === "" ||
                    isCreatingAccount
                      ? "bg-gray-300"
                      : "bg-purple-400"
                  }`}
                  onClick={handleNewAccount}
                  disabled={
                    createPassword === "" ||
                    createEmail === "" ||
                    isCreatingAccount
                  }>
                  {isCreatingAccount ? "Checking ..." : " Create Account"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-5 pb-5">
            <div>
              <h1 className="font-semibold text-lg">Settings</h1>
              <div className="w-full px-5 border border-purple-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="">Sign-out User</h1>
                <div className="self-end">
                  <button
                    className="rounded-[10px] bg-red-500 border  hover:text-white hover:bg-red-600 px-5 py-2 hover:scale-110 transition delay-75 duration-500 ease-in-out"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.refresh();
                      router.push("/signin");
                    }}>
                    Logout
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <h1 className="">Enable attendance</h1>
                <div className="self-end">
                  <button
                    className="rounded-[10px] bg-purple-500 border  hover:text-white hover:bg-purple-600 px-5 py-2 hover:scale-110 transition delay-75 duration-500 ease-in-out"
                    onClick={async () => {
                      // await supabase.auth.signOut();
                      // router.refresh();
                      // router.push("/signin");
                    }}>
                    Activate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsComponent;

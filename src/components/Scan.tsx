"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Type, Grid, Sunrise, Sunset, Hash } from "react-feather";
import {
  checkAttendanceTimeInListData,
  checkAttendanceTimeOutListData,
  insertAttendanceListData,
  updateAttendanceListData,
} from "@/api/attendance_list_data";
import { fetchSettingsListData } from "@/api/settings_data";
import { supabase } from "@/utils/supabase";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  idNumber: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIdNumber: React.Dispatch<React.SetStateAction<string>>;
  handleScanResult: (idNumber: string) => void;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  idNumber,
  handleInputChange,
  setIdNumber,
  handleScanResult,
}) => {
  const handleSend = () => {
    handleScanResult(idNumber);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[100] transition-opacity container mx-auto px-3 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      <div className="bg-white p-4 shadow-md rounded-lg flex flex-col z-[110] gap-3">
        <input
          type="text"
          placeholder="000-00000"
          className="w-full p-2 border rounded-md text-6xl text-center"
          value={idNumber}
          onChange={handleInputChange}
          // onKeyDown={handleEnterKey}
        />

        <div className="w-full flex justify-end space-x-3 text-lg">
          <button
            onClick={onClose}
            className="w-full p-2 bg-red-600 text-white rounded-md">
            Close
          </button>
          <button
            onClick={handleSend}
            className="w-full p-2 bg-purple-600 text-white rounded-md">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const Scan = () => {
  const router = useRouter();

  const [result, setResult] = useState("");
  const [color, setColor] = useState("purple");
  const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);
  const [displayScanResult, setDisplayScanResult] = useState(false);
  const [isTimeIn, setIsTimeIn] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idNumber, setIdNumber] = useState("");

  const [messagePrompt, setMessagePrompt] = useState("");
  const [isAttendanceEnable, setIsAttendanceEnable] = useState(false);
  const [session, setSession] = useState(1);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= 8) {
      let formattedValue = numericValue;

      if (numericValue.length > 3) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
      }

      setIdNumber(formattedValue);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIdNumber("");
  };

  const getLocalDateTimeAndDate = () => {
    const now = new Date();
    const timezoneOffsetInHours = now.getTimezoneOffset() / 60;
    now.setHours(now.getHours() - timezoneOffsetInHours);
    const localDateTime = now.toISOString().slice(0, 19).replace("T", " ");
    const localDate = now.toISOString().slice(0, 10);
    return { localDateTime, localDate };
  };

  const handleScanResult = async (idNumber: string) => {
    if (!idNumber) return;
    if (!isAttendanceEnable) return;

    const { localDateTime, localDate } = getLocalDateTimeAndDate();

    const audio = new Audio("scanner-beep.mp3");
    audio.play();

    setResult(idNumber);
    setIsQRCodeDetected(true);

    const { data: existingTimeInData } = await checkAttendanceTimeInListData(
      idNumber,
      localDate,
      session
    );

    const { data: existingTimeOutData } = await checkAttendanceTimeOutListData(
      idNumber,
      localDate,
      session
    );

    if (isTimeIn) {
      if (existingTimeInData.length > 0) {
        setMessagePrompt("Already Timed-In!");
      } else {
        const newAttendanceData = [
          {
            id_number: idNumber,
            time_in: localDateTime,
            time_out: null,
            session: session,
          },
        ];

        await insertAttendanceListData(newAttendanceData);
        setMessagePrompt("Successfully Time-In!");
      }
    } else {
      if (existingTimeOutData.length > 0) {
        setMessagePrompt("Already Timed-Out!");
      } else if (
        existingTimeInData.length > 0 &&
        existingTimeOutData.length === 0
      ) {
        const updateAttendanceData = [
          {
            time_out: localDateTime,
          },
        ];

        await updateAttendanceListData(
          idNumber,
          localDate,
          updateAttendanceData,
          session
        );
        setMessagePrompt("Successfully Time-Out!");
      } else {
        setMessagePrompt("Not yet timed-in!");
      }
    }
    setDisplayScanResult(true);

    // // Check if 'attendance_data' exists in localStorage
    // const existingData = localStorage.getItem("attendance_data");
    // if (existingData) {
    //   // If it exists, parse the data, append the new data, and update the localStorage
    //   const parsedData = JSON.parse(existingData);
    //   parsedData.push({ data, time_in_datetime, time_out_datetime });
    //   localStorage.setItem("attendance_data", JSON.stringify(parsedData));
    // } else {
    //   // If it doesn't exist, create a new localStorage item with an array containing the data
    //   const initialData = [{ data, time_in_datetime, time_out_datetime }];
    //   localStorage.setItem("attendance_data", JSON.stringify(initialData));
    // }
  };

  const memoizedFetchSettingsData = useCallback(async () => {
    try {
      const { data, error } = await fetchSettingsListData();
      setIsAttendanceEnable(data[0].isAttendanceEnable);
      // setSession(data[0].session);
      // console.log("data", data[0]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, []);

  useEffect(() => {
    memoizedFetchSettingsData();

    const channel = supabase
      .channel("realtime settings")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings" },
        (payload) => {
          console.log("payload", payload);
          if (payload.new) {
            setIsAttendanceEnable(payload.new.isAttendanceEnable);
            setSession(payload.new.session);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memoizedFetchSettingsData]);

  // useEffect(() => {
  //   const fetchSettingsData = async () => {
  //     try {
  //       const { data, error } = await fetchSettingsListData();

  //       if (error) {
  //         console.error("Error fetching data:", error);
  //       } else {
  //         setIsAttendanceEnable(data[0].isAttendanceEnable);
  //         setSession(data[0].session);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };

  //   fetchSettingsData();

  //   const channel = supabase
  //     .channel(`realtime sessions`)
  //     .on(
  //       "postgres_changes",
  //       { event: "UPDATE", schema: "public", table: "settings" },
  //       (payload) => {
  //         if (payload.new) {
  //           setIsAttendanceEnable(payload.new.isAttendanceEnable);
  //           setSession(payload.new.session);
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []);

  // const memoizedFetchSettingsData = useMemo(() => fetchSettingsData, []);

  // useEffect(() => {
  //   memoizedFetchSettingsData();
  // }, [memoizedFetchSettingsData]);

  useEffect(() => {
    const storedAttendanceOption = localStorage.getItem("attendanceOption");

    setIsTimeIn(
      storedAttendanceOption ? storedAttendanceOption === "true" : true
    );
  }, []);

  const handleAttendanceOptionChange = () => {
    setIsTimeIn(!isTimeIn);
    const value = !isTimeIn;
    localStorage.setItem("attendanceOption", JSON.stringify(value));
  };

  useEffect(() => {
    if (isQRCodeDetected) {
      setColor("rgba(0, 255, 0, 0.5)"); //green
      let timer = setTimeout(() => {
        setIsQRCodeDetected(false);
        setColor("purple");
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }

    if (displayScanResult) {
      let timer = setTimeout(() => {
        setDisplayScanResult(false);
      }, 3500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isQRCodeDetected, displayScanResult]);

  return (
    <>
      <div className="flex justify-center items-center h-[100svh] select-none overflow-y-hidden">
        <QrScanner
          viewFinder={(props) => (
            <div className="flex flex-col items-center justify-center absolute w-full h-full top-0 left-0 z-10">
              <svg
                viewBox="0 0 100 100"
                className="z-20 w-24 h-24 transform scale-[3]  md:scale-[7]">
                <path
                  fill="none"
                  d="M23,0 L0,0 L0,23"
                  stroke={color}
                  strokeWidth="5"
                />
                <path
                  fill="none"
                  d="M0,77 L0,100 L23,100"
                  stroke={color}
                  strokeWidth="5"
                />
                <path
                  fill="none"
                  d="M77,100 L100,100 L100,77"
                  stroke={color}
                  strokeWidth="5"
                />
                <path
                  fill="none"
                  d="M100,23 L100,0 77,0"
                  stroke={color}
                  strokeWidth="5"
                />
              </svg>
            </div>
          )}
          scanDelay={1000}
          onDecode={(result) => handleScanResult(result)}
          onError={(error) => console.log(error?.message)}
          containerStyle={{
            width: "100%",
            height: "100%",
          }}
          videoStyle={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
        <div
          className={`${
            isAttendanceEnable ? "justify-between" : "justify-end"
          } container mx-auto z-30 absolute top-5 w-full px-3 flex `}>
          {isAttendanceEnable && (
            <div className=" z-50 text-white self-center space-x-2 flex">
              <button
                className={`
                  bg-purple-600 rounded-full px-2 py-1`}
                onClick={handleAttendanceOptionChange}>
                {isTimeIn ? "IN" : "OUT"}
              </button>
              {/* <button
                className={`${
                  isTimeIn ? "bg-purple-600" : "bg-purple-200"
                } rounded-full px-2 py-1`}
                onClick={() => handleAttendanceOptionChange(true)}>
                <Sunrise />
              </button>
              <button
                className={`${
                  !isTimeIn ? "bg-purple-600" : "bg-purple-200"
                } rounded-full px-2 py-1`}
                onClick={() => handleAttendanceOptionChange(false)}>
                <Sunset />
              </button> */}
              <h3 className="bg-purple-600 rounded-full px-3 py-1">
                {session === 1 ? "AM" : "PM"}
              </h3>
            </div>
          )}

          <div className="space-x-2">
            {isAttendanceEnable && (
              <button
                className=" bg-purple-600 text-white rounded-full px-4 py-2"
                onClick={() => isAttendanceEnable && openModal()}>
                <Hash />
              </button>
            )}
            <button
              className="bg-purple-600 text-white rounded-full px-4 py-2 text-xs"
              onClick={() => router.push("/attendance")}>
              <Grid />
            </button>
          </div>
        </div>
        {displayScanResult && (
          <div className=" z-50 absolute bottom-16 text-center text-white shadow-xl space-y-5">
            <p className="text-xs">
              <span className="text-sm">{result}</span> <br />
              {messagePrompt}
            </p>
          </div>
        )}

        {!isAttendanceEnable && (
          <div className="flex flex-col items-center justify-center absolute  w-full h-full top-0 left-0 z-5 text-3xl text-white">
            <h4 className="flex flex-col text-center">
              Attendance
              <span className="font-bold text-red-600">DEACTIVATED!</span>{" "}
            </h4>
          </div>
        )}

        <p className="z-50 absolute bottom-3 bg-purple-600 rounded-full px-2 py-1 text-xs">
          Created by <span className=" font-bold">Shaun Niel Ochavo</span>
        </p>
      </div>

      <SimpleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        idNumber={idNumber}
        handleInputChange={handleInputChange}
        setIdNumber={setIdNumber}
        handleScanResult={handleScanResult}
      />
    </>
  );
};

export default Scan;

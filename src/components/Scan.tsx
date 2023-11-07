"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrScanner } from "@yudiel/react-qr-scanner";

const Scan = () => {
  const router = useRouter();

  const [result, setResult] = useState("");
  const [color, setColor] = useState("purple");
  const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);
  const [displayScanResult, setDisplayScanResult] = useState(false);
  const [isTimeIn, setIsTimeIn] = useState(true);

  const handleScanResult = (data: string) => {
    if (data) {
      const audio = new Audio("scanner-beep.mp3");
      audio.play();

      const time_in_datetime = "2023-11-06 04:05:06";
      const time_out_datetime = "2023-11-06 04:05:06";

      setResult(data);
      setIsQRCodeDetected(true);
      setDisplayScanResult(true);

      // Check if 'attendance_data' exists in localStorage
      const existingData = localStorage.getItem("attendance_data");
      if (existingData) {
        // If it exists, parse the data, append the new data, and update the localStorage
        const parsedData = JSON.parse(existingData);
        parsedData.push({ data, time_in_datetime, time_out_datetime });
        localStorage.setItem("attendance_data", JSON.stringify(parsedData));
      } else {
        // If it doesn't exist, create a new localStorage item with an array containing the data
        const initialData = [{ data, time_in_datetime, time_out_datetime }];
        localStorage.setItem("attendance_data", JSON.stringify(initialData));
      }
      console.log(
        "Data stored in localStorage:",
        data,
        time_in_datetime,
        time_out_datetime
      );
    }
  };

  useEffect(() => {
    const storedAttendanceOption = localStorage.getItem("attendanceOption");

    console.log("storedAttendanceOption1 ", storedAttendanceOption);
    setIsTimeIn(
      storedAttendanceOption ? storedAttendanceOption === "true" : true
    );
  }, []);

  const handleAttendanceOptionChange = (value: boolean) => {
    console.log("truth value: ", value);
    setIsTimeIn(value);
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
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isQRCodeDetected, displayScanResult]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-[100vh]">
        <QrScanner
          viewFinder={(props) => (
            <div className="flex flex-col items-center justify-center absolute w-[100%] h-[100%] top-0 left-0">
              <svg
                viewBox="0 0 100 100"
                className=" z-[100] w-24 h-24 transform scale-[3]  md:scale-[7]">
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
              <div className=" z-50 absolute top-5 w-full px-3 flex justify-between">
                <div className=" z-50 text-white self-center space-x-2">
                  <button
                    className={`${
                      isTimeIn ? "bg-purple-600" : "bg-purple-200"
                    } rounded-full px-2 py-1`}
                    onClick={() => handleAttendanceOptionChange(true)}>
                    Time-in
                  </button>
                  <button
                    className={`${
                      !isTimeIn ? "bg-purple-600" : "bg-purple-200"
                    } rounded-full px-2 py-1`}
                    onClick={() => handleAttendanceOptionChange(false)}>
                    Time-out
                  </button>
                </div>
                <button
                  className="bg-purple-600 text-white rounded-full px-4 py-2 text-xs"
                  onClick={() => router.push("/attendance")}>
                  Menu
                </button>
              </div>
              {displayScanResult && (
                <div className=" z-50 absolute bottom-5 text-center text-white shadow-xl">
                  <p className="text-xs">
                    <span className="text-sm">{result}</span> <br />
                    Attendance Checked!
                  </p>
                </div>
              )}
            </div>
          )}
          scanDelay={1000}
          onDecode={(result) => handleScanResult(result)}
          onError={(error) => console.log(error?.message)}
          containerStyle={{
            width: "100%",
            height: "100vh",
          }}
          videoStyle={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Scan;

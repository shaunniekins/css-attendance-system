"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Type, Grid, Sunrise, Sunset, Hash } from "react-feather";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  idNumber: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIdNumber: React.Dispatch<React.SetStateAction<string>>;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  idNumber,
  handleInputChange,
  setIdNumber,
}) => {
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
            className="w-full p-2 bg-purple-600 text-white rounded-md">
            Send
          </button>
          <button
            onClick={onClose}
            className="w-full p-2 bg-red-600 text-white rounded-md">
            Close
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
      <div className="flex justify-center items-center h-[100vh] select-none">
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
                <div className=" z-50 text-white self-center space-x-2 flex">
                  <button
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
                  </button>
                </div>
                <div className="space-x-2">
                  <button
                    className=" bg-purple-600 text-white rounded-full px-4 py-2"
                    onClick={openModal}>
                    <Hash />
                  </button>
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
                    Attendance Checked!
                  </p>
                </div>
              )}
              <p className="z-50 absolute bottom-3 bg-purple-600 rounded-full px-2 py-1 text-xs">
                Created by <span className=" font-bold">Shaun Niel Ochavo</span>
              </p>
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
      <SimpleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        idNumber={idNumber}
        handleInputChange={handleInputChange}
        setIdNumber={setIdNumber}
      />
    </div>
  );
};

export default Scan;

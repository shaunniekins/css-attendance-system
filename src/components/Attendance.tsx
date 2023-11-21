"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Settings } from "react-feather";

import { fetchAttendanceListData } from "@/api/attendance_list_data";

interface Item {
  id_number: string;
  time_in: Date;
  time_out: Date;
}

const AttendanceComponent = () => {
  const router = useRouter();
  const [idNumber, setIdNumber] = useState("");
  const [attendanceData, setAttendanceDate] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;

  const headerNames = ["ID Number", "Time In", "Time Out"];

  const fetchAttendanceData = async () => {
    try {
      const { data, error } = await fetchAttendanceListData(
        entriesPerPage,
        currentPage,
        idNumber
      );
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setAttendanceDate(data as never[]);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Memoize the data-fetching functions
  const memoizedFetchAttendanceData = useMemo(
    () => fetchAttendanceData,
    [entriesPerPage, currentPage, idNumber]
  );

  useEffect(() => {
    // Call the memoized fetchData function when inputs change
    memoizedFetchAttendanceData();
  }, [memoizedFetchAttendanceData]);

  const handleIdNumberChange = (e: any) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= 8) {
      let formattedValue = numericValue;

      if (numericValue.length > 3) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
      }

      setIdNumber(formattedValue);
    }
  };

  return (
    <div className="container mx-auto min-h-[80dvh] w-screen flex flex-col">
      <div className="z-50 mx-5 my-5 flex justify-between">
        <button
          className="bg-purple-600 rounded-full px-4 py-2 text-white inline-flex items-center"
          onClick={() => router.push("/")}>
          <ArrowLeft />
        </button>
        <button
          className="bg-purple-600 rounded-full px-4 py-2 text-white"
          onClick={() => router.push("/settings")}>
          <Settings />
        </button>
      </div>
      <div className="px-5 w-full flex flex-col space-y-8">
        <input
          type="text"
          value={idNumber}
          onChange={handleIdNumberChange}
          placeholder="Search ID"
          className="w-full border border-purple-600 rounded-full pl-3 py-2"
        />
        <div className="w-full overflow-x-auto rounded-t-3xl h-[70dvh]">
          <table className="w-full text-sm text-center">
            <thead className="text-xs uppercase bg-purple-600 text-white">
              <tr>
                {headerNames.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item: Item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-green-700 hover:bg-green-300">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap font-mono">
                    {item.id_number}
                  </th>

                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.time_in && !isNaN(new Date(item.time_in).valueOf())
                      ? new Intl.DateTimeFormat("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        }).format(new Date(item.time_in))
                      : ""}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.time_out !== null
                      ? new Intl.DateTimeFormat("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        }).format(new Date(item.time_out))
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-4 flex self-end justify-end select-none">
        <button
          className={`${
            currentPage === 1
              ? "bg-white text-white"
              : "bg-[#357112] text-white"
          } rounded-3xl py-2 px-5 mx-2`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}>
          {"<"}
        </button>
        <button
          className={`
          ${
            attendanceData.length < entriesPerPage
              ? "bg-white text-white"
              : "bg-[#357112] text-white"
          }
         
           rounded-3xl py-2 px-5 mx-2`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={attendanceData.length < entriesPerPage}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceComponent;

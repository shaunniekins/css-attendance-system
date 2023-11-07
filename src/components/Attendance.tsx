"use client";

import { useRouter } from "next/navigation";

const AttendanceComponent = () => {
  const router = useRouter();

  const headerNames = ["ID Number", "Time-in", "Time-out"];

  return (
    <div className="container mx-auto min-h-[80dvh] w-screen flex flex-col">
      <div className=" z-50 mx-5 my-5 flex justify-between">
        <button
          className="bg-purple-600 rounded-full px-4 py-2 text-xs text-white"
          onClick={() => router.push("/")}>
          {"< "} Scan
        </button>
        <button className="bg-purple-600 rounded-full px-4 py-2 text-xs text-white">
          Settings
        </button>
      </div>
      <div className="px-5 w-full flex flex-col space-y-8">
        <input
          type="text"
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
              <tr className="bg-white border-b border-green-700 hover:bg-green-300">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap font-mono">
                  id
                </th>

                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  others
                </td>

                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  tim
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceComponent;

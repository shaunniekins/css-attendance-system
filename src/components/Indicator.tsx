import React from "react";

interface IndicatorProps {
  msg: string;
  status: boolean;
}

const Indicator: React.FC<IndicatorProps> = ({ msg, status }) => {
  const backgroundColor = status ? "bg-purple-500" : "bg-red-500";

  return (
    <div
      className={`top-2 md:top-5 right-1 absolute h-10 rounded-lg md:rounded-l-lg flex justify-center items-center px-5 py-5 text-sm md:text-md font-Montserrat ${backgroundColor}`}>
      {msg}
    </div>
  );
};

export default Indicator;

// components/ChartCard.js
import React from "react";

const ChartCard = ({ children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
      {children}
    </div>
  );
};

export default ChartCard;

// components/ChartCard.js
import React from "react";

const ChartCard = ({ children }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 max-w-full overflow-hidden">
        {children}
      </div>
    );
  };
  
  export default ChartCard;

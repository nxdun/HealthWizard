const ChartCard = ({ children }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl w-full h-auto flex flex-col justify-center items-center">
        {children}
      </div>
    );
  };
  
  export default ChartCard;
  
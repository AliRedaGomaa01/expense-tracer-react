
const Loading = () => {
  return (
    <div
      className="flex items-center justify-center h-[70vh] relative"
    >

      <div className="relative text-center text-black">
        <div className="w-16 h-16 border-4 border-t-0 border-r-0 border-black rounded-full animate-spin mx-auto"></div>

        <h1 className="mt-6 text-2xl font-bold">Loading...</h1>
        
      </div>
    </div>
  );
};

export default Loading;
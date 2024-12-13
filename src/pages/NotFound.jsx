const NotFound = () => {
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative animate-bg"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative text-center text-white">

        <h1 className="mt-6 text-2xl font-bold"> 404 &nbsp; &nbsp; Page Not Found</h1>
      </div>
    </div>
  );
};

export default NotFound;
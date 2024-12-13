const ShowMessage = ({message}) => {
  return (
    <div
      className="flex items-center justify-center min-h-[20vh] relative"
    >

      <div className="relative text-center text-black">

        <h1 className="mt-6 text-2xl font-bold">{message}</h1>
        
      </div>
    </div>
  );
};

export default ShowMessage;
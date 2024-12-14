const NotFound = () => {

  const getRandomBackgroundImage = () => {
    const images = [
      "/assets/images/forest.jpg",
      "/assets/images/nature.jpg",
      "/assets/images/mountain.jpg",
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  const image = getRandomBackgroundImage();

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative animate-bg "
      style={{
        backgroundImage: `url('${image}')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative text-center text-white">

        <h1 className="mt-6 text-2xl font-bold animate-colored  p-5 rounded-xl text-black"> 404 &nbsp; &nbsp; Page Not Found</h1>
      </div>
    </div>
  );
};

export default NotFound;
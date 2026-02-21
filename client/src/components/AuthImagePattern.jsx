const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-center w-full h-full px-12">
      <div className="w-full max-w-md text-center">
        
        {/* Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-white/20 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-3 text-white">
          {title}
        </h2>

        <p className="text-white/80">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
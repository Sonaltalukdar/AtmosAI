import { Search, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex-1 max-w-xl flex flex-col justify-center h-full">

      {/* Tagline */}
      <p className="hero-fade-1 flex items-center gap-2 text-blue-400 font-medium mb-3">
        AI Powered Weather Forecast
      </p>

      {/* Heading */}
      <h1 className="hero-fade-2 text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
        Know Your Weather <br />
        <span className="text-blue-400">Instantly</span>
      </h1>

      {/* Search bar + Location button */}
      <div className="hero-fade-3 flex items-center gap-3">
        
        <div className="search-glow flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-full px-5 h-[44px] flex-1 backdrop-blur-xl">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for city..."
            className="bg-transparent outline-none text-white placeholder-gray-500 w-full text-[15px] h-full"
          />
        </div>

        <button className="btn-lift shine location-pulse flex items-center gap-2 bg-white/[0.04] border border-sky-400/20 rounded-full px-6 h-[44px] text-white text-[15px] font-medium whitespace-nowrap backdrop-blur-xl hover:bg-white/[0.08] cursor-pointer flex-shrink-0">
          <MapPin size={16} className="text-sky-400" />
          Use My Location
        </button>

      </div>
    </div>
  );
};

export default Hero;
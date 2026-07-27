import Hero from "../components/Home/Hero.jsx";
import WeatherCard from "../components/Home/WeatherCard.jsx";
import AirQuality from "../components/Home/AirQuality.jsx";
import AIChat from "../components/AIChat/index.js";

function Home() {
  return (
    <div
      className="pb-20"
      style={{
        paddingTop: "calc(var(--navbar-height) + 16px)",
        paddingLeft: "56px",
        paddingRight: "56px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 items-stretch">
        <div className="h-[380px] flex flex-col justify-center">
          <Hero />
        </div>

        <div className="h-[420px]">
          <WeatherCard />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-[420px] min-w-0">
          <AirQuality />
        </div>

        <div className="h-[420px] min-w-[320px]">
          <AIChat />
        </div>
      </div>
    </div>
  );
}

export default Home;
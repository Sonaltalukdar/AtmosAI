import { Sparkles } from "lucide-react";

function ChatHeader() {
    return (
        <div
            className="
      flex
      items-center
      justify-between
      px-5
      py-4
      border-b
      border-white/10
      bg-white/[0.03]
      backdrop-blur-xl
      "
        >

            {/* Left Section */}
            <div className="flex items-center gap-3 min-w-0 pr-4">


                {/* AI Avatar */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">

                    <img
                        src="/ai_logo.png"
                        alt="AtmosAI"
                        className="h-10 w-10 object-contain"
                    />

                    {/* Online Dot */}
                    <span
                        className="
    absolute
    -bottom-1
    -right-1
    h-3.5
    w-3.5
    rounded-full
    border-[2px]
    border-[#08111f]
    bg-emerald-400
    shadow-[0_0_12px_rgba(52,211,153,.9)]
    "
                    />

                </div>



                {/* Text */}

                <div className="flex flex-col min-w-0">


                    <div
                        className="
            flex
            items-center
            gap-2
            "
                    >

                        <h2
                            className="
              text-[15px]
              font-semibold
              tracking-wide
              truncate
              bg-gradient-to-r
              from-[#3BA8F9]
              via-[#C8FAFC]
              to-[#8065FB]
              bg-clip-text
              text-transparent
              "
                        >
                            AtmosAI
                        </h2>


                        <Sparkles
                            size={13}
                            className="
              text-sky-400
              animate-pulse
              shrink-0
              "
                        />

                    </div>



                    <p
                        className="
            text-[11px]
            text-gray-400
            mt-0.5
            truncate
            "
                    >
                        AI Weather Assistant
                    </p>


                </div>


            </div>

        </div>
    );
}

export default ChatHeader;
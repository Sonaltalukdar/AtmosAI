import { useState } from "react";
import { Paperclip, Send } from "lucide-react";


function ChatInput({ onSend }) {

  const [text, setText] = useState("");


  const handleSend = () => {

    if (!text.trim()) return;

    onSend(text);

    setText("");

  };



  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      handleSend();

    }

  };



  return (

    <div
      className="
      px-4
      py-3
      border-t
      border-white/10
      bg-black/10
      backdrop-blur-xl
      "
    >


      {/* Input Container */}

      <div
        className="
        flex
        items-center
        gap-3
        rounded-[22px]
        border
        border-white/10
        bg-white/[0.06]
        px-4
        py-2.5
        transition-all
        duration-300
        focus-within:border-sky-400/50
        focus-within:bg-white/[0.08]
        focus-within:shadow-[0_0_30px_rgba(14,165,233,.15)]
        "
      >



        {/* Attachment */}

        <button
          className="
          text-gray-400
          transition-all
          duration-300
          hover:text-sky-400
          hover:scale-110
          "
        >

          <Paperclip size={18}/>

        </button>





        {/* Text Input */}

        <input

          value={text}

          onChange={(e)=>setText(e.target.value)}

          onKeyDown={handleKeyDown}

          type="text"

          placeholder="Ask AtmosAI anything..."

          className="
          flex-1
          bg-transparent
          outline-none
          text-sm
          text-white
          placeholder:text-gray-500
          "
        />

        {/* Send Button */}

        <button

          onClick={handleSend}

          className="
          group
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-br
          from-sky-500
          via-cyan-500
          to-blue-600
          text-white
          shadow-lg
          shadow-sky-500/30
          transition-all
          duration-300
          hover:scale-110
          hover:shadow-[0_0_30px_rgba(14,165,233,.5)]
          active:scale-95
          "

        >

          <Send
            size={17}
            className="
            transition-transform
            duration-300
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
            "
          />

        </button>



      </div>





      {/* Bottom Text */}

      <p
        className="
        mt-2
        text-center
        text-[10px]
        tracking-wide
        text-gray-500
        "
      >

        AtmosAI may provide inaccurate information. Verify critical weather updates.

      </p>



    </div>

  );

}


export default ChatInput;
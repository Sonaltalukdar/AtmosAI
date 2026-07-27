import { User } from "lucide-react";

function MessageBubble({
    sender = "ai",
    message,
    time = "",
}) {

    const isUser = sender === "user";


    return (

        <div
            className={`
      flex
      items-end
      gap-4
      animate-[fadeIn_.35s_ease-out]
      ${isUser
                    ? "justify-end"
                    : "justify-start"
                }
      `}
        >




            {/* AI Avatar */}

            {!isUser && (

                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">

                    <img
                        src="/ai_logo.png"
                        alt="AtmosAI"
                        className="h-10 w-10 object-contain"
                    />

                </div>

            )}







            {/* Message Wrapper */}

            <div
                className={`
        flex
        flex-col
        max-w-[75%]
        min-w-0
        ${isUser
                        ? "items-end"
                        : "items-start"
                    }
        `}
            >





                {/* Bubble */}

                <div
                    className={`
          relative
          overflow-hidden
          px-5
          py-4
          rounded-[22px]
          text-[14px]
          leading-6
          backdrop-blur-xl
          transition-all
          duration-300
          hover:translate-y-[-2px]

          ${isUser

                            ?

                            `
            bg-gradient-to-br
            from-sky-500
            via-cyan-500
            to-blue-600
            text-white
            rounded-br-md
            shadow-xl
            shadow-sky-500/25
            border
            border-sky-300/20
            `

                            :

                            `
            bg-white/[0.07]
            border
            border-white/10
            text-gray-200
            rounded-bl-md
            shadow-xl
            shadow-black/20
            `
                        }
          `}
                >



                    {/* Glass Shine */}

                    <div
                        className="
            absolute
            inset-x-0
            top-0
            h-1/2
            bg-gradient-to-b
            from-white/10
            to-transparent
            pointer-events-none
            "
                    />



                    <p
                        className="
            relative
            whitespace-pre-line
            break-words
            "
                    >

                        {message}

                    </p>


                </div>






                {/* Time */}

                {
                    time && (

                        <span
                            className="
              mt-3
              px-2
              text-[10px]
              text-gray-500
              "
                        >

                            {time}

                        </span>

                    )
                }


            </div>








            {/* User Avatar */}

            {
                isUser && (

                    <div
                        className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-white/20
            to-white/5
            border
            border-white/10
            shadow-lg
            "
                    >

                        <User
                            size={18}
                            className="text-white"
                        />

                    </div>

                )
            }



        </div>

    );

}


export default MessageBubble;
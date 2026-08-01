import { useState, useRef } from "react";
import { User, Copy, Check, Pencil, X, Paperclip, FileText } from "lucide-react";

// Lightweight markdown-ish formatter — handles **bold** and "* " bullet
// lines without pulling in a full markdown library.
function parseInline(line, keyPrefix) {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={`${keyPrefix}-${i}`} className="font-semibold">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return <span key={`${keyPrefix}-${i}`}>{part}</span>;
    });
}

function FormattedMessage({ text }) {
    const lines = text.split("\n");

    return (
        <div className="space-y-1">
            {lines.map((line, idx) => {
                const trimmed = line.trim();

                if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                    return (
                        <div key={idx} className="flex gap-2 pl-1">
                            <span className="text-sky-400 shrink-0">•</span>
                            <span>{parseInline(trimmed.slice(2), idx)}</span>
                        </div>
                    );
                }

                if (trimmed === "") {
                    return <div key={idx} className="h-1" />;
                }

                return <div key={idx}>{parseInline(line, idx)}</div>;
            })}
        </div>
    );
}


function MessageBubble({
    id,
    sender = "ai",
    message,
    time = "",
    avatar = "",
    userName = "",
    imagePreview = null,
    attachedFile = null,
    fileName = null,
    onSaveEdit = null,
}) {

    const isUser = sender === "user";
    const [copied, setCopied] = useState(false);

    const hasRealText = !!message;

    // ---- Edit mode state ----
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(hasRealText ? message : "");
    const [editPreview, setEditPreview] = useState(imagePreview);
    const [editFile, setEditFile] = useState(attachedFile);
    const editFileInputRef = useRef(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(message || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const startEdit = () => {
        setEditText(hasRealText ? message : "");
        setEditPreview(imagePreview);
        setEditFile(attachedFile);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const handleChangeFileClick = () => {
        editFileInputRef.current?.click();
    };

    const handleEditFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setEditFile(selected);
            if (selected.type.startsWith("image/")) {
                setEditPreview(URL.createObjectURL(selected));
            } else {
                setEditPreview(null);
            }
        }
        e.target.value = "";
    };

    const removeEditFile = () => {
        setEditFile(null);
        setEditPreview(null);
    };

    const saveEdit = () => {
        if (!editText.trim() && !editFile) return;
        setIsEditing(false);
        onSaveEdit?.(id, editText, editFile);
    };


    return (

        <div
            className={`
      group
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
        relative
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

                {isEditing ? (
                    <div
                        className="
                        w-[280px]
                        sm:w-[340px]
                        rounded-[22px]
                        border
                        border-sky-400/50
                        bg-white/[0.06]
                        p-3
                        flex
                        flex-col
                        gap-2
                        "
                    >
                        {editPreview && (
                            <img
                                src={editPreview}
                                alt="Attached"
                                className="rounded-xl max-h-40 object-cover"
                            />
                        )}

                        {editFile && !editPreview && (
                            <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 rounded-lg px-2 py-1.5">
                                <Paperclip size={13} className="text-sky-400" />
                                <span className="truncate">{editFile.name}</span>
                                <button
                                    onClick={removeEditFile}
                                    className="ml-auto text-gray-400 hover:text-red-400"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}

                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            className="
                            w-full
                            bg-transparent
                            outline-none
                            text-sm
                            text-white
                            resize-none
                            "
                            placeholder="Edit your message..."
                            autoFocus
                        />

                        <input
                            type="file"
                            ref={editFileInputRef}
                            onChange={handleEditFileChange}
                            accept="image/*,.pdf,.txt"
                            className="hidden"
                        />

                        <div className="flex items-center justify-between pt-1">
                            <button
                                onClick={handleChangeFileClick}
                                className="
                                flex
                                items-center
                                gap-1.5
                                text-xs
                                text-gray-400
                                hover:text-sky-400
                                transition-colors
                                "
                            >
                                <Paperclip size={13} />
                                {editFile ? "Change file" : "Attach file"}
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={cancelEdit}
                                    className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-gray-400
                                    hover:text-red-400
                                    hover:bg-white/5
                                    "
                                    title="Cancel"
                                >
                                    <X size={14} />
                                </button>
                                <button
                                    onClick={saveEdit}
                                    className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-sky-500
                                    text-white
                                    hover:bg-sky-400
                                    "
                                    title="Save & resend"
                                >
                                    <Check size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Image — rendered plain, no colored bubble/border around it */}
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Attached"
                                className="rounded-2xl mb-2 max-h-64 max-w-full object-cover shadow-lg shadow-black/30"
                            />
                        )}

                        {/* Document card — shown for non-image attachments (PDF/TXT) */}
                        {fileName && !imagePreview && (
                            <div
                                className="
                                mb-2
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.06]
                                backdrop-blur-xl
                                px-4
                                py-3
                                shadow-lg
                                shadow-black/30
                                max-w-[260px]
                                "
                            >
                                <div
                                    className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-sky-500/15
                                    text-sky-400
                                    "
                                >
                                    <FileText size={18} />
                                </div>
                                <span className="text-xs text-gray-200 truncate">
                                    {fileName}
                                </span>
                            </div>
                        )}

                        {/* Text Bubble — only rendered if there's real text to show */}
                        {(hasRealText || (!imagePreview && !fileName)) && (
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
                    shadow-black/20
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

                                <div
                                    className="
                    relative
                    whitespace-pre-line
                    break-words
                    "
                                >
                                    <FormattedMessage text={message} />
                                </div>

                                {/* Action buttons — copy (both) + edit (user only) — always visible on mobile, hover-reveal on desktop */}
                                <div
                                    className="
                    absolute
                    bottom-1.5
                    right-2
                    flex
                    items-center
                    gap-2
                    opacity-100
                    sm:opacity-0
                    sm:group-hover:opacity-100
                    transition-opacity
                    duration-200
                    "
                                >
                                    {isUser && (
                                        <button
                                            onClick={startEdit}
                                            className="text-white/70 hover:text-white"
                                            title="Edit message"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                    )}

                                    <button
                                        onClick={handleCopy}
                                        className="text-white/70 hover:text-white"
                                        title="Copy message"
                                    >
                                        {copied ? <Check size={13} /> : <Copy size={13} />}
                                    </button>
                                </div>

                            </div>
                        )}
                    </>
                )}


                {/* Time */}

                {
                    time && !isEditing && (

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
            overflow-hidden
            bg-gradient-to-br
            from-white/20
            to-white/5
            border
            border-white/10
            shadow-lg
            "
                    >

                        {avatar ? (
                            <img
                                src={avatar}
                                alt={userName || "User"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User
                                size={18}
                                className="text-white"
                            />
                        )}

                    </div>

                )
            }



        </div>

    );

}


export default MessageBubble;
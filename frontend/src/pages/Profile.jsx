import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Pencil,
  Check,
  X,
  Loader2,
  ArrowLeft,
  Camera,
  ZoomIn,
} from "lucide-react";
import {
  fetchProfile,
  updateProfile,
} from "../services/authApi.js";

const CROP_SIZE = 280;

// ============================================================
// CROP MODAL
// ============================================================

function CropModal({ imageSrc, onCancel, onSave }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });

  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startOffset: {
      x: 0,
      y: 0,
    },
  });

  const [imgLoaded, setImgLoaded] = useState(false);
  const [baseScale, setBaseScale] = useState(1);

  // Load image
  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      imgRef.current = img;

      const scale = Math.max(
        CROP_SIZE / img.width,
        CROP_SIZE / img.height
      );

      setBaseScale(scale);
      setZoom(1);
      setOffset({
        x: 0,
        y: 0,
      });
      setImgLoaded(true);
    };

    img.src = imageSrc;
  }, [imageSrc]);

  // Draw crop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;

    if (!canvas || !img || !imgLoaded) return;

    const ctx = canvas.getContext("2d");

    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;

    ctx.clearRect(
      0,
      0,
      CROP_SIZE,
      CROP_SIZE
    );

    const scale = baseScale * zoom;

    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const dx =
      (CROP_SIZE - drawW) / 2 + offset.x;

    const dy =
      (CROP_SIZE - drawH) / 2 + offset.y;

    // Circle clip
    ctx.save();

    ctx.beginPath();

    ctx.arc(
      CROP_SIZE / 2,
      CROP_SIZE / 2,
      CROP_SIZE / 2,
      0,
      Math.PI * 2
    );

    ctx.clip();

    ctx.drawImage(
      img,
      dx,
      dy,
      drawW,
      drawH
    );

    ctx.restore();

    // Circle border
    ctx.beginPath();

    ctx.arc(
      CROP_SIZE / 2,
      CROP_SIZE / 2,
      CROP_SIZE / 2 - 1,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      "rgba(255,255,255,0.6)";

    ctx.lineWidth = 2;

    ctx.stroke();
  }, [
    zoom,
    offset,
    imgLoaded,
    baseScale,
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  const clampOffset = (x, y) => {
    const img = imgRef.current;

    if (!img) {
      return { x, y };
    }

    const scale = baseScale * zoom;

    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const maxX = Math.max(
      0,
      (drawW - CROP_SIZE) / 2
    );

    const maxY = Math.max(
      0,
      (drawH - CROP_SIZE) / 2
    );

    return {
      x: Math.min(
        maxX,
        Math.max(-maxX, x)
      ),
      y: Math.min(
        maxY,
        Math.max(-maxY, y)
      ),
    };
  };

  const handlePointerDown = (e) => {
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: {
        ...offset,
      },
    };
  };

  const handlePointerMove = (e) => {
    if (!dragState.current.dragging) {
      return;
    }

    const dx =
      e.clientX -
      dragState.current.startX;

    const dy =
      e.clientY -
      dragState.current.startY;

    const next = clampOffset(
      dragState.current.startOffset.x +
        dx,
      dragState.current.startOffset.y +
        dy
    );

    setOffset(next);
  };

  const handlePointerUp = () => {
    dragState.current.dragging = false;
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(
      e.target.value
    );

    setZoom(newZoom);

    setOffset((prev) =>
      clampOffset(prev.x, prev.y)
    );
  };

  const handleCropSave = () => {
    const exportSize = 320;

    const exportCanvas =
      document.createElement("canvas");

    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;

    const ctx =
      exportCanvas.getContext("2d");

    const img = imgRef.current;

    const scale =
      baseScale *
      zoom *
      (exportSize / CROP_SIZE);

    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const dx =
      (exportSize - drawW) / 2 +
      offset.x *
        (exportSize / CROP_SIZE);

    const dy =
      (exportSize - drawH) / 2 +
      offset.y *
        (exportSize / CROP_SIZE);

    ctx.beginPath();

    ctx.arc(
      exportSize / 2,
      exportSize / 2,
      exportSize / 2,
      0,
      Math.PI * 2
    );

    ctx.clip();

    ctx.drawImage(
      img,
      dx,
      dy,
      drawW,
      drawH
    );

    const dataUrl =
      exportCanvas.toDataURL(
        "image/jpeg",
        0.9
      );

    onSave(dataUrl);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        px-4
        py-4
        overflow-y-auto
      "
    >
      <div
        className="
          glass-card
          card-premium
          rounded-3xl
          p-5
          sm:p-6
          flex
          flex-col
          items-center
          gap-4
          sm:gap-5
          max-w-sm
          w-full
          max-h-[95vh]
          overflow-y-auto
        "
      >
        {/* Title */}
        <h3
          className="
            text-white
            text-base
            sm:text-lg
            font-semibold
          "
        >
          Adjust photo
        </h3>

        {/* Crop Area */}
        <div
          className="
            rounded-full
            overflow-hidden
            cursor-grab
            active:cursor-grabbing
            select-none
            bg-black/40
            shrink-0
            touch-none
          "
          style={{
            width:
              "min(280px, calc(100vw - 80px))",
            height:
              "min(280px, calc(100vw - 80px))",
          }}
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerLeave={
            handlePointerUp
          }
        >
          <canvas
            ref={canvasRef}
            width={CROP_SIZE}
            height={CROP_SIZE}
            className="
              w-full
              h-full
              block
            "
          />
        </div>

        {/* Zoom */}
        <div
          className="
            w-full
            flex
            items-center
            gap-3
          "
        >
          <ZoomIn
            size={16}
            className="
              text-gray-400
              shrink-0
            "
          />

          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={handleZoomChange}
            className="
              w-full
              accent-blue-500
              cursor-pointer
            "
          />
        </div>

        {/* Help */}
        <p
          className="
            text-[11px]
            sm:text-xs
            text-gray-400
            text-center
          "
        >
          Drag to reposition, use the
          slider to zoom
        </p>

        {/* Buttons */}
        <div
          className="
            flex
            gap-2
            sm:gap-3
            w-full
            mt-1
          "
        >
          <button
            onClick={onCancel}
            className="
              btn-lift
              flex
              flex-1
              items-center
              justify-center
              gap-1.5
              sm:gap-2
              h-[44px]
              sm:h-[46px]
              rounded-full
              border
              border-white/10
              text-gray-300
              text-[13px]
              sm:text-[15px]
              font-bold
              cursor-pointer
            "
          >
            <X size={15} />
            Cancel
          </button>

          <button
            onClick={handleCropSave}
            className="
              btn-lift
              shine
              signup-glow
              flex
              flex-1
              items-center
              justify-center
              gap-1.5
              sm:gap-2
              h-[44px]
              sm:h-[46px]
              rounded-full
              text-white
              text-[13px]
              sm:text-[15px]
              font-bold
              cursor-pointer
            "
          >
            <Check size={15} />
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROFILE
// ============================================================

function Profile({
  currentUser,
  setCurrentUser,
}) {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const [cropSrc, setCropSrc] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // Load profile
  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await fetchProfile();

        setProfile(data);

        setForm({
          name: data.name,
          email: data.email,
        });

        setAvatarPreview(
          data.avatar || ""
        );
      } catch (err) {
        console.error(
          "Failed to load profile:",
          err
        );

        setError(
          "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoClick = () => {
    if (editing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5MB"
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setCropSrc(reader.result);
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCropSave = (
    croppedDataUrl
  ) => {
    setAvatarPreview(
      croppedDataUrl
    );

    setCropSrc(null);
    setError("");
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const result =
        await updateProfile({
          ...form,
          avatar: avatarPreview,
        });

      setProfile(result.user);

      const savedUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      const updatedUser = {
        ...savedUser,
        ...result.user,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      if (setCurrentUser) {
        setCurrentUser(updatedUser);
      }

      setEditing(false);
    } catch (err) {
      console.error(
        "Update failed:",
        err
      );

      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: profile.name,
      email: profile.email,
    });

    setAvatarPreview(
      profile.avatar || ""
    );

    setEditing(false);
    setError("");
  };

  // Loading
  if (loading) {
    return (
      <div
        className="
          min-h-[100dvh]
          w-full
          flex
          items-center
          justify-center
          bg-[#02040a]
        "
      >
        <Loader2
          size={28}
          className="
            animate-spin
            text-blue-400
          "
        />
      </div>
    );
  }

  // Profile error
  if (!profile) {
    return (
      <div
        className="
          min-h-[100dvh]
          w-full
          flex
          items-center
          justify-center
          bg-[#02040a]
          text-gray-400
          px-4
          text-center
        "
      >
        Could not load profile.
      </div>
    );
  }

  return (
    <div
      className="
        min-h-[100dvh]
        w-full
        flex
        items-center
        justify-center
        bg-[#02040a]
        px-4
        sm:px-6
        py-6
        relative
      "
    >
      {/* ================================================== */}
      {/* BACK BUTTON */}
      {/* ================================================== */}

      <button
        onClick={() =>
          navigate("/home")
        }
        className="
          absolute
          top-4
          left-4
          sm:top-8
          sm:left-8
          flex
          items-center
          gap-1.5
          sm:gap-2
          text-gray-400
          hover:text-white
          transition-colors
          cursor-pointer
          text-sm
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>


      {/* ================================================== */}
      {/* PROFILE CARD */}
      {/* ================================================== */}

      <div
        className="
          max-w-md
          w-full
        "
      >
        <div
          className="
            glass-card
            card-premium
            rounded-3xl
            p-5
            sm:p-8
            flex
            flex-col
            items-center
            gap-5
            sm:gap-6
            w-full
          "
        >

          {/* ================================================== */}
          {/* PROFILE PHOTO */}
          {/* ================================================== */}

          <div
            onClick={handlePhotoClick}
            className={`
              relative
              w-20
              h-20
              rounded-full
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-2xl
              overflow-hidden
              shrink-0
              ${
                editing
                  ? "cursor-pointer"
                  : ""
              }
              ${
                !avatarPreview
                  ? "bg-blue-500"
                  : ""
              }
            `}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />
            ) : (
              profile.name
                ?.charAt(0)
                .toUpperCase()
            )}

            {editing && (
              <div
                className="
                  absolute
                  inset-0
                  bg-black/50
                  flex
                  items-center
                  justify-center
                "
              >
                <Camera
                  size={20}
                  className="text-white"
                />
              </div>
            )}
          </div>


          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />


          {/* ================================================== */}
          {/* FORM */}
          {/* ================================================== */}

          <div
            className="
              w-full
              flex
              flex-col
              gap-4
            "
          >

            {/* NAME */}
            <div
              className="
                flex
                flex-col
                gap-2
              "
            >
              <label
                className="
                  text-sm
                  text-gray-300
                  font-medium
                "
              >
                Name
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-3
                  sm:px-4
                  py-3
                  min-w-0
                "
              >
                <User
                  size={16}
                  className="
                    text-gray-400
                    shrink-0
                  "
                />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    outline-none
                    text-sm
                    text-white
                    disabled:text-gray-300
                  "
                />
              </div>
            </div>


            {/* EMAIL */}
            <div
              className="
                flex
                flex-col
                gap-2
              "
            >
              <label
                className="
                  text-sm
                  text-gray-300
                  font-medium
                "
              >
                Email
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-3
                  sm:px-4
                  py-3
                  min-w-0
                "
              >
                <Mail
                  size={16}
                  className="
                    text-gray-400
                    shrink-0
                  "
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    outline-none
                    text-sm
                    text-white
                    disabled:text-gray-300
                  "
                />
              </div>
            </div>


            {/* ERROR */}
            {error && (
              <p
                className="
                  text-sm
                  text-red-400
                  text-center
                  break-words
                "
              >
                {error}
              </p>
            )}


            {/* ================================================== */}
            {/* EDIT BUTTON */}
            {/* ================================================== */}

            {!editing ? (
              <button
                onClick={() =>
                  setEditing(true)
                }
                className="
                  btn-lift
                  shine
                  flex
                  items-center
                  justify-center
                  gap-2
                  h-[46px]
                  rounded-full
                  bg-gray-200
                  text-black
                  text-[14px]
                  sm:text-[15px]
                  font-bold
                  cursor-pointer
                  mt-1
                  sm:mt-2
                  w-full
                "
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            ) : (

              /* ================================================== */
              /* CANCEL + SAVE */
              /* ================================================== */

              <div
                className="
                  flex
                  gap-2
                  sm:gap-3
                  mt-1
                  sm:mt-2
                  w-full
                "
              >
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="
                    btn-lift
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-1.5
                    sm:gap-2
                    h-[44px]
                    sm:h-[46px]
                    rounded-full
                    border
                    border-white/10
                    text-gray-300
                    text-[13px]
                    sm:text-[15px]
                    font-bold
                    cursor-pointer
                    disabled:opacity-60
                  "
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="
                    btn-lift
                    shine
                    signup-glow
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-1.5
                    sm:gap-2
                    h-[44px]
                    sm:h-[46px]
                    rounded-full
                    text-white
                    text-[13px]
                    sm:text-[15px]
                    font-bold
                    cursor-pointer
                    disabled:opacity-60
                  "
                >
                  {saving ? (
                    <Loader2
                      size={16}
                      className="
                        animate-spin
                      "
                    />
                  ) : (
                    <Check size={16} />
                  )}

                  Save
                </button>
              </div>
            )}

          </div>
        </div>
      </div>


      {/* ================================================== */}
      {/* CROP MODAL */}
      {/* ================================================== */}

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          onCancel={handleCropCancel}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
}

export default Profile;
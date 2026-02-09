import React, { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";

interface TicketRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTicketType: "VIP" | "General" | "Bundle" | "Outsider";
}

const TicketRegistrationModal: React.FC<TicketRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultTicketType,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    ticketType: defaultTicketType,
    roomType: "none" as "none" | "single" | "double",
    secondaryName: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    phone: "",
    email: "",
  });

  // Bundle State
  const [bundleSize, setBundleSize] = useState(2);
  const [additionalGuests, setAdditionalGuests] = useState<string[]>(
    Array(5).fill(""),
  ); // Max 6 total (1 main + 5 guests)

  // Reset form and update ticket type when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        ticketType: defaultTicketType as
          | "VIP"
          | "General"
          | "Bundle"
          | "Outsider",
        roomType: "none",
        secondaryName: "",
      });
      setStatus("idle");
      setErrorMessage("");
      setBundleSize(2);
      setAdditionalGuests(Array(5).fill(""));
    }
  }, [isOpen, defaultTicketType]);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "phone") {
      if (value && value.length !== 10) {
        error = "Phone number must be exactly 10 digits.";
      }
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        error = "Please enter a valid email address.";
      }
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    // Validation: Phone number should only contain numbers
    if (name === "phone") {
      newValue = value.replace(/\D/g, ""); // Remove non-numeric chars
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Real-time validation
    if (name === "phone" || name === "email") {
      validateField(name, newValue);
    }
  };

  const getBundlePrice = (size: number) => {
    const prices: { [key: number]: number } = {
      2: 1499,
      3: 2199,
      4: 2899,
      5: 3599,
      6: 4499,
    };
    return prices[size] || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Final Validation check before submit
    const phoneError = validateField("phone", formData.phone);
    const emailError = validateField("email", formData.email);

    if (phoneError || emailError) {
      setStatus("idle");
      return;
    }

    const stayType =
      formData.ticketType !== "Outsider"
        ? "N/A"
        : formData.roomType === "single"
          ? "Single Room"
          : formData.roomType === "double"
            ? "Double Room"
            : "Without Stay";

    // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const GOOGLE_SCRIPT_URL =
      formData.ticketType === "Bundle"
        ? "https://script.google.com/macros/s/AKfycbxu2htsaKL6NBn_zEdM1_kFzw1JhBMgxoBXCsvReFcmujS-NkkJBLC1bQVRnMXCX7Xc/exec"
        : formData.ticketType === "Outsider"
          ? "https://script.google.com/macros/s/AKfycbyEf9Bg5Hfa1kMLHy0ZelcQha2CWIQmIEeZ0rg5Mg8ofA0gG9Xt-BBvXvEymtmgwzrNbw/exec"
          : "https://script.google.com/macros/s/AKfycbylNGgEsN-4K0fZ59q1ojmqUNUk_xj2CSL16rKe0R4L1ryi07UozDg73pDalNgkHhUQXw/exec";
    const finalName =
  formData.ticketType === "Outsider" &&
  formData.roomType === "double" &&
  formData.secondaryName.trim()
    ? `${formData.name} & ${formData.secondaryName}`
    : formData.name;


    try {
      const params = new URLSearchParams();
      params.append("name", finalName);
      params.append("phone", formData.phone);
      params.append("email", formData.email);
      params.append("ticketType", formData.ticketType);
      params.append("stayType", stayType);
      if (formData.roomType === "double") {
        params.append("secondaryName", formData.secondaryName);
      }
      params.append(
        "totalPrice",
        String(
          formData.ticketType === "Outsider"
            ? stayType === "Single Room"
              ? 1945  
              : stayType === "Double Room"
                ? 2330
                : 1000
            : 849,
        ),
      );

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
      style={{ touchAction: "none" }}
    >
      <div
        className={`
    relative w-full ${formData.ticketType === "Bundle" ? "max-w-4xl" : "max-w-md"} 
    bg-black border border-white/20 rounded-2xl shadow-2xl p-5 md:p-8
    transform transition-all duration-300 scale-100 
    my-2 flex flex-col
    max-h-[75vh] md:max-h-[80vh]
  `}
        style={{
          boxShadow:
            formData.ticketType === "VIP"
              ? "0 0 40px rgba(195, 195, 195, 0.2)"
              : "0 0 40px rgba(0, 157, 178, 0.2)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2
          className={`text-2xl font-bold mb-6 text-center ${formData.ticketType === "VIP" ? "text-[#c3c3c3]" : formData.ticketType === "Outsider" ? "text-[#F43F5E]" : "text-[#009db2]"}`}
        >
          {status === "success"
            ? "Registration Complete!"
            : formData.ticketType === "Bundle"
              ? "Bundle Registration"
              : "Secure Your Spot"}
        </h2>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div
              className={`rounded-full p-4 ${formData.ticketType === "VIP" ? "bg-[#c3c3c3]/20 text-[#c3c3c3]" : formData.ticketType === "Outsider" ? "bg-[#F43F5E]/20 text-[#F43F5E]" : "bg-[#009db2]/20 text-[#009db2]"}`}
            >
              <Check className="w-12 h-12" />
            </div>
            <p className="text-white/80 text-center text-lg">
              Thank you, {formData.name}!<br />
              <span className="text-sm opacity-70">
                We've received your registration for{" "}
                {formData.ticketType === "Bundle"
                  ? `${bundleSize} tickets`
                  : "1 ticket"}
                .
              </span>
              <br />
              We'll be contacting you shortly at {formData.phone}.
            </p>
            <button
              onClick={onClose}
              className={`
                mt-6 px-10 py-3 rounded-lg font-bold text-black transition-transform hover:scale-105
                ${formData.ticketType === "VIP" ? "bg-[#c3c3c3] hover:bg-[#b0b0b0]" : formData.ticketType === "Outsider" ? "bg-[#F43F5E] hover:bg-[#F43F5E]" : "bg-[#009db2] hover:bg-[#008c9e]"}
              `}
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex-1 flex flex-col overflow-y-auto pr-1 overscroll-contain"
          >
            <div
              className={`flex-1 ${formData.ticketType === "Bundle" ? "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" : "space-y-4"}`}
            >
              {/* Left Column or Main Fields */}
              <div className="space-y-4">
                <h3
                  className={`text-sm font-bold uppercase tracking-wider mb-4 ${formData.ticketType === "VIP" ? "text-[#c3c3c3]" : formData.ticketType === "Outsider" ? "text-[#F43F5E]" : "text-[#009db2]"}`}
                >
                  Contact Information
                </h3>
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Main Attendee Name"
                  />
                </div>

                {/* Secondary Name for Double Room */}
                {formData.ticketType === "Outsider" &&
                  formData.roomType === "double" && (
                    <div className="animate-fadeIn">
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                        Guest Name
                      </label>
                      <input
                        type="text"
                        name="secondaryName"
                        required
                        value={formData.secondaryName}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="Second Guest Name"
                      />
                    </div>
                  )}

                {/* Phone */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Phone Number
                    </label>
                    {fieldErrors.phone && (
                      <span className="text-red-400 text-[10px] font-medium animate-pulse">
                        {fieldErrors.phone}
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="10-digit Number"
                  />
                </div>

                {/* Email */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Email Address
                    </label>
                    {fieldErrors.email && (
                      <span className="text-red-400 text-[10px] font-medium animate-pulse">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Ticket Type Dropdown (always on left/main) */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                    Ticket Type
                  </label>
                  <select
                    name="ticketType"
                    value={formData.ticketType}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="VIP" className="bg-black text-[#c3c3c3]">
                      VIP Ticket
                    </option>
                    <option value="General" className="bg-black text-[#009db2]">
                      General Attendee
                    </option>
                    <option value="Bundle" className="bg-black text-[#009db2]">
                      Bundle Option
                    </option>
                    <option
                      value="Outsider"
                      className="bg-black text-[#F43F5E]"
                    >
                      Outsider Ticket
                    </option>
                  </select>
                </div>
              </div>

              {/* Outsider Ticket Stay Toggle */}
              {formData.ticketType === "Outsider" && (
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#F43F5E] text-center">
                      Stay Required?
                    </h3>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            roomType: "single", // default stay option
                          }))
                        }
                        className={`
    flex-1 py-4 rounded-xl font-bold transition-all duration-300
    ${
      formData.roomType !== "none"
        ? "bg-[#F43F5E] text-black shadow-lg shadow-[#F43F5E]/20 scale-[1.02]"
        : "bg-white/5 text-white/60 hover:bg-white/10"
    }
  `}
                      >
                        With Stay
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            roomType: "none",
                          }))
                        }
                        className={`
    flex-1 py-4 rounded-xl font-bold transition-all duration-300
    ${
      formData.roomType === "none"
        ? "bg-[#F43F5E] text-black shadow-lg shadow-[#F43F5E]/20 scale-[1.02]"
        : "bg-white/5 text-white/60 hover:bg-white/10"
    }
  `}
                      >
                        Without Stay
                      </button>
                    </div>

                    {formData.roomType !== "none" && (
                      <div className="mt-8 animate-fadeIn">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#F43F5E] text-center">
                          Select Room Type
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              id: "single",
                              label: "Single Room",
                              price: "945",
                            },
                            {
                              id: "double",
                              label: "Double Room",
                              price: "1330",
                            },
                          ].map((room) => (
                            <div
                              key={room.id}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  roomType: room.id as "single" | "double",
                                }))
                              }
                              className={`
                                group cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                                ${formData.roomType === room.id ? "bg-[#F43F5E]/10 border-[#F43F5E] shadow-[0_0_20px_rgba(244,63,94,0.1)]" : "bg-white/5 border-white/10 hover:border-white/20"}
                              `}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`
                                  w-6 h-6 rounded flex items-center justify-center border-2 transition-all duration-300
                                  ${formData.roomType === room.id ? "bg-[#F43F5E] border-[#F43F5E]" : "border-white/20 group-hover:border-white/40"}
                                `}
                                >
                                  {formData.roomType === room.id && (
                                    <Check className="w-4 h-4 text-black" />
                                  )}
                                </div>
                                <span
                                  className={`text-lg font-bold transition-colors ${formData.roomType === room.id ? "text-white" : "text-white/60"}`}
                                >
                                  {room.label}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-bold ${formData.roomType === room.id ? "text-[#F43F5E]" : "text-white/40"}`}
                              >
                                ₹{room.price}/-
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Right Column (Bundle exclusive) */}
              {formData.ticketType === "Bundle" && (
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#009db2] text-center">
                      Bundle Details
                    </h3>

                    {/* Bundle Size Selector */}
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold text-gray-400 mb-3 text-center uppercase tracking-widest">
                        Number of People
                      </label>
                      <div className="flex justify-center flex-wrap gap-2">
                        {[2, 3, 4, 5].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setBundleSize(size)}
                            className={`
                                                            w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-bold transition-all duration-200
                                                            ${
                                                              bundleSize ===
                                                              size
                                                                ? "bg-[#009db2] text-black scale-110 shadow-lg shadow-[#009db2]/30"
                                                                : "bg-white/10 text-gray-400 hover:bg-white/20"
                                                            }
                                                        `}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Guests Grid to save height */}
                    <div className="space-y-3 pt-4 border-t border-white/10 flex-1 min-h-0 flex flex-col">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Guest Names
                      </p>
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3
                max-h-[220px] sm:max-h-[300px] md:max-h-[200px]
                overflow-y-auto pr-2 custom-scrollbar"
                      >
                        {Array.from({ length: bundleSize - 1 }).map(
                          (_, index) => (
                            <div key={index} className="animate-fadeIn">
                              <input
                                type="text"
                                required
                                value={additionalGuests[index]}
                                onChange={(e) => {
                                  const newGuests = [...additionalGuests];
                                  newGuests[index] = e.target.value;
                                  setAdditionalGuests(newGuests);
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                                placeholder={`Guest ${index + 2} Name`}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Price & Submit */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 mt-auto">
              <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                  Total Amount
                </p>
                <div className="text-2xl font-black text-white flex items-baseline gap-1">
                  <span className="text-sm opacity-50">₹</span>
                  {formData.ticketType === "Bundle"
                    ? getBundlePrice(bundleSize)
                    : formData.ticketType === "VIP"
                      ? "2499"
                      : formData.ticketType === "Outsider"
                        ? formData.roomType === "single"
                          ? "1945"
                          : formData.roomType === "double"
                            ? "2330"
                            : "1000"
                        : "849"}

                  <span className="text-sm opacity-50 font-medium tracking-normal">
                    /-
                  </span>
                  {formData.ticketType === "Bundle" && (
                    <span className="ml-2 text-[10px] text-[#009db2] font-bold line-through opacity-50">
                      ₹{849 * bundleSize}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className={`
                                    w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-black text-lg transition-all duration-300
                                    flex items-center justify-center gap-3 min-w-[180px]
                                    ${status === "submitting" ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"}
                                    ${formData.ticketType === "VIP" ? "bg-[#c3c3c3] hover:bg-[#b0b0b0]" : formData.ticketType === "Outsider" ? "bg-[#F43F5E] hover:bg-[#F43F5E]/80" : "bg-[#009db2] hover:bg-[#008c9e] shadow-[0_4px_20px_rgba(0,157,178,0.2)]"}
                                `}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm & Register"
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                {errorMessage}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketRegistrationModal;

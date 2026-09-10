"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Palette,
  MessageCircle,
  Upload,
  Info,
} from "lucide-react";

export default function CustomCakePage() {
  const [occasion, setOccasion] = useState("Birthday");
  const [preferredModel, setPreferredModel] = useState("Single Tier Custom");
  const [flavour, setFlavour] = useState("Fresh Cream Vanilla");
  const [weight, setWeight] = useState("1.5 kg");
  const [theme, setTheme] = useState("");
  const [colorPreference, setColorPreference] = useState("");
  const [budgetRange, setBudgetRange] = useState("₹1,000 - ₹2,000");
  const [requiredDate, setRequiredDate] = useState("");
  const [requiredTime, setRequiredTime] = useState("");
  const [cakeMessage, setCakeMessage] = useState("");
  const [orderType, setOrderType] = useState<"Delivery" | "Shop Pickup">("Delivery");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!mobileNumber.trim() || !/^[6-9]\d{9}$/.test(mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Valid 10-digit mobile number required";
    }

    if (orderType === "Delivery" && !deliveryArea.trim()) {
      newErrors.deliveryArea = "Delivery area is required";
    }

    if (!requiredDate) {
      newErrors.requiredDate = "Required date is required";
    }

    if (!requiredTime) {
      newErrors.requiredTime = "Required time is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Format Custom Cake Enquiry WhatsApp Message
    const message = `Hello கேரித் Cakes,
I would like to submit a CUSTOM CAKE ENQUIRY.

ENQUIRY DETAILS:
- Occasion: ${occasion}
- Preferred Model: ${preferredModel}
- Flavour: ${flavour}
- Cake Weight: ${weight}
- Theme: ${theme.trim() ? theme.trim() : "Custom Theme"}
- Colour Preference: ${colorPreference.trim() ? colorPreference.trim() : "Standard"}
- Budget Range: ${budgetRange}
- Required Date: ${requiredDate}
- Required Time: ${requiredTime}
- Cake Message: ${cakeMessage.trim() ? cakeMessage.trim() : "None"}

CUSTOMER & FULFILLMENT:
- Name: ${customerName.trim()}
- Mobile Number: ${mobileNumber.trim()}
- Order Type: ${orderType}
- Delivery Area: ${orderType === "Delivery" ? deliveryArea.trim() : "N/A - Shop Pickup"}
- Special Instructions: ${instructions.trim() ? instructions.trim() : "None"}

${selectedFileName ? `(Note: Reference image selected: ${selectedFileName})` : ""}

Please confirm custom design feasibility and estimated cost.
Thank you.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/916383558292?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#020001] pt-6 pb-24 text-[#FFF7EA]">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1635] text-[#C9A24A] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C9A24A]/30">
            <Palette size={14} className="text-[#FF8A00]" /> கேரித் Cakes
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#FFF7EA]">
            Custom Cake <span className="gold-gradient-text">Enquiry</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#DBD8C0] mt-1">
            MAKE A TEASTY LIFE — Send your custom theme design preferences directly to our baker via WhatsApp.
          </p>
        </div>

        {/* Reference Image Notice Alert */}
        <div className="p-3.5 rounded-2xl bg-[#241124] border border-[#C9A24A]/40 mb-6 flex items-start gap-2.5 text-xs text-[#FFF7EA]">
          <Info size={18} className="text-[#FF8A00] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#FF8A00]">Please attach your reference image after WhatsApp opens.</p>
            <p className="text-[#DBD8C0] mt-0.5">
              Fill in your preferred specifications below and click &ldquo;Send Enquiry on WhatsApp&rdquo;.
            </p>
          </div>
        </div>

        {/* Custom Cake Form */}
        <div className="p-5 sm:p-8 rounded-3xl bg-[#0d050f] border border-[#3B1635] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Cake Specifications */}
            <div>
              <h2 className="text-base font-bold text-[#FFF7EA] border-b border-[#3B1635] pb-2 mb-3 flex items-center gap-2">
                <Palette size={16} className="text-[#FF8A00]" /> 1. Cake Design & Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="Anniversary">Anniversary / Romance</option>
                    <option value="Wedding">Wedding / Engagement</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Other Celebration">Other Special Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Preferred Model</label>
                  <select
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option value="Single Tier Custom">Single Tier Custom Cake</option>
                    <option value="Double Tier Sculpted">Double Tier Sculpted Cake</option>
                    <option value="3-Tier Grand Wedding">3-Tier Grand Wedding Cake</option>
                    <option value="Pinata Surprise Shell">Pinata Surprise Shell</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Flavour</label>
                  <select
                    value={flavour}
                    onChange={(e) => setFlavour(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option value="Fresh Cream Vanilla">Fresh Cream Vanilla</option>
                    <option value="Classic Red Velvet">Classic Red Velvet</option>
                    <option value="Rich Dark Chocolate">Rich Dark Chocolate</option>
                    <option value="Choco Caramel Fusion">Choco Caramel Fusion</option>
                    <option value="Black Forest Fresh">Black Forest Fresh Cream</option>
                    <option value="White Forest">White Forest</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Estimated Weight</label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option value="1 kg">1 kg (Serves 6 - 8)</option>
                    <option value="1.5 kg">1.5 kg (Serves 10 - 12)</option>
                    <option value="2 kg">2 kg (Serves 15 - 18)</option>
                    <option value="3 kg">3 kg (Serves 25 - 30)</option>
                    <option value="5 kg+">5 kg+ Grand Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Budget Range</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option value="₹1,000 - ₹1,500">₹1,000 - ₹1,500</option>
                    <option value="₹1,500 - ₹2,500">₹1,500 - ₹2,500</option>
                    <option value="₹2,500 - ₹4,000">₹2,500 - ₹4,000</option>
                    <option value="₹4,000+">₹4,000+ Premium Royal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Theme (Optional)</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Floral Gold, Cartoon"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Color Preference</label>
                  <input
                    type="text"
                    value={colorPreference}
                    onChange={(e) => setColorPreference(e.target.value)}
                    placeholder="e.g. Royal Purple & Gold"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Reference Photo</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="refImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="refImage"
                      className="w-full bg-[#160b18] border border-dashed border-[#C9A24A]/50 rounded-xl px-3 py-2 text-[#DBD8C0] flex items-center justify-between cursor-pointer hover:border-[#FF8A00]"
                    >
                      <span className="truncate">
                        {selectedFileName || "Choose reference photo..."}
                      </span>
                      <Upload size={14} className="text-[#FF8A00] shrink-0" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Details */}
            <div>
              <h2 className="text-base font-bold text-[#FFF7EA] border-b border-[#3B1635] pb-2 mb-3">
                2. Contact & Schedule
              </h2>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#FFF7EA] mb-1">Customer Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                    />
                    {errors.customerName && (
                      <p className="text-[10px] text-red-400 mt-0.5">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-[#FFF7EA] mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit Mobile Number"
                      className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                    />
                    {errors.mobileNumber && (
                      <p className="text-[10px] text-red-400 mt-0.5">{errors.mobileNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#FFF7EA] mb-1">Required Date *</label>
                    <input
                      type="date"
                      value={requiredDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setRequiredDate(e.target.value)}
                      className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#FFF7EA] mb-1">Required Time *</label>
                    <input
                      type="time"
                      value={requiredTime}
                      onChange={(e) => setRequiredTime(e.target.value)}
                      className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Cake Message</label>
                  <input
                    type="text"
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    placeholder="e.g. Happy Birthday Ananya!"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full orange-glow-btn py-3.5 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Send Enquiry on WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

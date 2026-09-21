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

export default function CustomCakeClient() {
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementsByName(firstKey)[0];
      if (el) el.focus();
      return;
    }

    // Build structured WhatsApp message
    const lines = [
      `*CUSTOM CAKE ENQUIRY - கேரித் Cakes*`,
      `---------------------------------------`,
      `👤 *Customer Name:* ${customerName}`,
      `📞 *Mobile:* ${mobileNumber}`,
      `🎉 *Occasion:* ${occasion}`,
      `🎂 *Model Type:* ${preferredModel}`,
      `🍓 *Flavour:* ${flavour}`,
      `⚖️ *Estimated Weight:* ${weight}`,
      theme ? `🎨 *Theme Concept:* ${theme}` : null,
      colorPreference ? `🌈 *Color Code / Theme:* ${colorPreference}` : null,
      cakeMessage ? `✍️ *Cake Message:* "${cakeMessage}"` : null,
      `💰 *Budget Range:* ${budgetRange}`,
      `🚚 *Order Type:* ${orderType}`,
      orderType === "Delivery" && deliveryArea ? `📍 *Delivery Area:* ${deliveryArea}` : null,
      `📅 *Required Date:* ${requiredDate}`,
      `⏰ *Required Time:* ${requiredTime}`,
      instructions ? `📝 *Special Instructions:* ${instructions}` : null,
      selectedFileName ? `📎 *Reference Photo Attached:* (Sending next on chat: ${selectedFileName})` : null,
      `---------------------------------------`,
      `_Please confirm availability and share final quote._`,
    ].filter(Boolean);

    const fullMessage = lines.join("\n");
    const encoded = encodeURIComponent(fullMessage);
    const url = `https://wa.me/916383558292?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#020001] pt-6 pb-24 text-[#FFF7EA]">
      <div className="max-w-3xl mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1635] text-[#C9A24A] text-xs font-bold uppercase tracking-wider mb-2">
            <Palette size={14} className="text-[#FF8A00]" /> Unique Theme Creations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#FFF7EA]">
            Custom Cake <span className="gold-gradient-text">Enquiry</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#DBD8C0] mt-1">
            Fill in your custom theme specifications below and send directly to our master baker on WhatsApp.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-5 sm:p-8 rounded-3xl bg-[#0d050f] border border-[#3B1635] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
            {/* 1. Occasion & Model Type */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#C9A24A] uppercase tracking-wider border-b border-[#3B1635] pb-1.5 flex items-center gap-1.5">
                <span>1. Cake Concept & Model</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Wedding & Reception</option>
                    <option>Kids Cartoon / Superhero Theme</option>
                    <option>Baby Shower / Naming Ceremony</option>
                    <option>Engagement</option>
                    <option>Retirement & Milestone</option>
                    <option>Other Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Preferred Model</label>
                  <select
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option>Single Tier Custom</option>
                    <option>Double Layer / Tall Cake</option>
                    <option>2-Tier Grand Celebration</option>
                    <option>3-Tier Wedding Royal Model</option>
                    <option>3D Sculpted Doll / Barbie Theme</option>
                    <option>Edible Photo Print Cake</option>
                    <option>Heart Shape Milestone Cake</option>
                    <option>Custom Geometry / Crown Model</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Theme / Character Concept</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Spiderman, Barbie Princess, Jungle Safari, Royal Gold"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Color Palette Preference</label>
                  <input
                    type="text"
                    value={colorPreference}
                    onChange={(e) => setColorPreference(e.target.value)}
                    placeholder="e.g. Pastel Pink & Gold, Royal Blue & Silver"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Flavour & Weight */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#C9A24A] uppercase tracking-wider border-b border-[#3B1635] pb-1.5">
                2. Flavour & Weight
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Flavour Choice</label>
                  <select
                    value={flavour}
                    onChange={(e) => setFlavour(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option>Classic Black Forest</option>
                    <option>White Forest</option>
                    <option>Classic Red Velvet</option>
                    <option>Dark Chocolate Truffle</option>
                    <option>Choco Caramel Fusion</option>
                    <option>Butterscotch Crunch</option>
                    <option>Sicilian Cassata</option>
                    <option>Exotic Mixed Fruit</option>
                    <option>Royal Rasmalai Fusion</option>
                    <option>Spanish Delight</option>
                    <option>Traditional Rich Plum</option>
                    <option>Fresh Cream Vanilla</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Weight</label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option>1 kg (approx 6-8 pax)</option>
                    <option>1.5 kg (approx 10-12 pax)</option>
                    <option>2 kg (approx 14-16 pax)</option>
                    <option>2.5 kg (approx 18-20 pax)</option>
                    <option>3 kg (approx 22-25 pax)</option>
                    <option>4 kg (approx 30-35 pax)</option>
                    <option>5 kg+ (Multi-tier wedding)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Estimated Budget</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option>₹1,000 - ₹1,500</option>
                    <option>₹1,500 - ₹2,500</option>
                    <option>₹2,500 - ₹4,000</option>
                    <option>₹4,000 - ₹7,000</option>
                    <option>₹7,000+ (Grand Wedding Tier)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Reference Image Upload */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-[#C9A24A] uppercase tracking-wider border-b border-[#3B1635] pb-1.5">
                3. Reference Design Photo (Optional)
              </h2>

              <div className="p-4 rounded-2xl bg-[#160b18] border border-dashed border-[#C9A24A]/40 text-center">
                <input
                  type="file"
                  id="custom-file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="custom-file"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <Upload size={22} className="text-[#FF8A00]" />
                  <span className="font-semibold text-[#FFF7EA]">
                    {selectedFileName ? selectedFileName : "Click to select a reference photo from your phone/device"}
                  </span>
                  <span className="text-[11px] text-[#DBD8C0]">
                    You can also attach the photo directly when WhatsApp opens.
                  </span>
                </label>
              </div>
            </div>

            {/* 4. Customer Info & Delivery Schedule */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#C9A24A] uppercase tracking-wider border-b border-[#3B1635] pb-1.5">
                4. Contact & Delivery Schedule
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors({ ...errors, customerName: "" });
                    }}
                    placeholder="e.g. Priya Anand"
                    className={`w-full bg-[#160b18] border rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none ${
                      errors.customerName ? "border-red-500" : "border-[#3B1635] focus:border-[#FF8A00]"
                    }`}
                  />
                  {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">WhatsApp Mobile *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: "" });
                    }}
                    placeholder="e.g. 9876543210"
                    className={`w-full bg-[#160b18] border rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none ${
                      errors.mobileNumber ? "border-red-500" : "border-[#3B1635] focus:border-[#FF8A00]"
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-red-400 text-xs mt-1">{errors.mobileNumber}</p>}
                </div>
              </div>

              {/* Order Type & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Order Fulfillment</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType("Delivery")}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        orderType === "Delivery"
                          ? "bg-[#C9A24A] text-black border-[#C9A24A]"
                          : "bg-[#160b18] text-[#DBD8C0] border-[#3B1635]"
                      }`}
                    >
                      Doorstep Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("Shop Pickup")}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        orderType === "Shop Pickup"
                          ? "bg-[#C9A24A] text-black border-[#C9A24A]"
                          : "bg-[#160b18] text-[#DBD8C0] border-[#3B1635]"
                      }`}
                    >
                      Direct Shop Pickup
                    </button>
                  </div>
                </div>

                {orderType === "Delivery" && (
                  <div>
                    <label className="block font-bold text-[#FFF7EA] mb-1">Delivery Area (Coimbatore) *</label>
                    <input
                      type="text"
                      name="deliveryArea"
                      value={deliveryArea}
                      onChange={(e) => {
                        setDeliveryArea(e.target.value);
                        if (errors.deliveryArea) setErrors({ ...errors, deliveryArea: "" });
                      }}
                      placeholder="e.g. Ganapathy, Saravanampatti, Peelamedu"
                      className={`w-full bg-[#160b18] border rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none ${
                        errors.deliveryArea ? "border-red-500" : "border-[#3B1635] focus:border-[#FF8A00]"
                      }`}
                    />
                    {errors.deliveryArea && <p className="text-red-400 text-xs mt-1">{errors.deliveryArea}</p>}
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Required Date *</label>
                  <input
                    type="date"
                    name="requiredDate"
                    value={requiredDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setRequiredDate(e.target.value);
                      if (errors.requiredDate) setErrors({ ...errors, requiredDate: "" });
                    }}
                    className={`w-full bg-[#160b18] border rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none ${
                      errors.requiredDate ? "border-red-500" : "border-[#3B1635] focus:border-[#FF8A00]"
                    }`}
                  />
                  {errors.requiredDate && <p className="text-red-400 text-xs mt-1">{errors.requiredDate}</p>}
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Required Delivery/Pickup Time *</label>
                  <input
                    type="time"
                    name="requiredTime"
                    value={requiredTime}
                    onChange={(e) => {
                      setRequiredTime(e.target.value);
                      if (errors.requiredTime) setErrors({ ...errors, requiredTime: "" });
                    }}
                    className={`w-full bg-[#160b18] border rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none ${
                      errors.requiredTime ? "border-red-500" : "border-[#3B1635] focus:border-[#FF8A00]"
                    }`}
                  />
                  {errors.requiredTime && <p className="text-red-400 text-xs mt-1">{errors.requiredTime}</p>}
                </div>
              </div>

              {/* Message on cake & Instructions */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Message on Cake (Optional)</label>
                  <input
                    type="text"
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    placeholder="e.g. Happy 1st Birthday Rahul!"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Special Notes / Dietary Instructions</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Less sugar, eggless preferred, delivery on 2nd floor, extra chocolate curls"
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

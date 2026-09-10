"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=148,+Kannimar+Nagar,+Sathy+Main+Road,+Ganapathy,+Coimbatore+-+641006";

  const handleQuickEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const fullMsg = `Hello கேரித் Cakes,
I have an enquiry.

Name: ${name}
Mobile: ${phone}
Message: ${message || "Enquiry regarding cake order"}

Please get back to me.`;

    const encoded = encodeURIComponent(fullMsg);
    window.open(`https://wa.me/916383558292?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#020001] pt-6 pb-24 text-[#FFF7EA]">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1635] text-[#C9A24A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-[#FF8A00]" /> Bakery Location & Hotline
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#FFF7EA]">
            Contact & <span className="gold-gradient-text">Location</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#DBD8C0] mt-1">
            கேரித் Cakes • MAKE A TEASTY LIFE
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Store Address & Action Buttons */}
          <div className="md:col-span-7 space-y-4">
            <div className="p-5 sm:p-7 rounded-3xl bg-[#0d050f] border border-[#3B1635] shadow-xl space-y-5">
              <div className="flex items-center gap-3 border-b border-[#3B1635] pb-3">
                <Image
                  src="/images/logo.jpg"
                  alt="கேரித் Cakes Logo"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-[#C9A24A]"
                />
                <div>
                  <h2 className="text-xl font-bold text-[#FFF7EA] font-serif">கேரித் Cakes</h2>
                  <p className="text-[10px] text-[#FF8A00] font-extrabold uppercase tracking-wider">
                    MAKE A TEASTY LIFE
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#DBD8C0]">
                {/* Address Info */}
                <div className="flex items-start gap-2.5">
                  <MapPin size={18} className="text-[#FF8A00] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-[#FFF7EA] text-sm block">Bakery Address:</strong>
                    <p className="text-xs text-[#FFF7EA]">148, Kannimar Nagar, Sathy Main Road,</p>
                    <p className="text-xs text-[#FFF7EA]">Ganapathy, Coimbatore – 641006</p>
                    <p className="text-xs font-bold text-[#C9A24A] mt-0.5">Near Surya Hospital</p>
                  </div>
                </div>

                {/* WhatsApp & Contact */}
                <div className="flex items-center gap-2.5 pt-1">
                  <Phone size={17} className="text-[#C9A24A] shrink-0" />
                  <div>
                    <span className="text-[11px] text-[#DBD8C0] block">WhatsApp & Call Hotline:</span>
                    <a
                      href="tel:+916383558292"
                      className="text-base font-extrabold text-[#FFF7EA] hover:text-[#FF8A00]"
                    >
                      +91 63835 58292
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-center gap-2.5">
                  <Clock size={17} className="text-[#C1DD13] shrink-0" />
                  <div>
                    <span className="text-[11px] text-[#DBD8C0] block">Shop Hours:</span>
                    <span className="text-xs font-bold text-[#FFF7EA]">
                      Monday – Sunday: 9:00 AM – 9:30 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#3B1635]">
                <a
                  href="tel:+916383558292"
                  className="py-2.5 px-3 rounded-xl bg-[#241124] text-[#FFF7EA] border border-[#C9A24A]/40 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone size={14} className="text-[#C9A24A]" />
                  Call Now
                </a>

                <a
                  href="https://wa.me/916383558292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="orange-glow-btn py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>

                <a
                  href="https://wa.me/c/916383558292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#120614] border border-[#3B1635] text-[#FFF7EA] font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={12} className="text-[#C9A24A]" />
                  Catalogue
                </a>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#120614] border border-[#C9A24A]/40 text-[#C9A24A] font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MapPin size={12} />
                  Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Quick Enquiry Form */}
          <div className="md:col-span-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0d050f] border border-[#3B1635] shadow-xl">
              <h3 className="text-base font-bold text-[#FFF7EA] mb-1 font-serif">Quick Message</h3>
              <p className="text-xs text-[#DBD8C0] mb-4">
                Send a direct enquiry to கேரித் Cakes on WhatsApp.
              </p>

              <form onSubmit={handleQuickEnquiry} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit number"
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFF7EA] mb-1">Message</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your question or order query..."
                    className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl px-3 py-2 text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full orange-glow-btn py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Send on WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function ContactClient() {
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
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[#241124] border border-[#C9A24A]/40 text-[#FF8A00] shrink-0 mt-0.5">
                  <MapPin size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">Bakery Address</h2>
                  <p className="text-xs sm:text-sm text-[#DBD8C0] mt-1 leading-relaxed">
                    148, Kannimar Nagar, Sathy Main Road, <br />
                    Opp. to Surya Hospital, Ganapathy, <br />
                    Coimbatore, Tamil Nadu &ndash; 641006.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-[#C9A24A] bg-[#241124] px-2.5 py-0.5 rounded-full border border-[#C9A24A]/30">
                    Surya Hospital Landmark
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="orange-glow-btn px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <MapPin size={14} />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink size={12} />
                </a>

                <a
                  href="tel:916383558292"
                  className="px-4 py-2.5 rounded-xl bg-[#241124] hover:bg-[#3B1635] border border-[#C9A24A]/40 text-[#FFF7EA] font-semibold text-xs flex items-center gap-1.5"
                >
                  <Phone size={14} className="text-[#C9A24A]" />
                  <span>Call: +91 63835 58292</span>
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-5 rounded-2xl bg-[#0d050f] border border-[#3B1635] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#241124] text-[#C1DD13]">
                <Clock size={20} />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Bakery & Delivery Hours</div>
                <div className="text-[#DBD8C0] mt-0.5">
                  Monday &ndash; Sunday: <strong>9:00 AM &ndash; 10:00 PM</strong> (Open All Days)
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Quick Chat Card */}
            <div className="p-5 rounded-2xl bg-[#150717] border border-[#25D366]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#25D366]/20 text-[#25D366]">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Direct WhatsApp Hotline</h3>
                  <p className="text-xs text-[#DBD8C0]">Instant cake booking & photo sharing</p>
                </div>
              </div>

              <a
                href="https://wa.me/916383558292?text=Hello%20%E0%AE%95%E0%AF%87%E0%AE%B0%E0%AE%BF%E0%AE%A4%E0%AF%8D%20Cakes,%20I%20have%20an%20order%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <MessageCircle size={14} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Enquiry Form Card */}
          <div className="md:col-span-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0d050f] border border-[#3B1635] shadow-xl space-y-4">
              <h2 className="font-bold text-sm text-[#C9A24A] uppercase tracking-wider border-b border-[#3B1635] pb-2 flex items-center gap-1.5">
                <Send size={14} className="text-[#FF8A00]" />
                <span>Quick WhatsApp Enquiry</span>
              </h2>

              <p className="text-xs text-[#DBD8C0]">
                Send your query directly to our Ganapathy bakery team:
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

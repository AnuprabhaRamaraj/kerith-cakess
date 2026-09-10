"use client";

import React from "react";
import { X, ShieldCheck, FileText } from "lucide-react";

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "privacy" | "terms";
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = "privacy",
}) => {
  const [activeTab, setActiveTab] = React.useState<"privacy" | "terms">(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#020001]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#120614] border border-[#C9A24A]/40 rounded-2xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#3B1635] flex items-center justify-between bg-[#241124]">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "privacy"
                  ? "bg-[#FF8A00] text-white"
                  : "text-[#DBD8C0] hover:text-white bg-[#020001]"
              }`}
            >
              <ShieldCheck size={14} /> Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "terms"
                  ? "bg-[#FF8A00] text-white"
                  : "text-[#DBD8C0] hover:text-white bg-[#020001]"
              }`}
            >
              <FileText size={14} /> Terms & Conditions
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#DBD8C0] hover:text-white hover:bg-[#3B1635]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto text-xs text-[#DBD8C0] space-y-3">
          {activeTab === "privacy" ? (
            <>
              <h3 className="text-sm font-bold text-[#FFF7EA]">Privacy Policy — கேரித் Cakes</h3>
              <p>
                At <strong>கேரித் Cakes</strong> (Ganapathy, Coimbatore), we respect your privacy and value your trust (MAKE A TEASTY LIFE).
              </p>
              <h4 className="font-semibold text-[#C9A24A]">1. Order Details</h4>
              <p>
                Selected cake items and quantities are stored temporarily in your local browser storage and dispatched directly to WhatsApp for ordering.
              </p>
              <h4 className="font-semibold text-[#C9A24A]">2. Direct WhatsApp Communication</h4>
              <p>
                Orders and custom cake inquiries are conducted directly through WhatsApp messaging. We do not sell or share customer contact details.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-[#FFF7EA]">Terms & Conditions — கேரித் Cakes</h3>
              <p>
                Welcome to <strong>கேரித் Cakes</strong> (MAKE A TEASTY LIFE).
              </p>
              <h4 className="font-semibold text-[#C9A24A]">1. Fresh Daily Preparation</h4>
              <p>
                All cakes are freshly prepared with quality ingredients. For custom sculpted theme cakes, please place orders in advance.
              </p>
              <h4 className="font-semibold text-[#C9A24A]">2. Order Confirmation</h4>
              <p>
                Prices and product availability are confirmed directly with our baker upon WhatsApp message dispatch.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#3B1635] bg-[#0a040b] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#241124] text-[#FFF7EA] border border-[#C9A24A]/30 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  CheckCircle,
  X,
  Sparkles,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  Cake,
  Check,
  User,
  Users,
  KeyRound,
  Radio,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import { Product, getProductPriceForWeight } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-1",
    name: "Master Baker (Admin 1)",
    email: "admin@kerithcakes.com",
    password: "admin123",
    role: "Super Admin",
    createdAt: "Jan 2025",
  },
];

const PRESET_IMAGES = [
  { label: "Black Forest", path: "/images/cakes/black_forest.jpg" },
  { label: "Red Velvet", path: "/images/cakes/red_velvet.jpg" },
  { label: "Chocolate Caramel", path: "/images/cakes/choco_caramel.jpg" },
  { label: "White Forest", path: "/images/cakes/white_forest.jpg" },
  { label: "Custom Theme Model", path: "/images/cakes/custom_model.jpg" },
  { label: "Wedding Tier Cake", path: "/images/cakes/wedding_cake.jpg" },
];

const STANDARD_WEIGHTS = ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "5 kg"];

const ADMIN_USERS_STORAGE_KEY = "kerith_admin_users_list_v2";

export default function AdminDashboardPage() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    toggleLive,
  } = useProducts();

  // Admin Accounts State (Up to 3 Users)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(DEFAULT_ADMIN_USERS);
  const [currentLoggedInAdmin, setCurrentLoggedInAdmin] = useState<AdminUser | null>(null);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Active Admin View Tab
  const [activeAdminTab, setActiveAdminTab] = useState<"catalogue" | "admin_users">("catalogue");

  // Admin Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "live" | "paused" | "featured" | "offers">("all");

  // Modal State for Add / Edit Cake
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Cake Form State
  const [formName, setFormName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Black Forest");
  const [formCategoryId, setFormCategoryId] = useState<string>("black-forest");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formImage, setFormImage] = useState<string>("/images/cakes/black_forest.jpg");
  const [imageSourceMode, setImageSourceMode] = useState<"upload" | "preset" | "url">("upload");
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formBaseWeight, setFormBaseWeight] = useState<string>("1.5 kg");
  const [formAvailableWeights, setFormAvailableWeights] = useState<string[]>([
    "1 kg",
    "1.5 kg",
    "2 kg",
  ]);
  const [formOfferPrice, setFormOfferPrice] = useState<number>(1000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(1400);
  const [formIsBestseller, setFormIsBestseller] = useState<boolean>(false);
  const [formIsOffer, setFormIsOffer] = useState<boolean>(true);
  const [formIsLive, setFormIsLive] = useState<boolean>(true);
  const [formWeightPrices, setFormWeightPrices] = useState<{
    [weight: string]: { offerPrice: number; originalPrice: number };
  }>({});

  // Modal State for Adding/Editing Admin User
  const [isAdminUserModalOpen, setIsAdminUserModalOpen] = useState<boolean>(false);
  const [editingAdminUser, setEditingAdminUser] = useState<AdminUser | null>(null);
  const [userFormName, setUserFormName] = useState<string>("");
  const [userFormEmail, setUserFormEmail] = useState<string>("");
  const [userFormPassword, setUserFormPassword] = useState<string>("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Admin Users and Session from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdminUsers(parsed);
        }
      }

      const activeSessionEmail = localStorage.getItem("kerith_active_admin_email");
      if (activeSessionEmail) {
        const currentUsers = savedUsers ? JSON.parse(savedUsers) : DEFAULT_ADMIN_USERS;
        const matched = currentUsers.find(
          (u: AdminUser) => u.email.toLowerCase() === activeSessionEmail.toLowerCase()
        );
        if (matched) {
          setCurrentLoggedInAdmin(matched);
          setIsAdminLoggedIn(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save Admin Users to localStorage whenever updated
  const saveAdminUsers = (usersList: AdminUser[]) => {
    setAdminUsers(usersList);
    try {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Process Local Image File (Compress / Resize with Canvas for crisp storage)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setFormImage(compressedDataUrl);
          setImageSourceMode("upload");
          showToast(`Photo "${file.name}" loaded successfully!`);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!emailInput.trim()) {
      setAuthError("Please enter your admin email.");
      return;
    }
    if (!passwordInput) {
      setAuthError("Please enter your admin password.");
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const matchedUser = adminUsers.find(
        (u) =>
          u.email.trim().toLowerCase() === emailInput.trim().toLowerCase() &&
          u.password === passwordInput
      );

      if (matchedUser) {
        setCurrentLoggedInAdmin(matchedUser);
        setIsAdminLoggedIn(true);
        localStorage.setItem("kerith_active_admin_email", matchedUser.email);
        showToast(`Welcome, ${matchedUser.name}!`);
      } else {
        setAuthError("Invalid email or password. Please check your admin credentials.");
      }
    }, 400);
  };

  const handleQuickDemoLogin = (userToUse: AdminUser) => {
    setEmailInput(userToUse.email);
    setPasswordInput(userToUse.password);
    setCurrentLoggedInAdmin(userToUse);
    setIsAdminLoggedIn(true);
    localStorage.setItem("kerith_active_admin_email", userToUse.email);
    showToast(`Logged in as ${userToUse.name}.`);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentLoggedInAdmin(null);
    localStorage.removeItem("kerith_active_admin_email");
    showToast("Signed out from admin session.");
  };

  // Open Modal to Add Cake
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("Black Forest");
    setFormCategoryId("black-forest");
    setFormDescription("Freshly whipped cream celebration cake prepared with premium ingredients.");
    setFormImage("/images/cakes/black_forest.jpg");
    setImageSourceMode("preset");
    setFormBaseWeight("1.5 kg");
    setFormAvailableWeights(["1 kg", "1.5 kg", "2 kg"]);
    setFormOfferPrice(1000);
    setFormOriginalPrice(1400);
    setFormIsBestseller(false);
    setFormIsOffer(true);
    setFormIsLive(true);
    setFormWeightPrices({
      "1 kg": { offerPrice: 700, originalPrice: 950 },
      "1.5 kg": { offerPrice: 1000, originalPrice: 1400 },
      "2 kg": { offerPrice: 1350, originalPrice: 1800 },
    });
    setIsModalOpen(true);
  };

  // Open Modal to Edit Cake
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormCategoryId(product.categoryId);
    setFormDescription(product.description);
    setFormImage(product.image);
    setImageSourceMode(product.image.startsWith("data:") ? "upload" : "preset");
    setFormBaseWeight(product.weight);
    setFormAvailableWeights(product.availableWeights || [product.weight]);
    setFormOfferPrice(product.offerPrice);
    setFormOriginalPrice(product.originalPrice);
    setFormIsBestseller(!!product.isBestseller);
    setFormIsOffer(!!product.isOffer);
    setFormIsLive(product.isLive !== false);

    // Initialize per-weight price table
    const wp: { [w: string]: { offerPrice: number; originalPrice: number } } = {};
    (product.availableWeights || [product.weight]).forEach((w) => {
      const calc = getProductPriceForWeight(product, w);
      wp[w] = {
        offerPrice: product.weightPrices?.[w]?.offerPrice || calc.offerPrice,
        originalPrice: product.weightPrices?.[w]?.originalPrice || calc.originalPrice,
      };
    });
    setFormWeightPrices(wp);
    setIsModalOpen(true);
  };

  // Save Cake
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Please enter cake name.");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        categoryId: formCategoryId,
        description: formDescription,
        image: formImage,
        weight: formBaseWeight,
        availableWeights: formAvailableWeights,
        offerPrice: Number(formOfferPrice),
        originalPrice: Number(formOriginalPrice),
        isBestseller: formIsBestseller,
        isOffer: formIsOffer,
        isLive: formIsLive,
        weightPrices: formWeightPrices,
      });
      showToast(`Updated "${formName}" successfully!`);
    } else {
      addProduct({
        name: formName,
        category: formCategory,
        categoryId: formCategoryId,
        description: formDescription,
        image: formImage,
        weight: formBaseWeight,
        availableWeights: formAvailableWeights,
        offerPrice: Number(formOfferPrice),
        originalPrice: Number(formOriginalPrice),
        isBestseller: formIsBestseller,
        isOffer: formIsOffer,
        isLive: formIsLive,
        weightPrices: formWeightPrices,
      });
      showToast(`Added new cake "${formName}"!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCake = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
      deleteProduct(id);
      showToast(`Deleted "${name}".`);
    }
  };

  // Toggle weight selection in cake modal
  const handleToggleWeight = (w: string) => {
    if (formAvailableWeights.includes(w)) {
      if (formAvailableWeights.length === 1) {
        alert("At least one weight must be available.");
        return;
      }
      const updated = formAvailableWeights.filter((item) => item !== w);
      setFormAvailableWeights(updated);

      // If removed weight was the base weight, switch base weight to the first available weight
      if (formBaseWeight === w && updated.length > 0) {
        setFormBaseWeight(updated[0]);
        if (formWeightPrices[updated[0]]) {
          setFormOfferPrice(formWeightPrices[updated[0]].offerPrice);
          setFormOriginalPrice(formWeightPrices[updated[0]].originalPrice);
        }
      }
    } else {
      const updated = [...formAvailableWeights, w];
      setFormAvailableWeights(updated);
      if (!formWeightPrices[w]) {
        const fakeProd: Product = {
          id: "temp",
          name: formName,
          category: formCategory,
          categoryId: formCategoryId,
          weight: formBaseWeight,
          availableWeights: updated,
          offerPrice: formOfferPrice,
          originalPrice: formOriginalPrice,
          description: formDescription,
          image: formImage,
        };
        const calc = getProductPriceForWeight(fakeProd, w);
        setFormWeightPrices({
          ...formWeightPrices,
          [w]: { offerPrice: calc.offerPrice, originalPrice: calc.originalPrice },
        });
      }
    }
  };

  // Select Base Weight from the Drop View (populated from entered weight breakdown)
  const handleSelectBaseWeight = (selectedWeight: string) => {
    setFormBaseWeight(selectedWeight);
    if (formWeightPrices[selectedWeight]) {
      setFormOfferPrice(formWeightPrices[selectedWeight].offerPrice);
      setFormOriginalPrice(formWeightPrices[selectedWeight].originalPrice);
    }
  };

  // Update Base Value prices (and synchronize the base row in weightPrices table)
  const handleBasePriceInputsChange = (newOffer: number, newOriginal: number) => {
    setFormOfferPrice(newOffer);
    setFormOriginalPrice(newOriginal);
    setFormWeightPrices({
      ...formWeightPrices,
      [formBaseWeight]: {
        offerPrice: newOffer,
        originalPrice: newOriginal,
      },
    });
  };

  // Admin User CRUD (Up to 3 Users)
  const handleOpenAddAdminUser = () => {
    if (adminUsers.length >= 3) {
      alert("Maximum limit of 3 admin users reached. You can edit or delete an existing user.");
      return;
    }
    setEditingAdminUser(null);
    setUserFormName("");
    setUserFormEmail("");
    setUserFormPassword("");
    setIsAdminUserModalOpen(true);
  };

  const handleOpenEditAdminUser = (user: AdminUser) => {
    setEditingAdminUser(user);
    setUserFormName(user.name);
    setUserFormEmail(user.email);
    setUserFormPassword(user.password);
    setIsAdminUserModalOpen(true);
  };

  const handleSaveAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormName.trim() || !userFormEmail.trim() || !userFormPassword.trim()) {
      alert("Please fill all user fields.");
      return;
    }

    if (editingAdminUser) {
      const updated = adminUsers.map((u) =>
        u.id === editingAdminUser.id
          ? {
              ...u,
              name: userFormName,
              email: userFormEmail,
              password: userFormPassword,
            }
          : u
      );
      saveAdminUsers(updated);
      if (currentLoggedInAdmin?.id === editingAdminUser.id) {
        setCurrentLoggedInAdmin({
          ...currentLoggedInAdmin,
          name: userFormName,
          email: userFormEmail,
          password: userFormPassword,
        });
        localStorage.setItem("kerith_active_admin_email", userFormEmail);
      }
      showToast("Admin credentials updated successfully!");
    } else {
      if (adminUsers.length >= 3) {
        alert("Maximum 3 admin accounts allowed.");
        return;
      }
      const newUser: AdminUser = {
        id: `admin-${Date.now()}`,
        name: userFormName,
        email: userFormEmail,
        password: userFormPassword,
        role: "Co-Admin",
        createdAt: "Today",
      };
      saveAdminUsers([...adminUsers, newUser]);
      showToast(`Admin account "${userFormName}" created!`);
    }
    setIsAdminUserModalOpen(false);
  };

  const handleDeleteAdminUser = (user: AdminUser) => {
    if (adminUsers.length <= 1) {
      alert("You must keep at least 1 admin account to access the dashboard.");
      return;
    }
    if (confirm(`Remove admin account for "${user.name}" (${user.email})?`)) {
      const updated = adminUsers.filter((u) => u.id !== user.id);
      saveAdminUsers(updated);
      if (currentLoggedInAdmin?.id === user.id) {
        handleAdminLogout();
      } else {
        showToast("Admin account removed.");
      }
    }
  };

  // Filtered List for Catalogue Tab
  const filteredList = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType =
      filterType === "all" ||
      (filterType === "live" && p.isLive !== false) ||
      (filterType === "paused" && p.isLive === false) ||
      (filterType === "featured" && p.isBestseller) ||
      (filterType === "offers" && p.isOffer);

    return matchCategory && matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020001] via-[#150717] to-[#020001] text-[#FFF7EA] py-8 px-3 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#C1DD13] text-black font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-slideIn">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {!isAdminLoggedIn ? (
        /* ========================================================= */
        /* ADMIN LOGIN VIEW (Only Admin Needs to Log In)             */
        /* ========================================================= */
        <div className="max-w-md mx-auto pt-6 sm:pt-12">
          {/* Header Info */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 rounded-full border-2 border-[#C9A24A] bg-[#241124] shadow-2xl mb-3">
              <Image
                src="/images/logo.jpg"
                alt="கேரித் Cakes"
                width={76}
                height={76}
                className="rounded-full"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#FFF7EA]">
              கேரித் Cakes
            </h1>
            <p className="text-xs text-[#FF8A00] font-extrabold uppercase tracking-widest mt-1">
              Admin Portal & Menu Controller
            </p>
            <div className="mt-3 p-3 rounded-xl bg-[#241124]/70 border border-[#C9A24A]/20 text-[11px] text-[#DBD8C0] max-w-sm mx-auto">
              <span>🔒 <strong>Admin Authentication Required (Up to 3 Users)</strong></span>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Customers do not need to login to browse or place orders on WhatsApp.
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#C9A24A]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF8A00]/15 rounded-full blur-3xl pointer-events-none" />

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#DBD8C0] mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A24A] w-4 h-4" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. admin@kerithcakes.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#DBD8C0] mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A24A] w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#DBD8C0] hover:text-[#FF8A00]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full orange-glow-btn py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="animate-spin w-4 h-4" />
                    <span>Verifying Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Admin Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Options for Configured Admins */}
            <div className="mt-5 pt-4 border-t border-[#3B1635] space-y-2">
              <span className="text-[11px] text-[#DBD8C0] block text-center">
                Quick 1-Click Login for Configured Admins ({adminUsers.length}/3):
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {adminUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(user)}
                    className="w-full py-2 px-3 rounded-xl bg-[#241124] border border-[#C9A24A]/30 hover:border-[#C9A24A] text-left text-xs text-white flex items-center justify-between transition-colors group"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <User size={13} className="text-[#C9A24A]" />
                      <strong className="text-white">{user.name}</strong>
                      <span className="text-[10px] text-gray-400">({user.email})</span>
                    </span>
                    <span className="text-[10px] text-[#FF8A00] font-bold group-hover:underline shrink-0">
                      Login →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-[#C9A24A] hover:text-[#FF8A00] inline-flex items-center gap-1.5"
            >
              ← Return to Live Store (Public View)
            </Link>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* AUTHENTICATED ADMIN DASHBOARD                             */
        /* ========================================================= */
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Admin Navigation & Metric Bar */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-[#C9A24A]/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#3B1635]">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#C9A24A] shrink-0 bg-[#241124]">
                  <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#FFF7EA]">
                      கேரித் Cakes Admin Dashboard
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1DD13]/20 text-[#C1DD13] border border-[#C1DD13]/30">
                      Live Manager
                    </span>
                  </div>
                  <p className="text-xs text-[#DBD8C0]">
                    Logged in as: <strong className="text-white">{currentLoggedInAdmin?.name}</strong> ({currentLoggedInAdmin?.email})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={handleOpenAddModal}
                  className="orange-glow-btn px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus size={15} />
                  <span>Add New Cake</span>
                </button>

                <Link
                  href="/"
                  target="_blank"
                  className="px-3.5 py-2.5 rounded-xl bg-[#241124] border border-[#C9A24A]/40 text-[#FFF7EA] hover:border-[#C9A24A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={13} className="text-[#C9A24A]" />
                  <span>View Live Site</span>
                </Link>

                <button
                  onClick={handleAdminLogout}
                  className="px-3 py-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 hover:bg-red-900/60 font-semibold text-xs flex items-center gap-1.5"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex items-center gap-2 pt-4 border-b border-[#3B1635]/60 overflow-x-auto">
              <button
                onClick={() => setActiveAdminTab("catalogue")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeAdminTab === "catalogue"
                    ? "bg-[#FF8A00] text-white shadow"
                    : "bg-[#020001] text-[#DBD8C0] hover:text-white"
                }`}
              >
                <Cake size={14} />
                <span>Cake Catalogue & Live Inventory ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab("admin_users")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeAdminTab === "admin_users"
                    ? "bg-[#FF8A00] text-white shadow"
                    : "bg-[#020001] text-[#DBD8C0] hover:text-white"
                }`}
              >
                <Users size={14} />
                <span>Admin Users Management ({adminUsers.length}/3)</span>
              </button>

              <button
                onClick={() => {
                  if (currentLoggedInAdmin) {
                    handleOpenEditAdminUser(currentLoggedInAdmin);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#020001] border border-[#C9A24A]/30 text-[#C9A24A] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ml-auto"
              >
                <KeyRound size={14} />
                <span>Change Email & Password</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
              <div className="bg-[#020001]/50 p-3.5 rounded-xl border border-[#3B1635]">
                <div className="text-[11px] text-[#DBD8C0]">Live Available Cakes</div>
                <div className="text-xl font-bold font-serif text-[#C1DD13] mt-0.5">
                  {products.filter((p) => p.isLive !== false).length}
                </div>
              </div>

              <div className="bg-[#020001]/50 p-3.5 rounded-xl border border-[#3B1635]">
                <div className="text-[11px] text-[#DBD8C0]">Paused / Off-Air Cakes</div>
                <div className="text-xl font-bold font-serif text-red-400 mt-0.5">
                  {products.filter((p) => p.isLive === false).length}
                </div>
              </div>

              <div className="bg-[#020001]/50 p-3.5 rounded-xl border border-[#3B1635]">
                <div className="text-[11px] text-[#DBD8C0]">Featured / Bestsellers</div>
                <div className="text-xl font-bold font-serif text-[#C9A24A] mt-0.5">
                  {products.filter((p) => p.isBestseller).length}
                </div>
              </div>

              <div className="bg-[#020001]/50 p-3.5 rounded-xl border border-[#3B1635]">
                <div className="text-[11px] text-[#DBD8C0]">Active Admin Accounts</div>
                <div className="text-xl font-bold font-serif text-[#FF8A00] mt-0.5">
                  {adminUsers.length} / 3
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: CAKE CATALOGUE & INVENTORY */}
          {activeAdminTab === "catalogue" && (
            <div className="space-y-4">
              {/* Search, Category Filter & Type Filter Bar */}
              <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A24A]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cakes by name or category..."
                    className="w-full pl-9 pr-4 py-2 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-[#020001]/80 border border-[#3B1635] text-xs font-semibold text-[#FFF7EA] rounded-xl focus:outline-none focus:border-[#FF8A00]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Status Type Chips */}
                <div className="flex items-center gap-1 bg-[#020001]/60 p-1 rounded-xl border border-[#3B1635] overflow-x-auto">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      filterType === "all" ? "bg-[#FF8A00] text-white" : "text-[#DBD8C0]"
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setFilterType("live")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      filterType === "live" ? "bg-[#C1DD13] text-black font-bold" : "text-[#DBD8C0]"
                    }`}
                  >
                    🟢 Live ({products.filter((p) => p.isLive !== false).length})
                  </button>
                  <button
                    onClick={() => setFilterType("paused")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      filterType === "paused" ? "bg-red-500 text-white" : "text-[#DBD8C0]"
                    }`}
                  >
                    🔴 Paused ({products.filter((p) => p.isLive === false).length})
                  </button>
                  <button
                    onClick={() => setFilterType("featured")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      filterType === "featured" ? "bg-[#FF8A00] text-white" : "text-[#DBD8C0]"
                    }`}
                  >
                    ⭐ Featured
                  </button>
                </div>
              </div>

              {/* Product Items Table */}
              <div className="glass-card rounded-2xl border border-[#C9A24A]/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#241124] text-[#C9A24A] font-bold uppercase tracking-wider text-[11px] border-b border-[#3B1635]">
                      <tr>
                        <th className="py-3.5 px-4">Live Status</th>
                        <th className="py-3.5 px-3">Cake</th>
                        <th className="py-3.5 px-3">Category</th>
                        <th className="py-3.5 px-3">Base Weight & Value</th>
                        <th className="py-3.5 px-3">Weight Pricing Breakdown</th>
                        <th className="py-3.5 px-3">Tags</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3B1635]/60 bg-[#020001]/60">
                      {filteredList.map((prod) => {
                        const isLive = prod.isLive !== false;
                        return (
                          <tr
                            key={prod.id}
                            className={`transition-colors ${
                              isLive ? "hover:bg-[#241124]/40" : "bg-red-950/10 hover:bg-red-950/20 opacity-80"
                            }`}
                          >
                            {/* Live Status Toggle */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  toggleLive(prod.id);
                                  showToast(`"${prod.name}" is now ${isLive ? "Paused (Off-air)" : "Live for ordering"}`);
                                }}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                                  isLive
                                    ? "bg-[#C1DD13]/20 text-[#C1DD13] border border-[#C1DD13]/40 hover:bg-[#C1DD13]/30"
                                    : "bg-red-900/30 text-red-300 border border-red-500/40 hover:bg-red-900/50"
                                }`}
                                title="Click to toggle live availability for customers"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isLive ? "bg-[#C1DD13] animate-pulse" : "bg-red-400"
                                  }`}
                                />
                                <span>{isLive ? "Live" : "Paused"}</span>
                              </button>
                            </td>

                            {/* Cake Photo + Name */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#241124] border border-[#C9A24A]/30 shrink-0">
                                  <Image
                                    src={prod.image}
                                    alt={prod.name}
                                    fill
                                    unoptimized={prod.image.startsWith("data:") || prod.image.startsWith("http")}
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-white text-sm">{prod.name}</div>
                                  <p className="text-[11px] text-[#DBD8C0]/70 truncate max-w-xs">
                                    {prod.description}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-lg bg-[#3B1635] text-[#C9A24A] text-[11px] font-semibold border border-[#C9A24A]/20 whitespace-nowrap">
                                {prod.category}
                              </span>
                            </td>

                            {/* Base Weight & Base Value (Configured by Admin) */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="bg-[#241124]/80 px-2.5 py-1.5 rounded-lg border border-[#C9A24A]/40 shadow-sm">
                                <div className="text-[10px] text-[#C9A24A] font-extrabold uppercase">
                                  Base: {prod.weight}
                                </div>
                                <div className="font-black text-[#FFF7EA] text-sm">
                                  ₹{prod.offerPrice.toLocaleString("en-IN")}
                                </div>
                                {prod.originalPrice > prod.offerPrice && (
                                  <span className="text-[10px] text-[#DBD8C0]/50 line-through">
                                    ₹{prod.originalPrice.toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Weight Pricing Breakdown */}
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {prod.availableWeights?.map((w) => {
                                  const calc = getProductPriceForWeight(prod, w);
                                  const isBase = w === prod.weight;
                                  return (
                                    <span
                                      key={w}
                                      className={`px-1.5 py-0.5 rounded text-[10px] border ${
                                        isBase
                                          ? "bg-[#3B1635] text-[#C9A24A] border-[#C9A24A] font-bold"
                                          : "bg-[#241124] text-[#DBD8C0] border-[#3B1635]"
                                      }`}
                                      title={`${w}: ₹${calc.offerPrice} ${isBase ? "(Base Reference)" : ""}`}
                                    >
                                      {w}: <strong className="text-white">₹{calc.offerPrice}</strong>
                                    </span>
                                  );
                                })}
                              </div>
                            </td>

                            {/* Tags (Featured & Offers) */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => toggleFeatured(prod.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold text-left transition-colors flex items-center gap-1 ${
                                    prod.isBestseller
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                      : "text-gray-500 hover:text-white"
                                  }`}
                                  title="Click to toggle Bestseller"
                                >
                                  <Star size={11} fill={prod.isBestseller ? "currentColor" : "none"} />
                                  {prod.isBestseller ? "Featured" : "Standard"}
                                </button>

                                {prod.isOffer && (
                                  <span className="px-2 py-0.2 rounded text-[9px] font-extrabold bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/40 w-fit">
                                    OFFER
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(prod)}
                                  className="p-1.5 rounded-lg bg-[#241124] text-[#C9A24A] hover:text-white hover:bg-[#3B1635] border border-[#C9A24A]/30 transition-colors"
                                  title="Edit Cake Details, Photos, Base Value & Weight Prices"
                                >
                                  <Edit2 size={14} />
                                </button>

                                <button
                                  onClick={() => handleDeleteCake(prod.id, prod.name)}
                                  className="p-1.5 rounded-lg bg-[#020001] text-red-400 hover:text-white hover:bg-red-900/60 border border-red-500/30 transition-colors"
                                  title="Delete Cake"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredList.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No cakes match the current search or filter criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN USERS MANAGEMENT (UP TO 3 USERS) */}
          {activeAdminTab === "admin_users" && (
            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-5 border border-[#C9A24A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold font-serif text-[#FFF7EA] flex items-center gap-2">
                    <Users size={18} className="text-[#C9A24A]" />
                    <span>Admin User Accounts ({adminUsers.length} / 3 Max)</span>
                  </h2>
                  <p className="text-xs text-[#DBD8C0] mt-0.5">
                    Up to 3 bakery administrators can be authorized to manage cakes, pricing, and live inventory.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddAdminUser}
                  disabled={adminUsers.length >= 3}
                  className="orange-glow-btn px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>Add Admin User ({adminUsers.length}/3)</span>
                </button>
              </div>

              {/* Admin Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {adminUsers.map((u) => {
                  const isCurrent = currentLoggedInAdmin?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      className={`glass-card rounded-2xl p-5 border relative flex flex-col justify-between ${
                        isCurrent
                          ? "border-[#FF8A00] shadow-lg bg-[#241124]/90"
                          : "border-[#C9A24A]/25 bg-[#020001]/70"
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8A00] text-white">
                          Current Session
                        </div>
                      )}

                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#3B1635] border border-[#C9A24A]/40 flex items-center justify-center text-[#C9A24A] font-bold mb-3">
                          <User size={18} />
                        </div>
                        <h3 className="font-bold text-base text-white">{u.name}</h3>
                        <p className="text-xs text-[#C9A24A] font-mono mt-0.5">{u.email}</p>
                        <p className="text-[11px] text-[#DBD8C0] mt-2">
                          Role: <span className="text-white font-semibold">{u.role}</span>
                        </p>
                        <div className="mt-2.5 p-2 rounded-lg bg-[#020001] border border-[#3B1635] text-[11px] text-gray-400">
                          Password: <span className="text-white font-mono">••••••••</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#3B1635] flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditAdminUser(u)}
                          className="px-3 py-1.5 rounded-lg bg-[#241124] text-[#C9A24A] hover:text-white border border-[#C9A24A]/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Edit2 size={12} /> Edit
                        </button>

                        {adminUsers.length > 1 && (
                          <button
                            onClick={() => handleDeleteAdminUser(u)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT CAKE MODAL                                     */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#020001]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#241124] border border-[#C9A24A]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative animate-fadeIn my-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#3B1635]">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#FFF7EA]">
                  {editingProduct ? `Edit Cake: ${editingProduct.name}` : "Add New Cake to Catalogue"}
                </h2>
                <p className="text-xs text-[#DBD8C0]">
                  Configure cake photos, categories, base weight selection & per-weight breakdown.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-[#020001] text-[#DBD8C0] hover:text-white border border-[#3B1635]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-5">
              {/* Live Status Switch */}
              <div className="p-3 rounded-xl bg-[#020001]/80 border border-[#3B1635] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Radio size={14} className={formIsLive ? "text-[#C1DD13]" : "text-gray-500"} />
                    Live Item Availability
                  </span>
                  <p className="text-[11px] text-[#DBD8C0]">
                    {formIsLive
                      ? "Cake is Live and available for customers to order on WhatsApp."
                      : "Cake is paused (hidden from customer menu / unavailable)."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsLive(!formIsLive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    formIsLive
                      ? "bg-[#C1DD13] text-black shadow-md"
                      : "bg-red-900/50 text-red-200 border border-red-500/40"
                  }`}
                >
                  {formIsLive ? "🟢 LIVE (Active)" : "🔴 PAUSED (Off-Air)"}
                </button>
              </div>

              {/* 1. Cake Name */}
              <div>
                <label className="block text-xs font-semibold text-[#DBD8C0] mb-1">
                  Cake Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Classic Black Forest Deluxe"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white"
                />
              </div>

              {/* 2. Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#DBD8C0] mb-1">
                  Category Selection *
                </label>
                <select
                  value={formCategoryId}
                  onChange={(e) => {
                    setFormCategoryId(e.target.value);
                    const matched = categories.find((c) => c.id === e.target.value);
                    if (matched) setFormCategory(matched.name);
                  }}
                  className="w-full px-3 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white"
                >
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* 3. Cake Photo Selection (Local Upload, Drag & Drop, Preset Gallery or URL) */}
              <div className="bg-[#020001]/70 p-4 rounded-2xl border border-[#3B1635] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#FFF7EA] flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-[#C9A24A]" />
                    <span>Cake Photo Upload & Selection:</span>
                  </label>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1 bg-[#241124] p-1 rounded-lg border border-[#3B1635]">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("upload")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        imageSourceMode === "upload"
                          ? "bg-[#FF8A00] text-white"
                          : "text-[#DBD8C0] hover:text-white"
                      }`}
                    >
                      📁 Local File / Drag & Drop
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("preset")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        imageSourceMode === "preset"
                          ? "bg-[#FF8A00] text-white"
                          : "text-[#DBD8C0] hover:text-white"
                      }`}
                    >
                      🎂 Bakery Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("url")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        imageSourceMode === "url"
                          ? "bg-[#FF8A00] text-white"
                          : "text-[#DBD8C0] hover:text-white"
                      }`}
                    >
                      🔗 Web URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#241124] border-2 border-[#C9A24A]/40 shrink-0 shadow-md">
                    <Image
                      src={formImage}
                      alt="Selected Cake Preview"
                      fill
                      unoptimized={formImage.startsWith("data:") || formImage.startsWith("http")}
                      className="object-cover"
                    />
                  </div>

                  {/* Upload Dropzone / Mode View */}
                  <div className="flex-1 w-full space-y-2">
                    {imageSourceMode === "upload" && (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                          isDraggingOver
                            ? "border-[#C1DD13] bg-[#C1DD13]/10 scale-[1.01]"
                            : "border-[#C9A24A]/40 hover:border-[#FF8A00] bg-[#241124]/50"
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              processImageFile(e.target.files[0]);
                            }
                          }}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                          <Upload size={20} className="text-[#FF8A00]" />
                          <p className="text-xs font-bold text-white">
                            Drag & drop cake image here, or{" "}
                            <span className="text-[#C9A24A] underline">browse local device</span>
                          </p>
                          <p className="text-[10px] text-[#DBD8C0]/70">
                            Supports JPG, PNG, WEBP • Automatically optimized for web
                          </p>
                        </div>
                      </div>
                    )}

                    {imageSourceMode === "preset" && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] text-[#DBD8C0]">
                          Pick from high-resolution bakery photography:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_IMAGES.map((img) => (
                            <button
                              key={img.path}
                              type="button"
                              onClick={() => setFormImage(img.path)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                formImage === img.path
                                  ? "bg-[#C9A24A] text-black font-bold border-[#C9A24A] shadow"
                                  : "bg-[#241124] text-[#DBD8C0] border-[#3B1635] hover:border-[#C9A24A]"
                              }`}
                            >
                              <span>🎂</span>
                              <span>{img.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {imageSourceMode === "url" && (
                      <div className="space-y-1">
                        <label className="block text-[11px] text-[#DBD8C0]">
                          Direct Image Link / CDN URL:
                        </label>
                        <input
                          type="text"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="https://example.com/cake-photo.jpg"
                          className="w-full px-3 py-2 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Description */}
              <div>
                <label className="block text-xs font-semibold text-[#DBD8C0] mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Rich fresh cream layered with dark chocolate ganache and cherries..."
                  className="w-full px-3.5 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white resize-none"
                />
              </div>

              {/* 5. Available Weights Selector (Select which weights this cake is baked in) */}
              <div className="pt-2 border-t border-[#3B1635]">
                <label className="block text-xs font-bold text-[#FFF7EA] mb-1.5">
                  Available Weights for Customers (Select all enabled sizes):
                </label>
                <div className="flex flex-wrap gap-2">
                  {STANDARD_WEIGHTS.map((w) => {
                    const isChecked = formAvailableWeights.includes(w);
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => handleToggleWeight(w)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                          isChecked
                            ? "bg-[#FF8A00] text-white border-[#FF8A00] shadow"
                            : "bg-[#020001] text-[#DBD8C0] border-[#3B1635]"
                        }`}
                      >
                        {isChecked && <Check size={12} />}
                        <span>{w}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Base Value Configuration (Drop View according to entered weights) */}
              <div className="bg-[#241124]/90 p-4 rounded-2xl border-2 border-[#C9A24A]/40 space-y-3">
                <div className="flex items-center justify-between border-b border-[#3B1635] pb-2">
                  <div>
                    <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                      Base Reference Value:
                    </span>
                    <p className="text-[11px] text-[#DBD8C0]">
                      Select the primary base weight from your enabled weights list below.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#C9A24A] text-black">
                    BASE ITEM
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Drop View of Base Weight */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#FFF7EA] mb-1">
                      Base Weight (Drop View) *
                    </label>
                    <div className="relative">
                      <select
                        value={formBaseWeight}
                        onChange={(e) => handleSelectBaseWeight(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 bg-[#020001] border border-[#C9A24A] text-xs font-bold text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF8A00] appearance-none cursor-pointer"
                      >
                        {formAvailableWeights.map((w) => {
                          const p = formWeightPrices[w] || { offerPrice: formOfferPrice };
                          return (
                            <option key={w} value={w}>
                              {w} (₹{p.offerPrice})
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A24A] pointer-events-none" />
                    </div>
                  </div>

                  {/* Base Offer Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#FF8A00] mb-1">
                      Base Offer Value (₹) *
                    </label>
                    <input
                      type="number"
                      value={formOfferPrice}
                      onChange={(e) => handleBasePriceInputsChange(Number(e.target.value), formOriginalPrice)}
                      className="w-full px-3 py-2 bg-[#020001] border border-[#FF8A00] text-xs font-black text-white rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Base Original Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">
                      Base Original Value (₹) *
                    </label>
                    <input
                      type="number"
                      value={formOriginalPrice}
                      onChange={(e) => handleBasePriceInputsChange(formOfferPrice, Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#020001] border border-[#3B1635] text-xs font-bold text-gray-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 7. Per-Weight Price & Offer Configuration Table */}
              <div className="bg-[#020001]/70 p-4 rounded-2xl border border-[#3B1635] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C9A24A]">
                    Per-Weight Pricing Breakdown:
                  </span>
                  <span className="text-[10px] text-[#DBD8C0]">
                    Customer price changes when weight is clicked
                  </span>
                </div>

                <div className="space-y-2">
                  {formAvailableWeights.map((w) => {
                    const currentWP = formWeightPrices[w] || {
                      offerPrice: formOfferPrice,
                      originalPrice: formOriginalPrice,
                    };
                    const isBase = w === formBaseWeight;
                    return (
                      <div
                        key={w}
                        className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border transition-colors ${
                          isBase
                            ? "bg-[#3B1635]/90 border-[#C9A24A] shadow"
                            : "bg-[#241124]/60 border-[#3B1635]/60"
                        }`}
                      >
                        <div className="col-span-3 text-xs font-bold text-white flex items-center gap-1.5">
                          <Cake size={13} className={isBase ? "text-[#C9A24A]" : "text-[#DBD8C0]"} />
                          <span>{w}</span>
                          {isBase && (
                            <span className="text-[9px] bg-[#C9A24A] text-black px-1.5 py-0.2 rounded font-extrabold">
                              BASE
                            </span>
                          )}
                        </div>
                        <div className="col-span-4">
                          <label className="block text-[10px] text-[#FF8A00] font-semibold">
                            Offer Price (₹)
                          </label>
                          <input
                            type="number"
                            value={currentWP.offerPrice}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormWeightPrices({
                                ...formWeightPrices,
                                [w]: {
                                  ...currentWP,
                                  offerPrice: val,
                                },
                              });
                              if (isBase) setFormOfferPrice(val);
                            }}
                            className="w-full px-2 py-1 bg-[#020001] border border-[#3B1635] rounded-lg text-xs font-bold text-white focus:border-[#FF8A00]"
                          />
                        </div>
                        <div className="col-span-4">
                          <label className="block text-[10px] text-gray-400">
                            Original Price (₹)
                          </label>
                          <input
                            type="number"
                            value={currentWP.originalPrice}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormWeightPrices({
                                ...formWeightPrices,
                                [w]: {
                                  ...currentWP,
                                  originalPrice: val,
                                },
                              });
                              if (isBase) setFormOriginalPrice(val);
                            }}
                            className="w-full px-2 py-1 bg-[#020001] border border-[#3B1635] rounded-lg text-xs text-gray-300 focus:border-[#FF8A00]"
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          {currentWP.originalPrice > currentWP.offerPrice && (
                            <span className="text-[10px] font-bold text-[#C1DD13]">
                              {Math.round(
                                ((currentWP.originalPrice - currentWP.offerPrice) /
                                  currentWP.originalPrice) *
                                  100
                              )}
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 8. Badges */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#FFF7EA]">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                    className="rounded bg-[#020001] border-[#3B1635] text-[#FF8A00] focus:ring-[#FF8A00] h-4 w-4"
                  />
                  <span>⭐ Mark as Featured / Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#FFF7EA]">
                  <input
                    type="checkbox"
                    checked={formIsOffer}
                    onChange={(e) => setFormIsOffer(e.target.checked)}
                    className="rounded bg-[#020001] border-[#3B1635] text-[#FF8A00] focus:ring-[#FF8A00] h-4 w-4"
                  />
                  <span>🏷️ Show Special Offer Badge</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3B1635]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#020001] text-xs font-semibold text-[#DBD8C0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="orange-glow-btn px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{editingProduct ? "Save Changes" : "Add Cake"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT ADMIN USER MODAL (Up to 3 Users)               */}
      {/* ========================================================= */}
      {isAdminUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#020001]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#241124] border border-[#C9A24A]/40 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 relative animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#3B1635]">
              <div>
                <h2 className="text-lg font-bold font-serif text-[#FFF7EA]">
                  {editingAdminUser ? "Edit Admin Credentials" : "Add New Admin User"}
                </h2>
                <p className="text-xs text-[#DBD8C0]">
                  Configure login name, email, and secret password.
                </p>
              </div>
              <button
                onClick={() => setIsAdminUserModalOpen(false)}
                className="p-1.5 rounded-full bg-[#020001] text-[#DBD8C0] hover:text-white border border-[#3B1635]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdminUser} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-[#DBD8C0] mb-1">
                  Admin Name *
                </label>
                <input
                  type="text"
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  placeholder="e.g. Master Baker Indumathi"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBD8C0] mb-1">
                  Admin Login Email *
                </label>
                <input
                  type="email"
                  value={userFormEmail}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  placeholder="admin@kerithcakes.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBD8C0] mb-1">
                  Admin Password *
                </label>
                <input
                  type="text"
                  value={userFormPassword}
                  onChange={(e) => setUserFormPassword(e.target.value)}
                  placeholder="Create strong password"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#020001]/80 border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3B1635]">
                <button
                  type="button"
                  onClick={() => setIsAdminUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#020001] text-xs font-semibold text-[#DBD8C0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="orange-glow-btn px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Save Admin User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

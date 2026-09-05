"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSendPlaneFill,
  RiMapPin2Line,
  RiPhoneLine,
  RiMailSendLine,
  RiGlobalLine,
  RiTimeLine,
  RiSparklingFill,
  RiCheckDoubleLine,
  RiExternalLinkLine,
  RiChat3Line,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckboxCircleFill,
  RiFolderLine,
  RiUser3Line,
  RiFileTextLine,
  RiRestartLine,
} from "react-icons/ri";

type ProjectRequestForm = {
  projectName: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  deadline: string;
  message: string;
};

export default function Contact() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProjectRequestForm>({
    projectName: "",
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    deadline: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Listen for custom project type selection from Services section
  useEffect(() => {
    const handleSelectType = (
      e: CustomEvent<{
        projectType: string;
        defaultMessage: string;
        defaultTitle: string;
      }>,
    ) => {
      if (e.detail) {
        setFormData((prev) => ({
          ...prev,
          projectType: e.detail.projectType || prev.projectType,
          projectName: e.detail.defaultTitle || prev.projectName,
          message: e.detail.defaultMessage || prev.message,
        }));
        setCurrentStep(1);
        setIsSuccess(false);
      }
    };
    window.addEventListener(
      "select-project-type",
      handleSelectType as EventListener,
    );
    return () =>
      window.removeEventListener(
        "select-project-type",
        handleSelectType as EventListener,
      );
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const contactInfo = {
    address: "Banadir, Mogadishu, Somalia",
    phone: "+252618294023",
    email: "maxamedaweys90@gmail.com",
    website: "https://engaweis.dev",
    timezone: "EAT (UTC+3)",
    availability: "Available for new projects & roles",
  };

  const projectTypes = [
    "Web Application",
    "Mobile App (React Native)",
    "Full-Stack Solution",
    "Database & API Backend",
    "Performance Optimization",
    "Other Engineering Inquiry",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.info(`Copied ${field} to clipboard!`, {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: true,
      theme: "dark",
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.projectName.trim()) {
        toast.warn("Please enter a project name or title", {
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }
      if (!formData.projectType) {
        toast.warn("Please select a project category", {
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.name.trim()) {
        toast.warn("Please enter your name", {
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        toast.warn("Please enter a valid email address", {
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.warn("Please provide your project details or message", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    const sent_time = new Date().toLocaleString("en-GB", {
      timeZone: "Africa/Mogadishu",
    });

    try {
      const res = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sent_time }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setIsSuccess(true);
        toast.success("🚀 Proposal sent successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          theme: "dark",
        });
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to send request: ${message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: "",
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      deadline: "",
      message: "",
    });
    setCurrentStep(1);
    setIsSuccess(false);
  };

  const stepLabels = [
    { number: 1, title: "Project Info", icon: RiFolderLine },
    { number: 2, title: "Your Info", icon: RiUser3Line },
    { number: 3, title: "Scope & Deadline", icon: RiFileTextLine },
  ];

  return (
    <section
      id="contact"
      className="py-20 lg:py-28 bg-mainBg border-t border-borderSubtle relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brandAccent/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-secondaryAccent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brandAccent/10 border border-brandAccent/30 text-brandAccent text-xs font-bold uppercase tracking-widest shadow-sm">
            <RiSparklingFill className="text-sm" />
            Let&apos;s Build Something Great
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-primaryText tracking-tight">
            START A PROJECT OR SAY HELLO
          </h2>
          <p className="text-mutedText text-sm sm:text-base leading-relaxed">
            Have a product in mind, need software engineering expertise, or want
            to collaborate? Send a message and I will reply within 24 hours.
          </p>
        </motion.div>

        {/* Main Content: Info Hub (Left) & Request Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Quick Action Cards (5 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-3.5"
          >
            {/* Live Status Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-surface/90 backdrop-blur-md border border-borderSubtle shadow-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  Live Status
                </span>
                <span className="text-xs font-mono font-bold text-mutedText bg-mainBg px-2.5 py-1 rounded-lg border border-borderSubtle">
                  {contactInfo.timezone}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primaryText">
                  {contactInfo.availability}
                </h3>
                <p className="text-xs text-mutedText mt-1">
                  Open to fullstack development, mobile apps, contract work, and
                  consulting.
                </p>
              </div>
            </div>

            {/* Quick Contact Links List */}
            <div className="space-y-3">
              {/* Email Card */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-surface/85 backdrop-blur-md border border-borderSubtle hover:border-brandAccent/50 transition-all duration-300 flex items-center justify-between group shadow-md">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-brandAccent/10 text-brandAccent border border-brandAccent/20 text-lg group-hover:scale-110 transition-transform">
                    <RiMailSendLine />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-mutedText uppercase tracking-wider">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm font-semibold text-primaryText hover:text-brandAccent transition-colors truncate block"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(contactInfo.email, "email")}
                  title="Copy email"
                  className="px-3 py-1.5 rounded-lg bg-mainBg border border-borderSubtle text-xs font-medium text-mutedText hover:text-primaryText hover:border-brandAccent/40 transition-colors ml-2 shrink-0"
                >
                  {copiedField === "email" ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Phone / WhatsApp Card */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-surface/85 backdrop-blur-md border border-borderSubtle hover:border-emerald-500/50 transition-all duration-300 flex items-center justify-between group shadow-md">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-lg group-hover:scale-110 transition-transform">
                    <RiPhoneLine />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-mutedText uppercase tracking-wider">
                      Direct Call / WhatsApp
                    </p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm font-semibold text-primaryText hover:text-emerald-400 transition-colors truncate block"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${contactInfo.phone.replace("+", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors ml-2 shrink-0 flex items-center gap-1"
                >
                  <RiChat3Line /> Chat
                </a>
              </div>

              {/* Location Card */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-surface/85 backdrop-blur-md border border-borderSubtle hover:border-sky-400/50 transition-all duration-300 flex items-center justify-between group shadow-md">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 text-lg group-hover:scale-110 transition-transform">
                    <RiMapPin2Line />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-mutedText uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-primaryText truncate">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 shrink-0 ml-2">
                  Somalia 🇸🇴
                </span>
              </div>

              {/* Portfolio Domain */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-surface/85 backdrop-blur-md border border-borderSubtle hover:border-purple-400/50 transition-all duration-300 flex items-center justify-between group shadow-md">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-lg group-hover:scale-110 transition-transform">
                    <RiGlobalLine />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-mutedText uppercase tracking-wider">
                      Website
                    </p>
                    <a
                      href={contactInfo.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-primaryText hover:text-purple-400 transition-colors truncate block"
                    >
                      engaweis.dev
                    </a>
                  </div>
                </div>
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit external website"
                  className="p-2 rounded-lg bg-mainBg border border-borderSubtle text-mutedText hover:text-primaryText transition-colors shrink-0 ml-2"
                >
                  <RiExternalLinkLine className="text-base" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3-Step Stepper Project Request Form (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-xl border border-borderSubtle shadow-2xl relative">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Header Title */}
                  <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-primaryText">
                        Project Request Form
                      </h3>
                      <p className="text-xs text-mutedText mt-0.5">
                        Step {currentStep} of 3 • Quick & easy proposal
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-brandAccent bg-brandAccent/10 px-3 py-1 rounded-full border border-brandAccent/30">
                      STEP {currentStep} / 3
                    </span>
                  </div>

                  {/* High-End Connected Stepper Bar */}
                  <div className="relative py-2">
                    {/* Background Track */}
                    <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-mainBg border border-borderSubtle/50 rounded-full -z-0">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brandAccent to-secondaryAccent rounded-full"
                        initial={false}
                        animate={{
                          width:
                            currentStep === 1
                              ? "0%"
                              : currentStep === 2
                                ? "50%"
                                : "100%",
                        }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Step Nodes */}
                    <div className="relative z-10 flex items-center justify-between">
                      {stepLabels.map((step) => {
                        const isActive = currentStep === step.number;
                        const isDone = currentStep > step.number;
                        return (
                          <button
                            key={`step-btn-${step.number}`}
                            type="button"
                            onClick={() => {
                              if (step.number < currentStep) {
                                setCurrentStep(step.number);
                              }
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface transition-all duration-300 ${
                              isActive
                                ? "border-2 border-brandAccent shadow-lg shadow-brandAccent/20 scale-105"
                                : isDone
                                  ? "border border-emerald-500/50 cursor-pointer"
                                  : "border border-borderSubtle opacity-70"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                                isActive
                                  ? "bg-brandAccent text-white shadow-sm"
                                  : isDone
                                    ? "bg-emerald-500 text-white shadow-sm"
                                    : "bg-mainBg text-mutedText"
                              }`}
                            >
                              {isDone ? (
                                <RiCheckboxCircleFill className="text-sm" />
                              ) : (
                                step.number
                              )}
                            </div>
                            <span
                              className={`text-xs font-bold hidden sm:inline ${
                                isActive
                                  ? "text-primaryText"
                                  : isDone
                                    ? "text-emerald-400"
                                    : "text-mutedText"
                              }`}
                            >
                              {step.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step Content Containers */}
                  <AnimatePresence mode="wait">
                    {/* STEP 1: Project Info */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4 pt-1"
                      >
                        {/* Project Name */}
                        <div>
                          <label className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                            Project Name / Title{" "}
                            <span className="text-brandAccent">*</span>
                          </label>
                          <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            placeholder="e.g. Modern SaaS Platform, E-Commerce App..."
                            className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm placeholder-mutedText/60 focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all"
                            required
                          />
                        </div>

                        {/* Project Type & Budget */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="projectType" className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                              Project Category{" "}
                              <span className="text-brandAccent">*</span>
                            </label>
                            <select
                              id="projectType"
                              name="projectType"
                              value={formData.projectType}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all cursor-pointer"
                              required
                            >
                              <option value="" disabled>
                                Select a Category
                              </option>
                              {projectTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="budget" className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                              Budget Range
                            </label>
                            <input
                              id="budget"
                              type="text"
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              placeholder="e.g. $1,000 - $3,000"
                              className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm placeholder-mutedText/60 focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: User Info */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4 pt-1"
                      >
                        <div>
                          <label className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                            Your Full Name{" "}
                            <span className="text-brandAccent">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe / Company Name"
                            className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm placeholder-mutedText/60 focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                              Email Address{" "}
                              <span className="text-brandAccent">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="john@example.com"
                              className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm placeholder-mutedText/60 focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                              Phone / WhatsApp (Optional)
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="e.g. +252 61..."
                              className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm placeholder-mutedText/60 focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Message & Target Deadline */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4 pt-1"
                      >
                        <div>
                          <label className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                            Target Deadline
                          </label>
                          <input
                            type="date"
                            name="deadline"
                            min={today}
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-primaryText uppercase tracking-wider mb-2">
                            Project Details & Scope{" "}
                            <span className="text-brandAccent">*</span>
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe your project goals, key features, tech stack preferences, or specific timeline..."
                            className="w-full px-4 py-3 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm placeholder-mutedText/60 focus:outline-none focus:border-brandAccent focus:ring-2 focus:ring-brandAccent/20 transition-all resize-none"
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons (Back / Next / Submit) */}
                  <div className="flex items-center justify-between pt-2 border-t border-borderSubtle/60">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-mainBg border border-borderSubtle text-primaryText text-sm font-bold hover:border-brandAccent/40 hover:bg-surface transition-all"
                      >
                        <RiArrowLeftLine /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brandAccent to-secondaryAccent text-white font-bold text-sm hover:shadow-lg hover:shadow-brandAccent/20 hover:scale-105 transition-all shadow-md ml-auto"
                      >
                        Next Step <RiArrowRightLine />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-brandAccent via-secondaryAccent to-sky-400 text-white font-extrabold text-sm hover:shadow-xl hover:shadow-brandAccent/30 hover:scale-105 transition-all shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <span className="loading loading-spinner loading-sm" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <RiSendPlaneFill className="text-base" />
                            <span>Send Project Proposal</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-between text-[11px] text-mutedText pt-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <RiCheckDoubleLine className="text-sm" /> NDA & Privacy
                      Protected
                    </span>
                    <span>No spam guaranteed</span>
                  </div>
                </form>
              ) : (
                /* Success Message State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 px-4 space-y-5"
                >
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/10">
                    <RiCheckboxCircleFill />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-primaryText">
                      Proposal Sent Successfully! 🚀
                    </h3>
                    <p className="text-sm text-mutedText max-w-md mx-auto leading-relaxed">
                      Thank you{" "}
                      <strong className="text-primaryText">
                        {formData.name}
                      </strong>
                      ! Your project inquiry for{" "}
                      <strong className="text-primaryText">
                        &quot;{formData.projectName}&quot;
                      </strong>{" "}
                      has been delivered. I will review your requirements and
                      get back to you at{" "}
                      <strong className="text-primaryText">
                        {formData.email}
                      </strong>{" "}
                      within 24 hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-mainBg border border-borderSubtle text-xs text-mutedText max-w-md mx-auto flex items-center justify-between">
                    <span>Target Response:</span>
                    <span className="text-brandAccent font-bold">
                      Under 24 Hours ⚡
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface border border-borderSubtle text-primaryText font-bold text-sm hover:border-brandAccent hover:text-brandAccent transition-all shadow-md"
                  >
                    <RiRestartLine /> Send Another Project Request
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full-Width Turnaround Guarantee Banner spanning across the entire section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 p-4 sm:p-5 rounded-3xl bg-surface/85 backdrop-blur-md border border-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-mutedText shadow-xl hover:border-brandAccent/40 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <span className="p-2.5 rounded-2xl bg-brandAccent/10 text-brandAccent border border-brandAccent/20 text-lg shadow-sm">
              <RiTimeLine />
            </span>
            <span>
              Standard response time:{" "}
              <strong className="text-primaryText font-bold">
                Under 24 hours
              </strong>{" "}
              across all communication channels.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <RiCheckDoubleLine className="text-base" /> Direct Engineer Access
            </span>
            <span className="hidden sm:inline text-borderSubtle">|</span>
            <span className="text-primaryText font-mono bg-mainBg px-2.5 py-1 rounded-lg border border-borderSubtle">
              UTC+3 (EAT)
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

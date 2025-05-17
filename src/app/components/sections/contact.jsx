"use client";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane, FaGlobe } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ProjectRequest = () => {
  const [formData, setFormData] = useState({
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

  // Today's date for min deadline
  const today = new Date().toISOString().split("T")[0];

  const contactInfo = {
    address: "Banadir, Mogadishu, Somalia",
    phone: "+252618294023",
    email: "maxamedaweys90@gmail.com",
    website: "https://engaweis.space",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const sent_time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Mogadishu" });

    try {
      const res = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sent_time }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Project request sent successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
          style: { fontSize: "1.25rem", height: "80px", display: "flex", alignItems: "center" },
        });
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
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error(`Failed to send request: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        style: { fontSize: "1.1rem" },
      });
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: <FaMapMarkerAlt size={26} />, label: "Address", value: contactInfo.address },
    {
      icon: <FaPhoneAlt size={26} />,
      label: "Phone",
      value: <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>,
    },
    {
      icon: <FaPaperPlane size={26} />,
      label: "Email",
      value: <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>,
    },
    {
      icon: <FaGlobe size={26} />,
      label: "Website",
      value: <a href={contactInfo.website} target="_blank" rel="noreferrer">{contactInfo.website}</a>,
    },
  ];

  return (
    <>
      {/* ToastContainer must be present once at root of this tree */}
      <div className="py-16 px-4 md:px-10 bg-amber-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-primary text-sm uppercase tracking-wider">
              Let’s Start Your Project
            </h3>
            <h2 className="section-header after:bg-white">Project Request</h2>
            <p className="text-gray-600">Have a project in mind? Share your details with us!</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.form
              onSubmit={handleSubmit}
              className="md:col-span-2 space-y-6 bg-white p-8 rounded-lg shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Project Name */}
              <div className="flex flex-col">
                <label htmlFor="projectName" className="mb-2 font-medium text-gray-800">
                  Project Name
                </label>
                <input
                  id="projectName"
                  name="projectName"
                  type="text"
                  placeholder="Project Name"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-2 font-medium text-gray-800">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-2 font-medium text-gray-800">Your Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Phone & Project Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="phone" className="mb-2 font-medium text-gray-800">Your Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="projectType" className="mb-2 font-medium text-gray-800">Project Type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Project Type</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Custom Solution">Custom Solution</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Budget & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="budget" className="mb-2 font-medium text-gray-800">Estimated Budget</label>
                  <input
                    id="budget"
                    name="budget"
                    type="text"
                    placeholder="Estimated Budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="deadline" className="mb-2 font-medium text-gray-800">Project Deadline</label>
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={today}
                    className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label htmlFor="message" className="mb-2 font-medium text-gray-800">
                  Additional Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Additional Project Details"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 bg-amber-100 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={` text-white px-6 py-3 rounded font-semibold transition ${
                  loading ? "bg-gray-400" : "bg-red-600 hover:opacity-90"
                }`}
              >
                {loading ? "Sending…" : "Send Request"}
              </button>
            </motion.form>

            <motion.div
              className="space-y-6 flex flex-col justify-center gap-4 md:gap-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {contactItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-16 h-20 flex items-center justify-center rounded-md bg-white shadow border border-gray-200">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.label}</p>
                    <p className="text-gray-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="mt-12 p-3 rounded-md bg-white shadow border border-gray-200"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.835401413405!2d45.31860357581237!3d2.0529041979735487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d58ab1f37ac52e7%3A0x70ed7ff3a3a8477a!2sSuug%20Bacaad!5e0!3m2!1sen!2sso!4v1715142619231!5m2!1sen!2sso"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Map"
              className="rounded shadow"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProjectRequest;

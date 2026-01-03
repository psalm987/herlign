"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";

const ContactFormSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSubmitStatus(null);

    // Form data preparation matching ConvertKit's expected format
    const formPayload = new FormData();
    formPayload.append("fields[first_name]", formData.firstName);
    formPayload.append("email_address", formData.email);
    formPayload.append("fields[message]", formData.message);
    formPayload.append("form", "8934032");

    try {
      console.log("about to send");
      const response = await fetch(
        "https://app.kit.com/forms/8934032/subscriptions",
        {
          method: "POST",
          body: formPayload,
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("response", response);

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ firstName: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submit error", err);
      setSubmitStatus("error");
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-ohrange-500 py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative">
      <Image
        src="/images/png/patterns/ohrange-400-mini.png"
        alt=""
        fill
        className="absolute h-auto w-screen object-cover"
      />
      <div className="max-w-5xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg relative">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column - Header */}
          <div className="relative flex flex-col justify-end p-8 md:p-12 text-center md:text-left bg-ohrange-500 ">
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Let&apos;s Chat. No, Really.
              </h2>
              <p className="text-white opacity-90">
                Have a question? Want to suggest a workshop? Just feel like
                saying hi? We&apos;re all ears.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-8 md:p-12">
            {/* Error Alert */}
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-ohrange-50 border border-ohrange-200 text-ohrange-700 rounded">
                {error || "Please check your information and try again."}
              </div>
            )}

            {/* Success Message */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                Success! Now check your email to confirm your subscription.
              </div>
            )}

            <form onSubmit={handleSubmit} className="">
              <div className="space-y-6">
                {/* First Name Field */}
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="w-full block px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 placeholder-gray-500"
                  aria-label="First Name"
                />

                {/* Email Field */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full block px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 placeholder-gray-500"
                  aria-label="Email Address"
                />

                {/* Message Field */}
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  className="w-full block px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 placeholder-gray-500"
                  aria-label="Your Message"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="xl"
                  className={
                    isSubmitting
                      ? "bg-ohrange-500"
                      : "bg-ohrange-500 hover:bg-orange-700"
                  }
                >
                  {isSubmitting ? "Sending..." : "Subscribe"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;

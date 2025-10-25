import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    { icon: Phone, title: "Phone", details: ["+91 98765 43210", "+91 98765 43211"], color: "from-blue-400 to-blue-500" },
    { icon: Mail, title: "Email", details: ["info@kolharyatrinivas.com", "bookings@kolharyatrinivas.com"], color: "from-orange-400 to-rose-400" },
    { icon: MapPin, title: "Location", details: ["Kolhar, Karnataka", "India - 585316"], color: "from-green-400 to-emerald-500" },
    { icon: Clock, title: "Working Hours", details: ["24/7 Reception", "Check-in: 2:00 PM | Check-out: 11:00 AM"], color: "from-purple-400 to-pink-500" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.integrations.Core.SendEmail({
        to: "info@kolharyatrinivas.com",
        subject: `Contact Form: ${formData.subject}`,
        body: `\n          New contact form submission:\n          \n          Name: ${formData.name}\n          Email: ${formData.email}\n          Phone: ${formData.phone}\n          Subject: ${formData.subject}\n          \n          Message:\n          ${formData.message}\n        `
      });

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1920"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-orange-900/60 to-rose-900/80" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            We're here to help. Reach out to us anytime!
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center`}>
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 text-sm leading-relaxed">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@example.com"
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          placeholder="Booking inquiry"
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us how we can help you..."
                        required
                        className="mt-2 h-32"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us Here</h2>
            <p className="text-lg text-gray-600">
              Located in the beautiful town of Kolhar, Karnataka
            </p>
          </motion.div>

              <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-2xl h-96 bg-gray-200"
          >
            <iframe
              src="https://maps.google.com/maps?q=Kolhar%20Yatri%20Nivas&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kolhar Yatri Nivas Location"
            />
          </motion.div>
          <div className="text-center mt-4">
            <a
              href="https://maps.app.goo.gl/jk42AHrw54h2vC8J7"
              target="_blank"
              rel="noreferrer"
              className="text-orange-600 hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}



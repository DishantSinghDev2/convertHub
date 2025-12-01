"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have questions or feedback? We'd love to hear from you. Reach out to our team.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground">contact@c.tools.dishis.tech</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <MapPin className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">India</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <Phone className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <p className="text-muted-foreground">Email support available 24/7</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Message subject"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Your message here..."
              />
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto">
              {submitted ? "Message Sent!" : "Send Message"}
            </Button>
          </form>
        </div>
      </section>

      {/* Company Info */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h2 className="text-2xl font-bold mb-6">DishIs Technologies</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-muted-foreground">
                DishIs Technologies is committed to providing efficient, privacy-first file conversion solutions. Based
                in India, we serve users worldwide with our secure and fast conversion tools.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> contact@c.tools.dishis.tech
                </p>
                <p className="text-muted-foreground">
                  <strong>Website:</strong> c.tools.dishis.tech
                </p>
                <p className="text-muted-foreground">
                  <strong>Location:</strong> India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

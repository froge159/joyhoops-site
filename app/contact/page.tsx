"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Menu, X, Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    interest: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      interest: "",
    })
    alert("Thank you for your message! We'll get back to you soon.")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-[#FAFAFA]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAFAFA]/90 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <Link href="/" className="text-xl font-bold text-[#2E2E2E] hidden sm:block">
              JoyHoops
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/about" className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors">
              About Us
            </Link>
            <Link href="/team" className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors">
              Our Team
            </Link>
            <Link
              href="/programs"
              className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors"
            >
              Programs
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#3DA9FC] border-b-2 border-[#3DA9FC] pb-1">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#2E2E2E] text-[#2E2E2E] hover:bg-[#2E2E2E]/10 bg-transparent"
              asChild
            >
              <Link href="/register">Register</Link>
            </Button>
            <Button size="sm" className="bg-[#3DA9FC] hover:bg-[#2b8ce6]" asChild>
              <Link href="/login">Login</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 border-t bg-[#FAFAFA]/95 backdrop-blur shadow-lg transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="container px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/team"
                className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Team
              </Link>
              <Link
                href="/programs"
                className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Programs
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-[#3DA9FC] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 bg-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              width="1200"
              height="600"
              alt="JoyHoops community members connecting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2E2E2E]/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-white drop-shadow-lg">
                  Get In Touch
                </h1>
                <p className="max-w-[900px] text-gray-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed drop-shadow-md">
                  Ready to join our community? We'd love to hear from you!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Ways to Connect</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the method that works best for you to get in touch or join our organization
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="h-16 w-16 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-6 shadow-md">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Email Us</CardTitle>
                  <CardDescription className="text-slate-600 mb-4">
                    Send us a message using the form below or directly at:
                  </CardDescription>
                  <div className="space-y-2">
                    <p className="text-[#3DA9FC] font-medium">info@joyhoops.org</p>
                    <p className="text-sm text-slate-500">We respond within 24 hours</p>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="h-16 w-16 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-6 shadow-md">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">WeChat</CardTitle>
                  <CardDescription className="text-slate-600 mb-4">
                    Connect with us on WeChat for quick communication and updates:
                  </CardDescription>
                  <div className="space-y-2">
                    <p className="text-[#FF6B35] font-medium">JoyHoops2024</p>
                    <p className="text-sm text-slate-500">Scan QR code or search our ID</p>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="h-16 w-16 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-6 shadow-md">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Call Us</CardTitle>
                  <CardDescription className="text-slate-600 mb-4">
                    Speak directly with our team for immediate assistance:
                  </CardDescription>
                  <div className="space-y-2">
                    <p className="text-[#3DA9FC] font-medium">(555) 123-HOOP</p>
                    <p className="text-sm text-slate-500">Mon-Fri 9AM-6PM</p>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-6 h-6 bg-[#3DA9FC] rounded-full shadow-sm">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-[#2E2E2E]">JoyHoops</span>
        </div>
        <p className="text-xs text-slate-500 sm:ml-4">© 2024 JoyHoops. Bringing joy through sports.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4 text-[#FF6B35]" />
            <span className="text-xs text-slate-600">WeChat: JoyHoops2024</span>
          </div>
        </nav>
      </footer>
    </div>
  )
}

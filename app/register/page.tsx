"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Trophy, Menu, X, Eye, EyeOff, User, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { register, setOAuthCookies } from "./actions";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr'
import { createClient } from "../clients/client";

export default function RegisterPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phone: "",
  })
  const [registerClicked, setRegisterClicked] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_OAUTH_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateEmail = (email:String) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


  const handleGoogleLogin = async () => {
    await setOAuthCookies({
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
    });
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    }).catch((error) => {
      console.error("google registration failed:", error);
      alert("Google registration failed. Please try again.");
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterClicked(true);
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      setRegisterClicked(false);
      return
    }
    if (formData.password.length < 8 || formData.password.search(/[A-Z]/) === -1 || formData.password.search(/[a-z]/) === -1 || formData.password.search(/[0-9]/) === -1) {
      alert("Password must be at least 8 characters long and include uppercase, lowercase, and numbers.")
      setRegisterClicked(false);
      return
    }
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      setRegisterClicked(false);
      return;
    }
    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
    });

    if (!result?.success) {
      if (result?.error === "Email already registered.") {
        alert("This email is already registered.");
        return;
      }
      alert("Registration failed: " + result.error);
      setRegisterClicked(false);
      return;
    }

    if (result?.success) {
      const response = await fetch("/api/set-access-cookie", {method: "POST", body: JSON.stringify({name: "pendingEmail", value: "true", remove: false})});
      if (!response.ok) {
        console.error("Failed to set access cookie");
        alert("Error setting access cookie");
        return;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem("pendingEmail", formData.email);
      }
      router.push("/email-verify");
    }
    
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
            <Link href="/contact" className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors">
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
                className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#2E2E2E] mb-4">Join JoyHoops</h1>
              <p className="text-slate-600 md:text-lg">Create your account to get started with our sports programs</p>
            </div>

            {/* Registration Form */}
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader className="pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#2E2E2E] flex items-center">
                      <User className="h-5 w-5 mr-2 text-[#3DA9FC]" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-[#2E2E2E]">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                          placeholder="Your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-[#2E2E2E]">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-[#2E2E2E]">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-[#2E2E2E]">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium text-[#2E2E2E]">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                        placeholder="Your full address"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="text-sm font-medium text-[#2E2E2E]">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                      />
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#2E2E2E] flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-[#3DA9FC]" />
                      Account Security
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-[#2E2E2E]">
                          Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                            placeholder="Create a strong password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-slate-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-[#2E2E2E]">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-slate-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] shadow-lg text-white"
                    disabled={registerClicked}
                  >
                    Create Account
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#3DA9FC] hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
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
      </footer>
    </div>
  )
}

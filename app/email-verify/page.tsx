"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Heart, Trophy, Menu, X, MessageCircle, Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function EmailVerifyPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [email, setEmail] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setVerificationStatus("idle")
    setErrorMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock verification logic
      if (verificationCode === "123456") {
        setVerificationStatus("success")
      } else {
        setVerificationStatus("error")
        setErrorMessage("Invalid verification code. Please check your email and try again.")
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResendCooldown(60) // 60 second cooldown
      alert("Verification code sent! Please check your email.")
    } catch (error) {
      alert("Failed to resend verification code. Please try again.")
    }
  }

  const formatCode = (value: string) => {
    // Remove non-digits and limit to 6 characters
    const digits = value.replace(/\D/g, "").slice(0, 6)
    // Add spaces every 3 digits for better readability
    return digits.replace(/(\d{3})(\d{1,3})/, "$1 $2")
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCode(e.target.value)
    setVerificationCode(formatted)
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
              className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
              asChild
            >
              <Link href="/donate">
                <Heart className="h-4 w-4 mr-1" />
                Donate
              </Link>
            </Button>
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
                className="text-sm font-medium text-[#2E2E2E] hover:text-[#3DA9FC] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-[#3DA9FC] rounded-full shadow-lg mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-[#2E2E2E] mb-2">Verify Your Email</h1>
              <p className="text-slate-600">Enter the 6-digit code sent to your email address</p>
            </div>

            {/* Verification Form */}
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader className="pb-8">
                {verificationStatus === "success" ? (
                  /* Success State */
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#2E2E2E] mb-2">Email Verified!</h2>
                      <p className="text-slate-600 mb-6">
                        Your email has been successfully verified. You can now access all JoyHoops features.
                      </p>
                    </div>
                    <Button size="lg" className="w-full bg-[#3DA9FC] hover:bg-[#2b8ce6] shadow-lg text-white" asChild>
                      <Link href="/login">Continue to Login</Link>
                    </Button>
                  </div>
                ) : (
                  /* Verification Form */
                  <form onSubmit={handleVerifyCode} className="space-y-6">
                    {/* Email Input (for resending) */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-[#2E2E2E]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Verification Code Input */}
                    <div className="space-y-2">
                      <label htmlFor="verificationCode" className="text-sm font-medium text-[#2E2E2E]">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={handleCodeChange}
                        maxLength={7} // 6 digits + 1 space
                        className="w-full px-3 py-2 text-center text-2xl font-mono tracking-widest border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3DA9FC] focus:border-[#3DA9FC]"
                        placeholder="000 000"
                        required
                      />
                      <p className="text-xs text-slate-500 text-center">Enter the 6-digit code from your email</p>
                    </div>

                    {/* Error Message */}
                    {verificationStatus === "error" && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isVerifying || verificationCode.replace(/\s/g, "").length !== 6}
                      className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] shadow-lg text-white disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    {/* Resend Code */}
                    <div className="text-center space-y-2">
                      <p className="text-sm text-slate-600">Didn't receive the code?</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={resendCooldown > 0}
                        onClick={handleResendCode}
                        className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent disabled:opacity-50"
                      >
                        {resendCooldown > 0 ? (
                          `Resend in ${resendCooldown}s`
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Resend Code
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Help Links */}
                <div className="text-center mt-6 pt-6 border-t border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500">
                    Having trouble?{" "}
                    <Link href="/contact" className="text-[#3DA9FC] hover:underline">
                      Contact support
                    </Link>
                  </p>
                  <p className="text-xs text-slate-500">
                    Want to use a different email?{" "}
                    <Link href="/register" className="text-[#3DA9FC] hover:underline">
                      Register again
                    </Link>
                  </p>
                </div>
              </CardHeader>
            </Card>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 text-center">
                <strong>Demo:</strong> Use code <code className="bg-blue-100 px-1 rounded">123456</code> to test
                verification
              </p>
            </div>
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
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            href="/privacy"
            className="text-xs text-slate-600 hover:text-[#3DA9FC] hover:underline underline-offset-4 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-slate-600 hover:text-[#3DA9FC] hover:underline underline-offset-4 transition-colors"
          >
            Terms of Service
          </Link>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4 text-[#FF6B35]" />
            <span className="text-xs text-slate-600">WeChat: JoyHoops2024</span>
          </div>
        </nav>
      </footer>
    </div>
  )
}

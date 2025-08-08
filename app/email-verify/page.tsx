"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Trophy, Menu, X, MessageCircle, Mail, RefreshCw } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function EmailVerifyPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timer, setTimer] = useState<number>(60);
  const email = typeof window !== 'undefined' ? localStorage.getItem("pendingEmail") : '';
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [timer]);

  const handleResendEmail = async () => {
    setIsResending(true)
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email || '',
      });
      if (error) {
        throw error;
      }
      alert("Verification email sent! Please check your inbox and spam folder.");
    } catch (error) {
      alert("Failed to resend verification email.");
      console.error("resend email error:", error);
    } finally {
      setIsResending(false);
      setTimer(60);
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
              <h1 className="text-3xl font-bold tracking-tighter text-[#2E2E2E] mb-2">Check Your Email</h1>
              <p className="text-slate-600">We've sent you a verification link</p>
            </div>

            {/* Instructions Card */}
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader className="pb-8">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#2E2E2E]">Verify Your Email Address</h2>
                    <div className="space-y-3 text-slate-600">
                      <p>We've sent a verification link to your email address.</p>
                      <p>Please check your inbox and click the verification link to activate your account.</p>
                      <p className="text-sm">
                        <strong>Don't see the email?</strong> Check your spam or junk folder.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      disabled={isResending || timer > 0}
                      onClick={handleResendEmail}
                      className="w-full border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10 bg-transparent disabled:opacity-50"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : timer > 0 ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend in {timer}s
                        </>
                      ): (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-700 space-y-2">
                <p className="font-medium">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Click the verification link in your email</li>
                  <li>Your account will be activated automatically</li>
                  <li>You can then log in and start using JoyHoops</li>
                </ul>
              </div>
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
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4 text-[#FF6B35]" />
            <span className="text-xs text-slate-600">WeChat: JoyHoops2024</span>
          </div>
        </nav>
      </footer>
    </div>
  )
}

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowLeft, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: Enter email, 2: Enter code
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call to send verification code
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep(2)
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call to verify code
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept "123456" as valid code
      if (code === "123456") {
        router.push("/set-password")
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Show success message or update UI
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
              asChild
            >
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </Button>
            <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E2E2E]">JoyHoops</h1>
              <p className="text-sm text-slate-600">Reset your password</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#3DA9FC]/10 rounded-full mx-auto mb-4">
                {step === 1 ? (
                  <Mail className="h-6 w-6 text-[#3DA9FC]" />
                ) : (
                  <Shield className="h-6 w-6 text-[#3DA9FC]" />
                )}
              </div>
              <CardTitle className="text-2xl text-[#2E2E2E]">
                {step === 1 ? "Forgot Password" : "Enter Verification Code"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Enter your email address and we'll send you a verification code to reset your password."
                  : `We've sent a 6-digit verification code to ${email}. Enter it below to continue.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="focus:border-[#3DA9FC] focus:ring-[#3DA9FC]"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
                  >
                    {isLoading ? "Sending Code..." : "Send Verification Code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                      className="focus:border-[#3DA9FC] focus:ring-[#3DA9FC] text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-slate-500 text-center">For demo purposes, use code: 123456</p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="w-full bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="text-[#3DA9FC] hover:underline font-medium"
                      >
                        Resend Code
                      </button>
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-slate-500 hover:text-[#3DA9FC] underline"
                    >
                      Use a different email address
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#3DA9FC] hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowLeft, Lock, Eye, EyeOff, Check, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../clients/client";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter();
  const supabase = createClient();

  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [password])

  const isPasswordValid = Object.values(passwordStrength).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    setError("")

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error("Error updating password:", error.message);
      setError("Failed to update password. Please try again.");
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/set-access-cookie", {method: "POST", body: JSON.stringify({name: "isChangingPassword", value: "false", remove: true})});
    if (!response.ok) {
      console.error("Failed to remove access cookie");
      setError("Error finalizing password change. Please try again.");
      setIsLoading(false);
      return;
    }
    setSuccess(true);
  }

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));

    const access_token = params.get("access_token");

    if (access_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token: params.get("refresh_token") ?? "",
      });
    }
  }, []);

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#2E2E2E]">JoyHoops</h1>
                <p className="text-sm text-slate-600">Password updated successfully</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <Card className="bg-white border-green-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Password Updated!</CardTitle>
                <CardDescription>
                  Your password has been successfully updated. You will be redirected to the login page shortly.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
                >
                  Continue to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
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
              <Link href="/forgot-password">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E2E2E]">JoyHoops</h1>
              <p className="text-sm text-slate-600">Set your new password</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#3DA9FC]/10 rounded-full mx-auto mb-4">
                <Lock className="h-6 w-6 text-[#3DA9FC]" />
              </div>
              <CardTitle className="text-2xl text-[#2E2E2E]">Set New Password</CardTitle>
              <CardDescription>
                Create a strong password for your account. Make sure it meets all the requirements below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      className="focus:border-[#3DA9FC] focus:ring-[#3DA9FC] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      className="focus:border-[#3DA9FC] focus:ring-[#3DA9FC] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Password Requirements:</h4>
                  <div className="space-y-1">
                    {[
                      { key: "length", text: "At least 8 characters" },
                      { key: "uppercase", text: "One uppercase letter" },
                      { key: "lowercase", text: "One lowercase letter" },
                      { key: "number", text: "One number" },
                      { key: "special", text: "One special character" },
                    ].map(({ key, text }) => (
                      <div key={key} className="flex items-center space-x-2">
                        {passwordStrength[key as keyof typeof passwordStrength] ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-slate-400" />
                        )}
                        <span
                          className={`text-xs ${
                            passwordStrength[key as keyof typeof passwordStrength] ? "text-green-600" : "text-slate-500"
                          }`}
                        >
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center space-x-2">
                    {passwordsMatch ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !isPasswordValid || !passwordsMatch}
                  className="w-full bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
                >
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Button>
              </form>

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

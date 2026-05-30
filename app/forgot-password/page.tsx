"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowLeft, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "../clients/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/set-password`
    });

    if (error) {
      console.error("Error sending password reset email:", error.message);
      alert("Error: " + error.message);
    } else {
      const response = await fetch("/api/set-access-cookie", {method: "POST", body: JSON.stringify({name: "isChangingPassword", value: "true", remove: false})});
      if (!response.ok) {
        console.error("Failed to set access cookie");
        alert("Error setting access cookie");
        setIsLoading(false);
        return;
      }
      alert("Password reset email sent! Please check your inbox.");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

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
                  <Mail className="h-6 w-6 text-[#3DA9FC]" />
                
              </div>
              <CardTitle className="text-2xl text-[#2E2E2E]">
                {"Forgot Password"}
              </CardTitle>
              <CardDescription>
                {"Enter your email address and we'll send you a verification link to reset your password."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(
                <form onSubmit={handleForgotPassword} className="space-y-4">
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

                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
                  >
                    {isLoading ? "Sending Code..." : "Send Verification Link"}
                  </Button>
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

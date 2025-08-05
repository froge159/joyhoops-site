"use client"

import { Trophy, Menu, X, Mail, Linkedin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function TeamPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            <Link href="/team" className="text-sm font-medium text-[#3DA9FC] border-b-2 border-[#3DA9FC] pb-1">
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
                className="text-sm font-medium text-[#3DA9FC] py-2"
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 bg-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              width="1200"
              height="600"
              alt="JoyHoops team members"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2E2E2E]/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-white drop-shadow-lg">
                  Meet Our Team
                </h1>
                <p className="max-w-[900px] text-gray-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed drop-shadow-md">
                  The passionate individuals who make JoyHoops possible
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F7FA]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Leadership Team</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The dedicated leaders guiding our mission
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      width="200"
                      height="200"
                      alt="Sarah Johnson - Founder & Director"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Sarah Johnson</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Founder & Executive Director
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Former college basketball player with 8+ years of youth coaching experience. Sarah founded JoyHoops
                    to bridge the gap between student volunteers and young athletes. She holds a Master's in Sports
                    Management and is passionate about community development through athletics.
                  </CardDescription>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      width="200"
                      height="200"
                      alt="Marcus Chen - Program Coordinator"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Marcus Chen</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Program Coordinator
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Sports science graduate and certified youth trainer. Marcus designs our age-appropriate training
                    programs and coordinates volunteer activities. His expertise in child development ensures our
                    programs are both fun and educationally sound.
                  </CardDescription>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      width="200"
                      height="200"
                      alt="Emily Rodriguez - Community Outreach"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Emily Rodriguez</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Community Outreach Director
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Education major with a passion for community building. Emily manages partnerships with schools and
                    recruits student volunteers. Her bilingual skills and community connections have been instrumental
                    in expanding our reach to diverse populations.
                  </CardDescription>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Staff */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Program Staff</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our dedicated program coordinators and specialists
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-4 lg:gap-8">
              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      width="150"
                      height="150"
                      alt="Alex Thompson"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Alex Thompson</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Basketball Coordinator</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Former high school varsity player, specializes in fundamental skills development for ages 6-12.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      width="150"
                      height="150"
                      alt="Maya Patel"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Maya Patel</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Soccer Coordinator</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Division I soccer player, leads our growing soccer program with emphasis on teamwork and fun.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      width="150"
                      height="150"
                      alt="Jordan Williams"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Jordan Williams</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Volunteer Coordinator</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Psychology major, manages volunteer recruitment, training, and ongoing support programs.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      width="150"
                      height="150"
                      alt="Sam Kim"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Sam Kim</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Events Coordinator</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Event management specialist, organizes tournaments, community events, and fundraising activities.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Advisory Board */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F7FA]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Advisory Board</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experienced professionals guiding our strategic direction
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      width="150"
                      height="150"
                      alt="Dr. Michael Foster"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Dr. Michael Foster</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Education Advisor</CardDescription>
                  <CardDescription className="text-slate-600">
                    Former superintendent with 25+ years in education, provides guidance on youth development and
                    educational partnerships.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      width="150"
                      height="150"
                      alt="Lisa Chang"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Lisa Chang</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Business Strategy Advisor</CardDescription>
                  <CardDescription className="text-slate-600">
                    Nonprofit management consultant, helps with organizational development, fundraising strategies, and
                    operational efficiency.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      width="150"
                      height="150"
                      alt="Coach Roberto Martinez"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Coach Roberto Martinez</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Sports Development Advisor</CardDescription>
                  <CardDescription className="text-slate-600">
                    Former professional athlete and current youth sports director, advises on program development and
                    athlete safety protocols.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Join Our Team */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Join Our Team</h2>
                <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're always looking for passionate individuals to join our mission. Whether as a volunteer, intern,
                  or staff member, there's a place for you at JoyHoops.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row px-8">
                <Button
                  size="lg"
                  className="px-4 sm:px-12 bg-[#FF6B35] hover:bg-[#e55a2b] shadow-lg text-white"
                  asChild
                >
                  <Link href="/volunteer">Volunteer With Us</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 sm:px-12 bg-white border-2 border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 shadow-lg"
                  asChild
                >
                  <Link href="/contact">View Open Positions</Link>
                </Button>
              </div>
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

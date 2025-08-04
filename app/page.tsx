"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Calendar, ArrowRight, Star, Menu, X, Quote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
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
            <span className="text-xl font-bold text-[#2E2E2E] hidden sm:block">JoyHoops</span>
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

            {/* Mobile menu button - only visible when nav links are hidden */}
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

      <main className="flex-1">
        {/* Hero Video Section */}
        <section className="relative w-full h-screen overflow-hidden">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <div className="absolute inset-0 bg-[#2E2E2E]" />
          </video>

          {/* Content overlay */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="container px-6 md:px-8 text-center text-white">
              <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none drop-shadow-lg">
                  Bringing Joy Through Sports
                </h1>
                <p className="max-w-[600px] mx-auto text-lg md:text-xl text-gray-100 drop-shadow-md">
                  Connecting passionate student volunteers with young athletes to create unforgettable sports
                  experiences. Join our community where learning meets fun!
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center px-8">
                  <Button
                    size="lg"
                    className="bg-[#FF6B35] hover:bg-[#e55a2b] px-4 sm:px-12 shadow-lg text-white"
                    asChild
                  >
                    <Link href="/volunteer">
                      Start Volunteering
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#2E2E2E] hover:border-white bg-transparent px-4 sm:px-12 shadow-lg"
                    asChild
                  >
                    <Link href="/programs">View Programs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-0 right-0 w-full text-white animate-bounce z-10">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm">Scroll to explore</span>
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-8 md:py-16 lg:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Why Choose JoyHoops?</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We create meaningful connections between student volunteers and young athletes, fostering growth,
                  friendship, and a love for sports.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-white backdrop-blur border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Student Mentorship</CardTitle>
                  <CardDescription className="text-slate-600">
                    Connect with passionate student volunteers who bring energy and fresh perspectives to sports
                    coaching
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white backdrop-blur border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Skill Development</CardTitle>
                  <CardDescription className="text-slate-600">
                    Structured programs designed to develop both athletic skills and character in young participants
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white backdrop-blur border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Community Impact</CardTitle>
                  <CardDescription className="text-slate-600">
                    Building stronger communities through sports while creating lasting friendships and memories
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Quote/Testimonial Banner Section - Blue */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-[#3DA9FC]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center text-white">
              <Quote className="h-12 w-12 mb-6 opacity-80" />
              <blockquote className="max-w-4xl mx-auto">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-relaxed">
                  "JoyHoops has transformed how our children view sports. The student volunteers bring such enthusiasm
                  and create an environment where every child feels valued and excited to participate."
                </p>
                <footer className="text-lg md:text-xl opacity-90">
                  <cite className="not-italic">— Maria Rodriguez, Parent of Two JoyHoops Participants</cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Programs Preview */}
        <section className="w-full py-6 md:py-12 lg:py-16 bg-[#F5F7FA]">
          <div className="container px-6 md:px-8 lg:px-6">
            <div className="mx-auto flex max-w-6xl items-start gap-12 py-12 flex-col lg:flex-row">
              <div className="flex-1 flex flex-col justify-start space-y-8 w-full">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Our Programs</h2>
                  <p className="text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    From basketball fundamentals to team building activities, we offer diverse programs for all skill
                    levels
                  </p>
                </div>
                <div className="grid gap-6">
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-[#3DA9FC]/20 shadow-sm">
                    <div className="h-8 w-8 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E]">Weekly Sessions</h3>
                      <p className="text-slate-600">
                        Regular training sessions that build consistency and long-term skill development
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-[#3DA9FC]/20 shadow-sm">
                    <div className="h-8 w-8 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E]">Age-Appropriate Training</h3>
                      <p className="text-slate-600">
                        Programs tailored for different age groups, ensuring everyone learns at their own pace
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-[#3DA9FC]/20 shadow-sm">
                    <div className="h-8 w-8 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E]">Fun Competitions</h3>
                      <p className="text-slate-600">
                        Friendly tournaments and games that celebrate progress and teamwork
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="bg-[#3DA9FC] hover:bg-[#2b8ce6] shadow-lg" asChild>
                  <Link href="/programs">
                    Learn More About Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex-1 w-full">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=500&width=800"
                    width="800"
                    height="500"
                    alt="Children learning basketball skills"
                    className="w-full h-[500px] overflow-hidden rounded-xl object-cover shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="w-full py-8 md:py-16 lg:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Meet Our Team</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Passionate individuals dedicated to bringing joy and sports education to young athletes
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
                      alt="Sarah Johnson - Founder & Director"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Sarah Johnson</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Founder & Director</CardDescription>
                  <CardDescription className="text-slate-600">
                    Former college basketball player with 8+ years of youth coaching experience. Sarah founded JoyHoops
                    to bridge the gap between student volunteers and young athletes.
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
                      alt="Marcus Chen - Program Coordinator"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Marcus Chen</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Program Coordinator</CardDescription>
                  <CardDescription className="text-slate-600">
                    Sports science graduate and certified youth trainer. Marcus designs our age-appropriate training
                    programs and coordinates volunteer activities.
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
                      alt="Emily Rodriguez - Community Outreach"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Emily Rodriguez</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Community Outreach</CardDescription>
                  <CardDescription className="text-slate-600">
                    Education major with a passion for community building. Emily manages partnerships with schools and
                    recruits student volunteers.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                className="border-2 border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 shadow-md bg-transparent"
                asChild
              >
                <Link href="/team">
                  Meet Our Full Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-8 md:py-16 lg:py-20 bg-[#F5F7FA]">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">
                  Ready to Make a Difference?
                </h2>
                <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're a student looking to volunteer or a parent wanting to enroll your child, join the
                  JoyHoops community today!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row px-8">
                <Button
                  size="lg"
                  className="px-4 sm:px-12 bg-[#FF6B35] hover:bg-[#e55a2b] shadow-lg text-white"
                  asChild
                >
                  <Link href="/volunteer">
                    Become a Volunteer
                    <Users className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 sm:px-12 bg-white border-2 border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 shadow-lg"
                  asChild
                >
                  <Link href="/register">Register Your Child</Link>
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
      </footer>
    </div>
  )
}

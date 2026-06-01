"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Trophy, Menu, X, Calendar, Clock, Users, MapPin, Star, Target, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useState, useEffect } from "react"

export default function ProgramsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [latestClass, setLatestClass] = useState<{
    name: string;
    date: string;
    location: string;
  } | null>(null);
  const [latestClassError, setLatestClassError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/get-latest-class");
        const json = await res.json();
        if (json.success) {
          setLatestClass(json.data);
        } else {
          setLatestClassError(json.error || "No class info available");
        }
      } catch (e) {
        setLatestClassError("Failed to load class info");
        console.error(e);
      }
    })();
  }, []);

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
            <Link href="/programs" className="text-sm font-medium text-[#3DA9FC] border-b-2 border-[#3DA9FC] pb-1">
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
                className="text-sm font-medium text-[#3DA9FC] py-2"
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
              src="/program/verticalphonephoto.JPG"
              width="1200"
              height="600"
              alt="Children participating in various sports programs"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2E2E2E]/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-white drop-shadow-lg">
                  Our Programs
                </h1>
                <p className="max-w-[900px] text-gray-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed drop-shadow-md">
                  Comprehensive sports programs designed to inspire, teach, and empower young athletes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Program Overview */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">What We Offer</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Age-appropriate programs that combine skill development with character building and fun
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Ages 6-12</CardTitle>
                  <CardDescription className="text-slate-600">
                    Foundational programs focusing on basic skills, teamwork, and developing a love for sports
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Year-Round</CardTitle>
                  <CardDescription className="text-slate-600">
                    Seasonal programs and camps that keep kids active and engaged throughout the entire year
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">All Skill Levels</CardTitle>
                  <CardDescription className="text-slate-600">
                    From complete beginners to experienced young athletes, we have programs for everyone
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Basketball Program */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F7FA]">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-6xl items-center gap-12 py-12 flex-col lg:flex-row">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Image
                    src="/program/kidsliningup.JPG"
                    width="600"
                    height="500"
                    alt="Children learning basketball skills"
                    className="w-full h-[500px] overflow-hidden rounded-xl object-cover shadow-xl"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-start space-y-8 w-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#3DA9FC] rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#2E2E2E]">Basketball</h2>
                  </div>
                  <p className="text-slate-600 md:text-lg/relaxed">
                    Our flagship program teaches fundamental basketball skills including dribbling, shooting, passing,
                    and defense. Students learn proper form, game strategy, and teamwork while building confidence on
                    the court.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-6 w-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2E2E2E]">Skill Development</h3>
                      <p className="text-slate-600 text-sm">
                        Ball handling, shooting mechanics, footwork, and defensive positioning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-6 w-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2E2E2E]">Latest Class</h3>
                      {latestClass ? (
                        <p className="text-slate-600 text-sm">
                          <span className="font-medium">{latestClass.name}</span><br />
                          {new Date(latestClass.date).toLocaleString()}<br />
                          <span className="italic">{latestClass.location}</span>
                        </p>
                      ) : latestClassError ? (
                        <p className="text-slate-600 text-sm italic">{latestClassError}</p>
                      ) : (
                        <p className="text-slate-600 text-sm italic">Loading latest class info...</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-6 w-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2E2E2E]">Locations</h3>
                      <p className="text-slate-600 text-sm">
                        Alexander Elementary, Creech Elementary, Beckendorff Junior High
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        

        

        {/* Registration Info */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Registration is open year-round. Financial assistance is available for families who need it. All
                  equipment is provided.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row px-8">
                <Button
                  size="lg"
                  className="px-4 sm:px-12 bg-[#FF6B35] hover:bg-[#e55a2b] shadow-lg text-white"
                  asChild
                >
                  <Link href="/register">
                    Register Your Child
                    <Heart className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 sm:px-12 bg-white border-2 border-[#3DA9FC]  text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent hover:text-[#3DA9FC] focus:text-[#3DA9FC] active:text-[#3DA9FC]"
                  asChild
                >
                  <Link href="/contact">Ask Questions</Link>
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
        <p className="text-xs text-slate-500 sm:ml-4">© 2024 JoyHoops 501(c)(3). Bringing joy through sports.</p>
      </footer>
    </div>
  )
}

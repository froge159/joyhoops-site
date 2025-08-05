"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Star, Menu, X, Target, Award, Globe, Lightbulb, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function AboutPage() {
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
            <Link href="/about" className="text-sm font-medium text-[#3DA9FC] border-b-2 border-[#3DA9FC] pb-1">
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
                className="text-sm font-medium text-[#3DA9FC] py-2"
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
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 bg-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              width="1200"
              height="600"
              alt="Children and volunteers playing sports"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2E2E2E]/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-white drop-shadow-lg">
                  About JoyHoops
                </h1>
                <p className="max-w-[900px] text-gray-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed drop-shadow-md">
                  Empowering communities through sports, one young athlete at a time
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F7FA]">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-6xl items-center gap-12 py-12 flex-col lg:flex-row">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=500&width=600"
                    width="600"
                    height="500"
                    alt="Students coaching young children"
                    className="w-full h-[500px] overflow-hidden rounded-xl object-cover shadow-xl"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-start space-y-8 w-full">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Our Story</h2>
                  <p className="text-slate-600 md:text-lg/relaxed">
                    JoyHoops was born from a simple observation: young athletes thrive when they connect with
                    passionate, relatable mentors who understand their world. Founded in 2020 by a group of college
                    students who loved sports and wanted to give back, we started with just five volunteers and a
                    handful of kids at a local community center.
                  </p>
                  <p className="text-slate-600 md:text-lg/relaxed">
                    What began as weekend pickup games quickly evolved into structured programs that combine athletic
                    skill development with character building. We realized that student volunteers bring a unique energy
                    and perspective that professional coaches, while excellent, sometimes can't match.
                  </p>
                  <p className="text-slate-600 md:text-lg/relaxed">
                    Today, we've grown to serve over 500 young athletes across multiple communities, with a network of
                    more than 150 student volunteers from local colleges and universities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12">
              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow p-8">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-6 shadow-md">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#2E2E2E] mb-4">Our Mission</CardTitle>
                  <CardDescription className="text-slate-600 text-lg leading-relaxed">
                    To create meaningful connections between passionate student volunteers and young athletes, fostering
                    athletic skill development, character building, and lifelong friendships through the joy of sports.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow p-8">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-6 shadow-md">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#2E2E2E] mb-4">Our Vision</CardTitle>
                  <CardDescription className="text-slate-600 text-lg leading-relaxed">
                    To build stronger, more connected communities where every young person has access to positive role
                    models and opportunities to discover their potential through sports and mentorship.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F7FA]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Our Core Values</h2>
                <p className="max-w-[900px] text-slate-600 md:text-lg/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The principles that guide everything we do
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Inclusivity</CardTitle>
                  <CardDescription className="text-slate-600">
                    Every child deserves the opportunity to play, learn, and grow regardless of skill level, background,
                    or circumstances.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Community</CardTitle>
                  <CardDescription className="text-slate-600">
                    We believe in the power of bringing people together and creating lasting bonds that extend beyond
                    the court or field.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Excellence</CardTitle>
                  <CardDescription className="text-slate-600">
                    We strive for excellence in everything we do, from program quality to volunteer training and
                    participant experience.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Fun</CardTitle>
                  <CardDescription className="text-slate-600">
                    Sports should be joyful! We prioritize creating positive, energetic environments where everyone can
                    smile and enjoy the game.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Growth</CardTitle>
                  <CardDescription className="text-slate-600">
                    We're committed to the continuous development of our participants, volunteers, and organization as a
                    whole.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Impact</CardTitle>
                  <CardDescription className="text-slate-600">
                    We measure our success by the positive impact we have on individuals and communities, not just
                    numbers or statistics.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Our Impact</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Numbers that tell our story of community impact
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-4 lg:gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#3DA9FC] mb-2">500+</div>
                <div className="text-[#2E2E2E] font-medium">Young Athletes Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#FF6B35] mb-2">150+</div>
                <div className="text-[#2E2E2E] font-medium">Student Volunteers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#3DA9FC] mb-2">12</div>
                <div className="text-[#2E2E2E] font-medium">Community Centers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#FF6B35] mb-2">4</div>
                <div className="text-[#2E2E2E] font-medium">Years of Impact</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F7FA]">
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

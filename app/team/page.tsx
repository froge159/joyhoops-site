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
              src="/people/Joyhoops Coach Team.jpg"
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
                      src="/people/Yuxuan Gu.jpg"
                      width="200"
                      height="200"
                      alt="Yuxuan Gu - Founder, President, Head Coach"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Yuxuan Gu</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Founder, President, Head Coach
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Yuxuan is an 8th grader at Beckendorff Junior High with nine years of basketball experience. As a point guard and four-time MVP, he excels in ball-handling, shooting, and playmaking. He’s also a Science Olympiad competitor and clarinetist in the BDJH Wind Ensemble, known for his friendly and dedicated coaching style.


                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/people/Benson Xu.jpg"
                      width="200"
                      height="200"
                      alt="Benson Xu - Co-Founder, Chief Administrative Officer"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Benson Xu</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Co-Founder, Chief Administrative Officer
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Benson is 13 years old and has a strong passion for both basketball and music, particularly playing the viola. He enjoys teaching younger children how to play basketball and finds it rewarding to watch them grow and improve with each training session.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/people/samuelxie.jpg"
                      width="200"
                      height="200"
                      alt="Samuel Xie - Co-Founder & Technology Officer"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Samuel Xie</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Co-Founder & Technology Officer
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Samuel Xie is a high school junior at Seven Lakes High School with a strong background in web development and technology. He has hands-on experience building modern web applications using Next.js, Supabase and is eager to solve new problems and take on challenges. 
                  </CardDescription>
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
                      src="/people/Gary Shen 2.jpg"
                      width="150"
                      height="150"
                      alt="Gary Shen"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Gary Shen</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Chief Comms Officer & 6-7 Head Coach</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Gary Shen is a youth basketball coach and former MVP with national tournament experience.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/Aiden Xu.jpg"
                      width="150"
                      height="150"
                      alt="Aiden Xu"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Aiden Xu</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Co-founder/K-3 Head Coach</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Aiden is a 10th grader at SLHS who loves teaching youth basketball and is in the varsity orchestra.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/Pann Liu.jpg"
                      width="150"
                      height="150"
                      alt="Pann Liu"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Pann Liu</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Operation Officer/4-5 Head Coach</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Pann Liu is a sophomore at SLHS who plays on the JV basketball team.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/daniel fan.JPEG"
                      width="150"
                      height="150"
                      alt="Daniel Fan"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Daniel Fan</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Ambassador</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Daniel Fan is an 8th grader at Fay School who excels in academics, athletics, and leadership.
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Adult Board</h2>
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
                      alt="Wendy Ou"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Wendy Ou</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Operations</CardDescription>
                  <CardDescription className="text-slate-600">
                    A pharmaceutical executive offering 26 years of experience, specializing in cGMP and
FDA/DEA/EMA/China regulatory affairs.
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
                      alt="Zhiqiang Gu"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Zhiqiang Gu</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Head Coach</CardDescription>
                  <CardDescription className="text-slate-600">
                    Experienced basketball coach with a background that includes four years of playing in
collegiate basketball league games.
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
                      alt="Hui Zhi"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Hui Zhi</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Treasurer</CardDescription>
                  <CardDescription className="text-slate-600">
                    Certified public accountant with 18 years of progressive accounting experience and a decade in corporate industry roles.
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
                 Join our mission! We&#39;re seeking passionate coaches for our existing teams! Whether you&#39;re an experienced coach or new to coaching, we welcome you to launch new programs or join existing ones!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row px-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 sm:px-12 bg-white border-2 border-[#3DA9FC]  text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent hover:text-[#3DA9FC] focus:text-[#3DA9FC] active:text-[#3DA9FC]"
                  asChild
                >
                  <Link href="/contact">Submit Request</Link>
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
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4 text-[#FF6B35]" />
            <span className="text-xs text-slate-600">WeChat: JoyHoops2024</span>
          </div>
        </nav>
      </footer>
    </div>
  )
}

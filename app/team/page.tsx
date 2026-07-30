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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Core Leadership Team & Co-Founders</h2>
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
                      className="object-cover rounded-full shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Yuxuan Gu</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Founder, President, Head Coach
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Yuxuan is a member of the class of  2030 at The Hotchkiss School with nine 9 years of competitive basketball experience and six MVP awards. He is the point guard for both his AAU team and the BDJH basketball A team.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/people/Pann Liu.jpg"
                      width="200"
                      height="200"
                      alt="Pann Liu - Co-Founder (TX), Head Coach"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Pann Liu</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Co-Founder (TX), Head Coach Grades 6-8
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Pann is a student coach and member of the Class of 2028 at Seven Lakes High School, where he plays on the JV basketball team, with experience competing for both his school and AAU teams.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/people/Aiden Xu.jpg"
                      width="200"
                      height="200"
                      alt="Aiden Xu - Co-Founder (TX), Head Coach Grades 3-5"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Aiden Xu</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Co-Founder (TX), Head Coach Grades 3-5
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Aiden is a member of the Class of 2028 at Seven Lakes High School and has many years of basketball experience with both AAU and school teams.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <div className="mx-auto mb-6 relative">
                    <Image
                      src="/people/Gary Shen 2.jpg"
                      width="200"
                      height="200"
                      alt="Gary Shen - Co-Founder"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Gary Shen
                  </CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                    Co-Founder, Head Coach, K-2nd
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Gary is a coach and a member of the Class of 2029 at Seven Lakes High School, with eight years of competitive AAU and school basketball experience.
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
                      alt="Benson Xu - Safety & Talent Resource Director"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Benson Xu
                  </CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                     Safety & Talent Resource Director
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                    Benson is a member of the Class of 2030 at Seven Lakes High School and has several years of basketball experience with AAU and school teams. 
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
                      alt="Samuel Xie - Chief Information & Technical Support Officer"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#2E2E2E] mb-2">Samuel Xie
                  </CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium text-lg mb-4">
                     Chief Information & Technical Support Officer
                  </CardDescription>
                  <CardDescription className="text-slate-600 mb-6">
                   Samuel Xie is a high school junior at Seven Lakes High School with a strong background in web development and technology.
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
                      src="/pfp_placeholder.png"
                      width="150"
                      height="150"
                      alt="Aaron Zhou"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Aaron Zhou</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Assistant Coach, Special Project Leader</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Aaron is an eighth-grade student at Beckendorff Junior High with AAU basketball experience.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/audihuang.png"
                      width="150"
                      height="150"
                      alt="Andi Huang"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Andi Huang</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Assistant Coach, Special Project Leader</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Andi is a member of the Class of 2031 and AAU basketball player with extensive experience.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/pfp_placeholder.png"
                      width="150"
                      height="150"
                      alt="Andy Mu"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-lg text-[#2E2E2E]">Andy Mu</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Assistant Coach, Special Project Leader</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Andy is a member of the Class of 2030 at Seven Lakes High School. He has several years of competitive fencing experience.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/fangbrothers.png"
                      width="150"
                      height="150"
                      alt="William Fang & Albert Fang"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E] text-sm">William Fang & Albert Fang</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Assistant Coaches, Special Project Leaders</CardDescription>
                  <CardDescription className="text-slate-600 text-xs">
                    The Fang brothers have developed their skills through multiple seasons of competitive play in the KYBB league and serve as core members of their team.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/kexin.jpeg"
                      width="150"
                      height="150"
                      alt="Kexin"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E] text-lg">Kexin</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Assistant Coach, Special Project Leader</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Kexin is a curious and thoughtful student who enjoys exploring how things work and discovering connections between science, mathematics, and the world.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/dylanzhong.jpg"
                      width="150"
                      height="150"
                      alt="Dylan Zhong"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E] text-lg">Dylan Zhong</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Assistant Coach, Special Project Leader</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Dylan (Class of 2032) is a young student-athlete who has played competitive AAU basketball as a point/shooting guard since the age of seven. 
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/people/samuelho.jpg"
                      width="150"
                      height="150"
                      alt="Samuel Ho"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E] text-lg">Samuel Ho</CardTitle>
                  <CardDescription className="text-[#FF6B35] font-medium">Assistant Coach, Special Project Leader</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                    Samuel is a member of the Class of 2031 with a passion for academics, basketball, music, and community service.
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#2E2E2E]">Adult Advisory Board</h2>
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
                      src="/pfp_placeholder.png"
                      width="150"
                      height="150"
                      alt="Wendy Ou"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Wendy Ou</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Adult Operation Officer</CardDescription>
                  <CardDescription className="text-slate-600">
                    A pharmaceutical executive offering 26 years of experience, specializing in cGMP and
FDA/DEA/EMA/China regulatory affairs.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1]">
                <CardHeader>
                  <div className="mx-auto mb-4 relative">
                    <Image
                      src="/pfp_placeholder.png"
                      width="150"
                      height="150"
                      alt="Zhiqiang Gu"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Zhiqiang Gu</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Adult Head Coach</CardDescription>
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
                      src="/pfp_placeholder.png"
                      width="150"
                      height="150"
                      alt="Hui Zhi"
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-[#2E2E2E]">Hui Zhi</CardTitle>
                  <CardDescription className="text-[#3DA9FC] font-medium">Adult Treasurer</CardDescription>
                  <CardDescription className="text-slate-600 text-sm">
                   Certified public accountant with 18 years of progressive accounting experience, blending big 4 public auditing with over a decade in corporate industry roles.
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
                  <Link href="https://docs.google.com/forms/d/e/1FAIpQLScap7iJGuzf9L_hUaFIhxZCsl95-uEWdekHLRjw3Af1r8w_zg/viewform" target="_blank">
                    Submit Request
                  </Link>
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

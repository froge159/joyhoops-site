"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Trophy,
  Clock,
  Users,
  Calendar,
  MapPin,
  Search,
  Settings,
  Star,
  BookOpen,
  Target,
  ChevronRight,
  LogOut
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { createClient } from "../clients/client"; 

interface UserStats {
  totalHours: number
  classesCompleted: number
  upcomingClasses: number
  availableClasses: number
}

interface Class {
  id: number,
  name: string,
  start_datetime: string,
  end_datetime: string,
  location: string,
  price: number,
  status: 'available' | 'enrolled' | 'completed', // missing
  description: string,
  enrolledChildren: { id: number, name: string, age: number }[]
}



export default function UserHomePage({classes, userStats, name} : {classes: Class[], userStats: UserStats, name: string}) {
  const [activeTab, setActiveTab] = useState("available")
  const [searchTerm, setSearchTerm] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<(Class) | null>(null)
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])
  const [selectAllChildren, setSelectAllChildren] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [signOutClicked, setSignOutClicked] = useState(false);
  const [unenrollDisabled, setUnenrollDisabled] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("pendingEmail");
    }
  }, []);


  const filteredClasses = (classes ?? []).filter((classItem) => {
    const matchesTab =
      (activeTab === "available" && classItem.status === "available") ||
      (activeTab === "enrolled" && classItem.status === "enrolled") ||
      (activeTab === "past" && classItem.status === "completed")
    
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleCancelEnrollment = (classItem: (Class) | null) => {
    setSelectedClass(classItem)
    setSelectedChildren([])
    setSelectAllChildren(false)
    setCancelDialogOpen(true)
  }

  const handleLogout = async () => {
    setSignOutClicked(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    setSignOutClicked(false);
    router.refresh();
    router.push('/');
  }

  const confirmCancelEnrollment = async () => {
    setUnenrollDisabled(true);
    if (!selectedClass) {
      setUnenrollDisabled(false);
      return;
    }
    if (selectedChildren.length === 0) {
      alert("Please select at least one child to cancel enrollment for.");
      setUnenrollDisabled(false);
      return;
    }
    const supabase = createClient();
    const { data: { user }} = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/unenroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify({
        class_id: selectedClass?.id,
        user_id: user?.id,
        children: selectedChildren
      })
    });
    if (!res.ok) {
      console.error("Error invoking unenroll function:", res.statusText);
      alert("Failed to cancel enrollment.");
      setCancelDialogOpen(false)
      setSelectedClass(null)
      setSelectedChildren([])
      setSelectAllChildren(false)
      setUnenrollDisabled(false);
      return; 
    }
    setCancelDialogOpen(false)
    setSelectedClass(null)
    setSelectedChildren([])
    setSelectAllChildren(false)
    setUnenrollDisabled(false);
    window.location.reload();
  }


  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E2E2E]">Welcome back, {name.split(" ")[0]}!</h1>
              <p className="text-sm text-slate-600">Ready for your next sports adventure?</p>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent hover:text-[#3DA9FC] focus:text-[#3DA9FC] active:text-[#3DA9FC] h-9"
              disabled={signOutClicked}
            >
              <LogOut className="h-4 w-4 mr-2" />
                Sign Out
            </Button>
            <Button
            variant="outline"
            size="sm"
            className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent hover:text-[#3DA9FC] focus:text-[#3DA9FC] active:text-[#3DA9FC] ml-3"
            asChild
            >
              <Link href="/user-home/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* User Statistics */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Your Sports Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-3 shadow-md">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">{userStats.totalHours}</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Hours Trained</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-3 shadow-md">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">{userStats.classesCompleted}</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Classes Completed</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-3 shadow-md">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">{userStats.upcomingClasses}</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Upcoming Classes</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-3 shadow-md">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">{userStats.availableClasses}</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Available Classes</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Classes Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#2E2E2E]">Your Classes</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="available">Available Classes</TabsTrigger>
                <TabsTrigger value="enrolled">My Classes</TabsTrigger>
                <TabsTrigger value="past">Past Classes</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-4">
                {filteredClasses.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-[#2E2E2E]">{classItem.name}</h3>
                            <Badge variant="secondary" className="bg-[#3DA9FC]/10 text-[#3DA9FC]">
                              ${classItem.price}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-3">{classItem.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="text-sm text-slate-600">
                            {new Date(classItem.start_datetime).toLocaleDateString()} at {new Date(classItem.start_datetime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-[#FF6B35]" />
                          <span className="text-sm text-slate-600">
                            {
                              (() => {
                                const start = new Date(classItem.start_datetime).getTime();
                                const end = new Date(classItem.end_datetime).getTime();
                                const durationMs = end - start;
                                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                                const durationMinutes = Math.floor((durationMs / (1000 * 60)) % 60);
                                return `${durationHours}h ${durationMinutes}m`;
                              })()
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-[#FF6B35]" />
                          <span className="text-sm text-slate-600">{classItem.location}</span>
                        </div>
                        <Button size="sm" className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white" asChild>
                          <Link href={`/user-home/enroll/${classItem.id}`}>
                            Enroll Now
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="enrolled" className="space-y-4">
                {filteredClasses.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-[#2E2E2E]">{classItem.name}</h3>
                            <Badge className="bg-green-100 text-green-700">Enrolled</Badge>
                          </div>
                          <p className="text-slate-600 mb-3">{classItem.description}</p>
                          <div className="mb-3">
                            <p className="text-sm font-medium text-slate-700 mb-1">Enrolled Children:</p>
                            <div className="flex flex-wrap gap-2">
                              {classItem.enrolledChildren.map((child) => (
                                <Badge key={child.id} variant="outline" className="text-xs">
                                  {child.name} ({child.age}y)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="text-sm text-slate-600">
                            {new Date(classItem.start_datetime).toLocaleDateString()} at {new Date(classItem.start_datetime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-[#FF6B35]" />
                          <span className="text-sm text-slate-600">{
                            (() => {
                                const start = new Date(classItem.start_datetime).getTime();
                                const end = new Date(classItem.end_datetime).getTime();
                                const durationMs = end - start;
                                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                                const durationMinutes = Math.floor((durationMs / (1000 * 60)) % 60);
                                return `${durationHours}h ${durationMinutes}m`;
                              })()
                          }</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-[#FF6B35]" />
                          <span className="text-sm text-slate-600">{classItem.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelEnrollment(classItem)}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          Cancel Enrollment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {filteredClasses.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-[#2E2E2E]">{classItem.name}</h3>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-3">{classItem.description}</p>
                          <div className="mb-3">
                            <p className="text-sm font-medium text-slate-700 mb-1">Participated Children:</p>
                            <div className="flex flex-wrap gap-2">
                              {classItem.enrolledChildren.map((child) => (
                                <Badge key={child.id} variant="outline" className="text-xs">
                                  {child.name} ({child.age}y)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="text-sm text-slate-600">
                            {new Date(classItem.start_datetime).toLocaleDateString()} at {new Date(classItem.start_datetime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-[#FF6B35]" />
                          <span className="text-sm text-slate-600">{
                            (() => {
                                const start = new Date(classItem.start_datetime).getTime();
                                const end = new Date(classItem.end_datetime).getTime();
                                const durationMs = end - start;
                                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                                const durationMinutes = Math.floor((durationMs / (1000 * 60)) % 60);
                                return `${durationHours}h ${durationMinutes}m`;
                              })()
                          }</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-[#FF6B35]" />
                          <span className="text-sm text-slate-600">{classItem.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Class completed successfully</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>

      {/* Cancel Enrollment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cancel Enrollment</DialogTitle>
            <DialogDescription>Select which children you want to cancel from this class enrollment.</DialogDescription>
          </DialogHeader>

          {selectedClass && (
            <div className="py-4">
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-[#2E2E2E] mb-1">{selectedClass.name}</h4>
                <p className="text-sm text-slate-600">
                  {new Date(selectedClass.start_datetime).toLocaleDateString()} at {new Date(selectedClass.start_datetime).toLocaleTimeString()}
                </p>
              </div>

              <div className="space-y-3">
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Individual children:</p>
                  <div className="space-y-2">
                    {selectedClass.enrolledChildren.map((child) => (
                      <div key={child.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`child-${child.id}`}
                          checked={selectedChildren.includes(child.id)}
                          onCheckedChange={(checked) => {
                            setSelectedChildren((prev) =>
                              checked
                                ? [...prev, child.id]
                                : prev.filter((id) => id !== child.id)
                            );
                          }}
                        />
                        <label htmlFor={`child-${child.id}`} className="text-sm text-slate-600">
                          {child.name} ({child.age} years old)
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedChildren.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Cancelling enrollment may be subject to our cancellation policy. Refunds will
                    be processed according to the terms and conditions.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Enrollment
            </Button>
            <Button variant="destructive" onClick={confirmCancelEnrollment} disabled={unenrollDisabled}>
              Cancel Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[#2E2E2E]">Sign Out</DialogTitle>
            <DialogDescription>Are you sure you want to sign out of your account?</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-slate-600">
              You will be redirected to the login page and will need to enter your credentials to access your account
              again.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout} className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Trophy,
  Clock,
  Users,
  GraduationCap,
  Eye,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Activity,
  UserCheck,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { useState } from "react"

// Mock data for the admin dashboard
const organizationStats = {
  totalHours: 2847,
  classesDelivered: 342,
  uniqueChildren: 156,
  activeCoaches: 23,
  programsOffered: 4,
}

const initialCoachesData = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Thompson",
    totalHours: 245,
    volunteerHours: 245,
    joinDate: "2023-01-15",
    status: "Active",
    classesCount: 42,
    classes: [
      { id: 1, date: "2024-01-15", time: "4:00 PM", duration: 90, participants: 12, location: "Community Center Gym" },
      { id: 2, date: "2024-01-17", time: "4:00 PM", duration: 90, participants: 14, location: "Community Center Gym" },
      { id: 3, date: "2024-01-22", time: "4:00 PM", duration: 90, participants: 13, location: "Community Center Gym" },
      { id: 4, date: "2024-01-24", time: "4:00 PM", duration: 90, participants: 15, location: "Community Center Gym" },
      { id: 5, date: "2024-01-29", time: "4:00 PM", duration: 90, participants: 11, location: "Community Center Gym" },
    ],
  },
  {
    id: 2,
    firstName: "Maya",
    lastName: "Patel",
    totalHours: 198,
    volunteerHours: 198,
    joinDate: "2023-03-20",
    status: "Active",
    classesCount: 36,
    classes: [
      { id: 6, date: "2024-01-16", time: "3:30 PM", duration: 90, participants: 16, location: "Central Park Fields" },
      { id: 7, date: "2024-01-18", time: "3:30 PM", duration: 90, participants: 18, location: "Central Park Fields" },
      { id: 8, date: "2024-01-23", time: "3:30 PM", duration: 90, participants: 17, location: "Central Park Fields" },
      { id: 9, date: "2024-01-25", time: "3:30 PM", duration: 90, participants: 19, location: "Central Park Fields" },
      { id: 10, date: "2024-01-30", time: "3:30 PM", duration: 90, participants: 15, location: "Central Park Fields" },
    ],
  },
  {
    id: 3,
    firstName: "Jordan",
    lastName: "Williams",
    totalHours: 167,
    volunteerHours: 167,
    joinDate: "2023-02-10",
    status: "Active",
    classesCount: 28,
    classes: [
      { id: 11, date: "2024-01-20", time: "10:00 AM", duration: 90, participants: 10, location: "Lincoln Elementary" },
      { id: 12, date: "2024-01-27", time: "10:00 AM", duration: 90, participants: 12, location: "Lincoln Elementary" },
      { id: 13, date: "2024-02-03", time: "10:00 AM", duration: 90, participants: 11, location: "Lincoln Elementary" },
      { id: 14, date: "2024-02-10", time: "10:00 AM", duration: 90, participants: 13, location: "Lincoln Elementary" },
      { id: 15, date: "2024-02-17", time: "10:00 AM", duration: 90, participants: 9, location: "Lincoln Elementary" },
    ],
  },
  {
    id: 4,
    firstName: "Sam",
    lastName: "Kim",
    totalHours: 134,
    volunteerHours: 134,
    joinDate: "2023-04-05",
    status: "Active",
    classesCount: 31,
    classes: [
      { id: 16, date: "2024-01-16", time: "3:30 PM", duration: 60, participants: 8, location: "Community Pool" },
      { id: 17, date: "2024-01-18", time: "3:30 PM", duration: 60, participants: 10, location: "Community Pool" },
      { id: 18, date: "2024-01-23", time: "3:30 PM", duration: 60, participants: 9, location: "Community Pool" },
      { id: 19, date: "2024-01-25", time: "3:30 PM", duration: 60, participants: 11, location: "Community Pool" },
      { id: 20, date: "2024-01-30", time: "3:30 PM", duration: 60, participants: 7, location: "Community Pool" },
    ],
  },
  {
    id: 5,
    firstName: "Emma",
    lastName: "Davis",
    totalHours: 156,
    volunteerHours: 156,
    joinDate: "2023-05-12",
    status: "Active",
    classesCount: 26,
    classes: [
      { id: 21, date: "2024-01-17", time: "4:00 PM", duration: 90, participants: 6, location: "City Tennis Center" },
      { id: 22, date: "2024-01-19", time: "4:00 PM", duration: 90, participants: 8, location: "City Tennis Center" },
      { id: 23, date: "2024-01-24", time: "4:00 PM", duration: 90, participants: 7, location: "City Tennis Center" },
      { id: 24, date: "2024-01-26", time: "4:00 PM", duration: 90, participants: 9, location: "City Tennis Center" },
      { id: 25, date: "2024-01-31", time: "4:00 PM", duration: 90, participants: 5, location: "City Tennis Center" },
    ],
  },
  {
    id: 6,
    firstName: "Carlos",
    lastName: "Rodriguez",
    totalHours: 189,
    volunteerHours: 189,
    joinDate: "2023-01-30",
    status: "Active",
    classesCount: 34,
    classes: [
      {
        id: 26,
        date: "2024-01-21",
        time: "9:00 AM",
        duration: 90,
        participants: 14,
        location: "Westside Soccer Complex",
      },
      {
        id: 27,
        date: "2024-01-28",
        time: "9:00 AM",
        duration: 90,
        participants: 16,
        location: "Westside Soccer Complex",
      },
      {
        id: 28,
        date: "2024-02-04",
        time: "9:00 AM",
        duration: 90,
        participants: 15,
        location: "Westside Soccer Complex",
      },
      {
        id: 29,
        date: "2024-02-11",
        time: "9:00 AM",
        duration: 90,
        participants: 17,
        location: "Westside Soccer Complex",
      },
      {
        id: 30,
        date: "2024-02-18",
        time: "9:00 AM",
        duration: 90,
        participants: 13,
        location: "Westside Soccer Complex",
      },
    ],
  },
  {
    id: 7,
    firstName: "Aisha",
    lastName: "Johnson",
    totalHours: 112,
    volunteerHours: 112,
    joinDate: "2023-06-08",
    status: "Inactive",
    classesCount: 22,
    classes: [
      {
        id: 31,
        date: "2024-01-20",
        time: "11:30 AM",
        duration: 90,
        participants: 8,
        location: "Riverside Park Courts",
      },
      {
        id: 32,
        date: "2024-01-27",
        time: "11:30 AM",
        duration: 90,
        participants: 10,
        location: "Riverside Park Courts",
      },
      {
        id: 33,
        date: "2024-02-03",
        time: "11:30 AM",
        duration: 90,
        participants: 9,
        location: "Riverside Park Courts",
      },
      {
        id: 34,
        date: "2024-02-10",
        time: "11:30 AM",
        duration: 90,
        participants: 11,
        location: "Riverside Park Courts",
      },
      {
        id: 35,
        date: "2024-02-17",
        time: "11:30 AM",
        duration: 90,
        participants: 7,
        location: "Riverside Park Courts",
      },
    ],
  },
  {
    id: 8,
    firstName: "Ryan",
    lastName: "O'Connor",
    totalHours: 143,
    volunteerHours: 143,
    joinDate: "2023-07-15",
    status: "Active",
    classesCount: 29,
    classes: [
      { id: 36, date: "2024-01-18", time: "11:00 AM", duration: 60, participants: 12, location: "YMCA Aquatic Center" },
      { id: 37, date: "2024-01-20", time: "11:00 AM", duration: 60, participants: 14, location: "YMCA Aquatic Center" },
      { id: 38, date: "2024-01-25", time: "11:00 AM", duration: 60, participants: 13, location: "YMCA Aquatic Center" },
      { id: 39, date: "2024-01-27", time: "11:00 AM", duration: 60, participants: 15, location: "YMCA Aquatic Center" },
      { id: 40, date: "2024-02-01", time: "11:00 AM", duration: 60, participants: 11, location: "YMCA Aquatic Center" },
    ],
  },
]

export default function AdminDashboard() {
  const [selectedCoach, setSelectedCoach] = useState<(typeof initialCoachesData)[0] | null>(null)
  const [showClasses, setShowClasses] = useState(false)
  const [coachesData, setCoachesData] = useState(initialCoachesData)
  const [isAddCoachOpen, setIsAddCoachOpen] = useState(false)
  const [isEditCoachOpen, setIsEditCoachOpen] = useState(false)
  const [isDeleteCoachOpen, setIsDeleteCoachOpen] = useState(false)
  const [editingCoach, setEditingCoach] = useState<(typeof initialCoachesData)[0] | null>(null)
  const [deletingCoach, setDeletingCoach] = useState<(typeof initialCoachesData)[0] | null>(null)
  const [newCoach, setNewCoach] = useState({
    firstName: "",
    lastName: "",
    status: "Active" as "Active" | "Inactive",
  })

  // Add after existing state declarations
  const [activeTab, setActiveTab] = useState<"coaches" | "classes">("coaches")
  const [classesData, setClassesData] = useState([
    {
      id: 1,
      name: "Youth Basketball Fundamentals",
      description: "Learn the basics of basketball including dribbling, shooting, and teamwork",
      startDateTime: "2024-02-15T16:00",
      endDateTime: "2024-02-15T17:30",
      location: "Community Center Gym",
      volunteerHours: 1.5,
      price: 25,
      isActive: true,
    },
    {
      id: 2,
      name: "Soccer Skills Development",
      description: "Develop soccer skills through fun drills and mini-games",
      startDateTime: "2024-02-16T15:30",
      endDateTime: "2024-02-16T17:00",
      location: "Central Park Fields",
      volunteerHours: 1.5,
      price: 25,
      isActive: true,
    },
    {
      id: 3,
      name: "Tennis for Beginners",
      description: "Introduction to tennis basics and court etiquette",
      startDateTime: "2024-02-17T16:00",
      endDateTime: "2024-02-17T17:30",
      location: "City Tennis Center",
      volunteerHours: 1.5,
      price: 25,
      isActive: false,
    },
  ])
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isEditClassOpen, setIsEditClassOpen] = useState(false)
  const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [deletingClass, setDeletingClass] = useState<any>(null)
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
    volunteerHours: 0,
    price: 0,
    isActive: true,
  })

  const handleViewClasses = (coach: (typeof initialCoachesData)[0]) => {
    setSelectedCoach(coach)
    setShowClasses(true)
  }

  const handleBackToCoaches = () => {
    setShowClasses(false)
    setSelectedCoach(null)
  }

  const handleAddCoach = () => {
    if (newCoach.firstName && newCoach.lastName) {
      const coach = {
        id: Math.max(...coachesData.map((c) => c.id)) + 1,
        firstName: newCoach.firstName,
        lastName: newCoach.lastName,
        totalHours: 0,
        volunteerHours: 0,
        joinDate: new Date().toISOString().split("T")[0],
        status: newCoach.status,
        classesCount: 0,
        classes: [],
      }
      setCoachesData([...coachesData, coach])
      setNewCoach({ firstName: "", lastName: "", status: "Active" })
      setIsAddCoachOpen(false)
    }
  }

  const handleEditCoach = () => {
    if (editingCoach) {
      setCoachesData(coachesData.map((coach) => (coach.id === editingCoach.id ? editingCoach : coach)))
      setEditingCoach(null)
      setIsEditCoachOpen(false)
    }
  }

  const handleDeleteCoach = () => {
    if (deletingCoach) {
      setCoachesData(coachesData.filter((coach) => coach.id !== deletingCoach.id))
      setDeletingCoach(null)
      setIsDeleteCoachOpen(false)
    }
  }

  const openEditDialog = (coach: (typeof initialCoachesData)[0]) => {
    setEditingCoach({ ...coach })
    setIsEditCoachOpen(true)
  }

  const openDeleteDialog = (coach: (typeof initialCoachesData)[0]) => {
    setDeletingCoach(coach)
    setIsDeleteCoachOpen(true)
  }

  const handleAddClass = () => {
    if (newClass.name && newClass.startDateTime && newClass.endDateTime && newClass.location) {
      const classItem = {
        id: Math.max(...classesData.map((c) => c.id)) + 1,
        ...newClass,
      }
      setClassesData([...classesData, classItem])
      setNewClass({
        name: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
        location: "",
        volunteerHours: 0,
        price: 0,
        isActive: true,
      })
      setIsAddClassOpen(false)
    }
  }

  const handleEditClass = () => {
    if (editingClass) {
      setClassesData(classesData.map((classItem) => (classItem.id === editingClass.id ? editingClass : classItem)))
      setEditingClass(null)
      setIsEditClassOpen(false)
    }
  }

  const handleDeleteClass = () => {
    if (deletingClass) {
      setClassesData(classesData.filter((classItem) => classItem.id !== deletingClass.id))
      setDeletingClass(null)
      setIsDeleteClassOpen(false)
    }
  }

  const openEditClassDialog = (classItem: any) => {
    setEditingClass({ ...classItem })
    setIsEditClassOpen(true)
  }

  const openDeleteClassDialog = (classItem: any) => {
    setDeletingClass(classItem)
    setIsDeleteClassOpen(true)
  }

  if (showClasses && selectedCoach) {
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
                <h1 className="text-xl font-bold text-[#2E2E2E]">JoyHoops Admin</h1>
                <p className="text-sm text-slate-600">Coach Class History</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleBackToCoaches}
              className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            {/* Coach Info Header */}
            <div className="mb-8">
              <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-[#2E2E2E] mb-2">
                        {selectedCoach.firstName} {selectedCoach.lastName}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        <span className="ml-2">{selectedCoach.totalHours} total hours</span> •
                        <span className="ml-2">{selectedCoach.classesCount} classes delivered</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Member since</div>
                      <div className="font-medium">{new Date(selectedCoach.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Classes List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2E2E2E] mb-4">
                Class History ({selectedCoach.classes.length} classes shown)
              </h2>

              {selectedCoach.classes.map((classItem) => (
                <Card
                  key={classItem.id}
                  className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="font-medium text-[#2E2E2E]">{classItem.date}</span>
                        </div>
                        <div className="text-sm text-slate-600">{classItem.time}</div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="h-4 w-4 text-[#FF6B35]" />
                          <span className="font-medium text-[#2E2E2E]">{classItem.duration} minutes</span>
                        </div>
                        <div className="text-sm text-slate-600">{(classItem.duration / 60).toFixed(1)} hours</div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="font-medium text-[#2E2E2E]">{classItem.participants} participants</span>
                        </div>
                        <div className="text-sm text-slate-600">Children served</div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <MapPin className="h-4 w-4 text-[#FF6B35]" />
                          <span className="font-medium text-[#2E2E2E] text-sm">{classItem.location}</span>
                        </div>
                        <div className="text-sm text-slate-600">Location</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
            <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E2E2E]">JoyHoops Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Organization Overview & Coach Management</p>
            </div>
          </div>
          <div className="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("coaches")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "coaches" ? "bg-white text-[#3DA9FC] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Coaches
            </button>
            <button
              onClick={() => setActiveTab("classes")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "classes" ? "bg-white text-[#3DA9FC] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Classes
            </button>
          </div>

          {activeTab === "coaches" && (
            <>
              {/* Organization Statistics */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Organization Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-3 shadow-md">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">
                        {organizationStats.totalHours.toLocaleString()}
                      </CardTitle>
                      <CardDescription className="text-slate-600 font-medium">Total Hours</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-3 shadow-md">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">
                        {organizationStats.classesDelivered}
                      </CardTitle>
                      <CardDescription className="text-slate-600 font-medium">Classes Delivered</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-3 shadow-md">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">
                        {organizationStats.uniqueChildren}
                      </CardTitle>
                      <CardDescription className="text-slate-600 font-medium">Unique Children</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div className="h-12 w-12 mx-auto bg-[#FF6B35] rounded-full flex items-center justify-center mb-3 shadow-md">
                        <UserCheck className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">
                        {organizationStats.activeCoaches}
                      </CardTitle>
                      <CardDescription className="text-slate-600 font-medium">Active Coaches</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="bg-white border-[#3DA9FC]/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div className="h-12 w-12 mx-auto bg-[#3DA9FC] rounded-full flex items-center justify-center mb-3 shadow-md">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-[#2E2E2E] mb-1">
                        {organizationStats.programsOffered}
                      </CardTitle>
                      <CardDescription className="text-slate-600 font-medium">Programs Offered</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </section>

              {/* Coaches Data */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2E2E2E]">Coach Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-600">{coachesData.length} total coaches</div>
                    <Dialog open={isAddCoachOpen} onOpenChange={setIsAddCoachOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Coach
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Coach</DialogTitle>
                          <DialogDescription>Enter the coach's information below.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={newCoach.firstName}
                              onChange={(e) => setNewCoach({ ...newCoach, firstName: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={newCoach.lastName}
                              onChange={(e) => setNewCoach({ ...newCoach, lastName: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select
                              value={newCoach.status}
                              onValueChange={(value: "Active" | "Inactive") =>
                                setNewCoach({ ...newCoach, status: value })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={handleAddCoach}
                            disabled={!newCoach.firstName || !newCoach.lastName}
                          >
                            Add Coach
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-4">
                  {coachesData.map((coach) => (
                    <Card
                      key={coach.id}
                      className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                          <div className="md:col-span-2">
                            <h3 className="font-semibold text-lg text-[#2E2E2E] mb-1">
                              {coach.firstName} {coach.lastName}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm px-2 py-1 rounded-full font-medium ${
                                  coach.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {coach.status}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Clock className="h-4 w-4 text-[#FF6B35]" />
                              <span className="font-bold text-xl text-[#2E2E2E]">{coach.totalHours}</span>
                            </div>
                            <div className="text-sm text-slate-600">Total Hours</div>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Star className="h-4 w-4 text-[#3DA9FC]" />
                              <span className="font-bold text-xl text-[#2E2E2E]">{coach.volunteerHours}</span>
                            </div>
                            <div className="text-sm text-slate-600">Volunteer Hours</div>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <GraduationCap className="h-4 w-4 text-[#FF6B35]" />
                              <span className="font-bold text-xl text-[#2E2E2E]">{coach.classesCount}</span>
                            </div>
                            <div className="text-sm text-slate-600">Classes</div>
                          </div>

                          <div className="flex justify-center space-x-2">
                            <Button
                              onClick={() => handleViewClasses(coach)}
                              size="sm"
                              className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              onClick={() => openEditDialog(coach)}
                              size="sm"
                              variant="outline"
                              className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteDialog(coach)}
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Quick Stats Summary */}
              <section className="mt-12">
                <Card className="bg-gradient-to-r from-[#3DA9FC]/10 to-[#FF6B35]/10 border-[#3DA9FC]/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#2E2E2E] mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-[#3DA9FC]" />
                      Quick Summary
                    </CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#3DA9FC] mb-1">
                          {(organizationStats.totalHours / organizationStats.activeCoaches).toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600">Average Hours per Coach</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#FF6B35] mb-1">
                          {(organizationStats.classesDelivered / organizationStats.activeCoaches).toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600">Average Classes per Coach</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#3DA9FC] mb-1">
                          {(organizationStats.uniqueChildren / organizationStats.classesDelivered).toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600">Average Children per Class</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </section>
            </>
          )}

          {activeTab === "classes" && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2E2E2E]">Class Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-600">{classesData.length} total classes</div>
                  <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Class
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Class</DialogTitle>
                        <DialogDescription>Enter the class information below.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="className" className="text-right">
                            Class Name
                          </Label>
                          <Input
                            id="className"
                            value={newClass.name}
                            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="classDescription" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="classDescription"
                            value={newClass.description}
                            onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="startDateTime" className="text-right">
                            Start Date/Time
                          </Label>
                          <Input
                            id="startDateTime"
                            type="datetime-local"
                            value={newClass.startDateTime}
                            onChange={(e) => setNewClass({ ...newClass, startDateTime: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="endDateTime" className="text-right">
                            End Date/Time
                          </Label>
                          <Input
                            id="endDateTime"
                            type="datetime-local"
                            value={newClass.endDateTime}
                            onChange={(e) => setNewClass({ ...newClass, endDateTime: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="classLocation" className="text-right">
                            Location
                          </Label>
                          <Input
                            id="classLocation"
                            value={newClass.location}
                            onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="volunteerHours" className="text-right">
                            Volunteer Hours
                          </Label>
                          <Input
                            id="volunteerHours"
                            type="number"
                            step="0.5"
                            value={newClass.volunteerHours}
                            onChange={(e) =>
                              setNewClass({ ...newClass, volunteerHours: Number.parseFloat(e.target.value) || 0 })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="classPrice" className="text-right">
                            Price ($)
                          </Label>
                          <Input
                            id="classPrice"
                            type="number"
                            value={newClass.price}
                            onChange={(e) => setNewClass({ ...newClass, price: Number.parseInt(e.target.value) || 0 })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="isActive" className="text-right">
                            Status
                          </Label>
                          <Select
                            value={newClass.isActive ? "active" : "inactive"}
                            onValueChange={(value) => setNewClass({ ...newClass, isActive: value === "active" })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={handleAddClass}
                          disabled={
                            !newClass.name || !newClass.startDateTime || !newClass.endDateTime || !newClass.location
                          }
                        >
                          Add Class
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-4">
                {classesData.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-start">
                        <div className="lg:col-span-2">
                          <h3 className="font-semibold text-lg text-[#2E2E2E] mb-1">{classItem.name}</h3>
                          <p className="text-sm text-slate-600 mb-2">{classItem.description}</p>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-sm px-2 py-1 rounded-full font-medium ${
                                classItem.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {classItem.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <Calendar className="h-4 w-4 text-[#3DA9FC]" />
                            <span className="font-medium text-sm text-[#2E2E2E]">
                              {new Date(classItem.startDateTime).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            {new Date(classItem.startDateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -
                            {new Date(classItem.endDateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <MapPin className="h-4 w-4 text-[#FF6B35]" />
                            <span className="font-medium text-sm text-[#2E2E2E]">{classItem.location}</span>
                          </div>
                          <div className="text-xs text-slate-600">Location</div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <Clock className="h-4 w-4 text-[#3DA9FC]" />
                            <span className="font-medium text-sm text-[#2E2E2E]">{classItem.volunteerHours}h</span>
                          </div>
                          <div className="text-xs text-slate-600">Volunteer Hours</div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="font-bold text-lg text-[#2E2E2E]">${classItem.price}</span>
                          </div>
                          <div className="text-xs text-slate-600">Price</div>
                        </div>

                        <div className="flex flex-col space-y-2 justify-center items-end">
                          <Button
                            onClick={() => openEditClassDialog(classItem)}
                            size="sm"
                            variant="outline"
                            className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => openDeleteClassDialog(classItem)}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Edit Coach Dialog */}
      <Dialog open={isEditCoachOpen} onOpenChange={setIsEditCoachOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
            <DialogDescription>Update the coach's information below.</DialogDescription>
          </DialogHeader>
          {editingCoach && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFirstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="editFirstName"
                  value={editingCoach.firstName}
                  onChange={(e) => setEditingCoach({ ...editingCoach, firstName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editLastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="editLastName"
                  value={editingCoach.lastName}
                  onChange={(e) => setEditingCoach({ ...editingCoach, lastName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStatus" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingCoach.status}
                  onValueChange={(value: "Active" | "Inactive") => setEditingCoach({ ...editingCoach, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditCoach}
              disabled={!editingCoach?.firstName || !editingCoach?.lastName}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Coach Dialog */}
      <Dialog open={isDeleteCoachOpen} onOpenChange={setIsDeleteCoachOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Coach</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coach? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingCoach && (
            <div className="py-4">
              <p className="text-sm text-slate-600">
                You are about to delete{" "}
                <strong>
                  {deletingCoach.firstName} {deletingCoach.lastName}
                </strong>
                . This will permanently remove their profile and all associated data.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCoachOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoach}>
              Delete Coach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update the class information below.</DialogDescription>
          </DialogHeader>
          {editingClass && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassName" className="text-right">
                  Class Name
                </Label>
                <Input
                  id="editClassName"
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassDescription" className="text-right">
                  Description
                </Label>
                <Input
                  id="editClassDescription"
                  value={editingClass.description}
                  onChange={(e) => setEditingClass({ ...editingClass, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStartDateTime" className="text-right">
                  Start Date/Time
                </Label>
                <Input
                  id="editStartDateTime"
                  type="datetime-local"
                  value={editingClass.startDateTime}
                  onChange={(e) => setEditingClass({ ...editingClass, startDateTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEndDateTime" className="text-right">
                  End Date/Time
                </Label>
                <Input
                  id="editEndDateTime"
                  type="datetime-local"
                  value={editingClass.endDateTime}
                  onChange={(e) => setEditingClass({ ...editingClass, endDateTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassLocation" className="text-right">
                  Location
                </Label>
                <Input
                  id="editClassLocation"
                  value={editingClass.location}
                  onChange={(e) => setEditingClass({ ...editingClass, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editVolunteerHours" className="text-right">
                  Volunteer Hours
                </Label>
                <Input
                  id="editVolunteerHours"
                  type="number"
                  step="0.5"
                  value={editingClass.volunteerHours}
                  onChange={(e) =>
                    setEditingClass({ ...editingClass, volunteerHours: Number.parseFloat(e.target.value) || 0 })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassPrice" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="editClassPrice"
                  type="number"
                  value={editingClass.price}
                  onChange={(e) => setEditingClass({ ...editingClass, price: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editIsActive" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingClass.isActive ? "active" : "inactive"}
                  onValueChange={(value) => setEditingClass({ ...editingClass, isActive: value === "active" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditClass}
              disabled={
                !editingClass?.name ||
                !editingClass?.startDateTime ||
                !editingClass?.endDateTime ||
                !editingClass?.location
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Class Dialog */}
      <Dialog open={isDeleteClassOpen} onOpenChange={setIsDeleteClassOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingClass && (
            <div className="py-4">
              <p className="text-sm text-slate-600">
                You are about to delete <strong>{deletingClass.name}</strong>. This will permanently remove the class
                and all associated data.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteClassOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClass}>
              Delete Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

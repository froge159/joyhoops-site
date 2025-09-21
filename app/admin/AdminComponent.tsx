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
import { createAdminClient } from "../clients/admin";
import { useState, useRef, useEffect } from "react";
import { createClient } from "../clients/client";
import { redirect } from "next/navigation";

interface OrganizationStats {
  totalHours: number;
  classesDelivered: number;
  uniqueChildren: number;
  activeCoaches: number;
  totalActiveClasses: number;
}
interface QuickSummaryStats {
  avgHoursPerCoach: number;
  avgClassesPerCoach: number;
  avgChildrenPerClass: number;
}

interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  active: boolean;
  volunteerHours: number;
  createdAt: string;
  totalClasses: number;
  detailedClasses: CoachClass[];
}
interface CoachClass {
  id: number;
  startDatetime: string;
  volunteerHours: number;
  location: string;
  childCount: number;
  name: string;
}
interface Class {
  id: number;
  active: boolean;
  description: string;
  name: string;
  location: string;
  volunteerHours: number;
  price: number;
  startDatetime: string;
  endDatetime: string;
  coaches: number[];
}


function CoachMultiSelectDropdown({ coaches, selectedCoachIds, onChange }: { coaches: Coach[]; selectedCoachIds: number[]; onChange: (ids: number[]) => void }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedCoachIds.length === 0
          ? "Select coaches..."
          : `${selectedCoachIds.length} coach${selectedCoachIds.length > 1 ? "es" : ""} selected`}
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-slate-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {coaches.map((coach) => (
            <label key={coach.id} className="flex items-center px-3 py-2 hover:bg-slate-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCoachIds.includes(coach.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedCoachIds, coach.id]);
                  } else {
                    onChange(selectedCoachIds.filter((id) => id !== coach.id));
                  }
                }}
              />
              <span className="ml-2">{coach.firstName} {coach.lastName}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({coaches,organizationStats,quickSummaryStats, classes}: {coaches: Coach[],organizationStats: OrganizationStats,quickSummaryStats: QuickSummaryStats,classes:Class[]}) {
  const [selectedCoach, setSelectedCoach] = useState<(typeof coaches)[0] | null>(null)
  const [showClasses, setShowClasses] = useState(false)
  const [coachData, setCoachData] = useState(coaches)
  const [isAddCoachOpen, setIsAddCoachOpen] = useState(false)
  const [isEditCoachOpen, setIsEditCoachOpen] = useState(false)
  const [isDeleteCoachOpen, setIsDeleteCoachOpen] = useState(false)
  const [editingCoach, setEditingCoach] = useState<(typeof coaches)[0] | null>(null)
  const [deletingCoach, setDeletingCoach] = useState<(typeof coaches)[0] | null>(null)
  const [newCoach, setNewCoach] = useState({
    firstName: "",
    lastName: "",
    status: "Active" as "Active" | "Inactive",
  })

  const [activeTab, setActiveTab] = useState<"coaches" | "classes">("coaches")
  const [classesData, setClassesData] = useState(classes)
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isEditClassOpen, setIsEditClassOpen] = useState(false)
  const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [deletingClass, setDeletingClass] = useState<any>(null)
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    startDatetime: "",
    endDatetime: "",
    location: "",
    volunteerHours: 0,
    price: 0,
    active: true,
    coaches: [] as number[], // array of selected coach IDs
  })

  const handleLogOut = async () => {
    const adminClient = createClient();
    const { error } = await adminClient.auth.signOut();
    if (error) {
      console.error("Error signing out: ", error.message);
      alert("Error signing out.");
    }
    redirect("/");
  }

  const handleViewClasses = (coach: (typeof coaches)[0]) => {
    setSelectedCoach(coach)
    setShowClasses(true)
  }

  const handleBackToCoaches = () => {
    setShowClasses(false)
    setSelectedCoach(null)
  }

  const handleAddCoach = async () => {
    if (newCoach.firstName && newCoach.lastName) {
      const coach = {
        id: coachData.length === 0 ? 1 : Math.max(...coachData.map((c) => c.id)) + 1,
        firstName: newCoach.firstName,
        lastName: newCoach.lastName,
        classCount: 0,
        active: newCoach.status === "Active",
        volunteerHours: 0,
      }
      const response = await fetch("/api/add-coach", {
        method: "POST", 
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          id: coach.id,
          firstName: coach.firstName,
          lastName: coach.lastName,
          status: coach.active,
        })
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Error adding coach: ", error);
        alert("Error adding coach.");
        setNewCoach({ firstName: "", lastName: "", status: "Active" })
        setIsAddCoachOpen(false)
        return;
      }
      setCoachData([...coachData, {
        id: coach.id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        active: coach.active,
        volunteerHours: coach.volunteerHours,
        createdAt: new Date().toISOString(),
        totalClasses: 0,
        detailedClasses: [],
      }]);
      setNewCoach({ firstName: "", lastName: "", status: "Active" })
      setIsAddCoachOpen(false)
    }
  }

  const handleEditCoach = async () => {
    if (editingCoach) {
      const response = await fetch("/api/edit-coach", {
        method: "PUT", 
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          id: editingCoach.id,
          firstName: editingCoach.firstName,
          lastName: editingCoach.lastName,
          active: editingCoach.active,
        })
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Error editing coach: ", error);
        alert("Error editing coach.");
        setEditingCoach(null);
        setIsEditCoachOpen(false);
        return;
      }
      setCoachData(coachData.map((coach) => (coach.id === editingCoach.id ? editingCoach : coach)))
      setEditingCoach(null);
      setIsEditCoachOpen(false);
    }
  }

  const handleDeleteCoach = async () => {
    if (deletingCoach) {
      const response = await fetch("/api/delete-coach", {
        method: "DELETE", 
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          id: deletingCoach.id
        })
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting coach: ", error);
        alert("Error deleting coach.");
        setDeletingCoach(null);
        setIsDeleteCoachOpen(false);
        return;
      }
      setCoachData(coachData.filter((coach) => coach.id !== deletingCoach.id))
      setDeletingCoach(null)
      setIsDeleteCoachOpen(false)
    }
  }

  const openEditDialog = (coach: (typeof coaches)[0]) => {
    setEditingCoach(coach);
    setIsEditCoachOpen(true);
  };

  const openDeleteDialog = (coach: (typeof coaches)[0]) => {
    setDeletingCoach(coach)
    setIsDeleteCoachOpen(true)
  }

  const handleAddClass = async () => {
    if (newClass.name && newClass.startDatetime && newClass.endDatetime && newClass.location) {
      const classItem = {
        id: classesData.length == 0 ? 1 : Math.max(...classesData.map((c) => c.id)) + 1,
        ...newClass,
      }
      const response = await fetch("/api/create-class", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          name: classItem.name,
          description: classItem.description,
          startDatetime: classItem.startDatetime,
          endDatetime: classItem.endDatetime,
          location: classItem.location,
          volunteerHours: classItem.volunteerHours,
          price: classItem.price,
          active: classItem.active,
          coaches: classItem.coaches,
          id: classItem.id,
        })
      })
      if (!response.ok) {
        const error = await response.json();
        console.error("Error adding class: ", error.message);
        alert("Error adding class.");
        setNewClass({
          name: "",
          description: "",
          startDatetime: "",
          endDatetime: "",
          location: "",
          volunteerHours: 0,
          price: 0,
          active: true,
          coaches: [],
        })
        setIsAddClassOpen(false)
        return;
      }
      setClassesData([...classesData, classItem]);
      setCoachData(coachData.map(coach => {
        if (classItem.coaches.includes(coach.id)) {
          coach.detailedClasses = [...coach.detailedClasses, {
            id: classItem.id,
            startDatetime: classItem.startDatetime,
            volunteerHours: classItem.volunteerHours,
            location: classItem.location,
            childCount: 0,
            name: classItem.name
          }];
          coach.totalClasses += 1;
        }
        return coach;
      }));
      setNewClass({
        name: "",
        description: "",
        startDatetime: "",
        endDatetime: "",
        location: "",
        volunteerHours: 0,
        price: 0,
        active: true,
        coaches: [],
      })
      setIsAddClassOpen(false);
    }
  }

  const handleEditClass = async () => {
    if (editingClass) {
      const response = await fetch("/api/update-class", {
        method: "PUT",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          id: editingClass.id,
          name: editingClass.name,
          description: editingClass.description,
          startDatetime: editingClass.startDatetime,
          endDatetime: editingClass.endDatetime,
          location: editingClass.location,
          volunteerHours: editingClass.volunteerHours,
          price: editingClass.price,
          active: editingClass.active,
          coaches: editingClass.coaches, 
        })
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Error editing class: ", error);
        alert("Error editing class.");
        setEditingClass(null);
        setIsEditClassOpen(false);
        return;
      }
      setClassesData(classesData.map((classItem) => (classItem.id === editingClass.id ? editingClass : classItem)));
      setCoachData(coachData.map((coach) => {
        if (coach.detailedClasses) {
          coach.detailedClasses = coach.detailedClasses.map((classItem) => {
            if (classItem.id === editingClass.id) {
              return {
                id: editingClass.id,
                startDatetime: editingClass.startDatetime,
                volunteerHours: editingClass.volunteerHours,
                location: editingClass.location,
                childCount: classItem.childCount,
                name: editingClass.name
              }
            }
            return classItem;
          });
        }
        return coach;
      }));
      setEditingClass(null);
      setIsEditClassOpen(false);
    }
  }

  const handleDeleteClass = async () => {
    if (deletingClass) {
      const response = await fetch("/api/delete-class", {
        method: "DELETE",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          id: deletingClass.id
        })
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting class: ", error);
        alert("Error deleting class.");
        setDeletingClass(null);
        setIsDeleteClassOpen(false);
        return;
      }
      setClassesData(classesData.filter((classItem) => classItem.id !== deletingClass.id));
      setCoachData(coachData.map((coachItem) => {
          if (coachItem.detailedClasses) {
            coachItem.detailedClasses = coachItem.detailedClasses.filter((classItem) => classItem.id !== deletingClass.id);
            coachItem.totalClasses = coachItem.detailedClasses.length;
          }
          return coachItem;
      }));
      setDeletingClass(null)
      setIsDeleteClassOpen(false)
    }
  }

  const openEditClassDialog = (cls: Class) => {
    setEditingClass({
      ...cls,
      coaches: Array.isArray(cls.coaches) ? cls.coaches : [], // ensure it's always an array
    });
    setIsEditClassOpen(true);
  };

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
                        <span className="ml-2">{selectedCoach.totalClasses} classes delivered</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Member since</div>
                      <div className="font-medium">{new Date(selectedCoach.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Classes List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2E2E2E] mb-4">
                Class History ({selectedCoach.detailedClasses.length} classes shown)
              </h2>

              {selectedCoach.detailedClasses.map((classItem) => (
                <Card
                  key={classItem.id}
                  className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="font-medium text-[#2E2E2E]">{classItem.name}</span>
                        </div>
                        <div className="text-sm text-slate-600">{new Date(classItem.startDatetime).toLocaleString()}</div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="h-4 w-4 text-[#FF6B35]" />
                          <span className="font-medium text-[#2E2E2E]">{classItem.volunteerHours} hours</span>
                        </div>
                        <div className="text-sm text-slate-600">Volunteer Hours</div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="font-medium text-[#2E2E2E]">{classItem.childCount} participants</span>
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
          <Button
              variant="default"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleLogOut}
            >
              Log out
            </Button>
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
                        {organizationStats.classesDelivered}
                      </CardTitle>
                      <CardDescription className="text-slate-600 font-medium">Classes Delivered</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </section>

              {/* Coaches Data */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2E2E2E]">Coach Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-600">{coachData.length} total coaches</div>
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
                  {coachData.map((coach) => (
                    <Card
                      key={coach.id}
                      className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="md:col-span-2">
                            <h3 className="font-semibold text-lg text-[#2E2E2E] mb-1">
                              {coach.firstName} {coach.lastName}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm px-2 py-1 rounded-full font-medium ${
                                  coach.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {coach.active ? "Active" : "Inactive"}
                              </span>
                            </div>
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
                              <span className="font-bold text-xl text-[#2E2E2E]">{coach.totalClasses}</span>
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
                          {(quickSummaryStats.avgHoursPerCoach).toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600">Average Hours per Coach</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#FF6B35] mb-1">
                          {(quickSummaryStats.avgClassesPerCoach).toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600">Average Classes per Coach</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#3DA9FC] mb-1">
                          {(quickSummaryStats.avgChildrenPerClass).toFixed(1)}
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
                          <Label htmlFor="startDatetime" className="text-right">
                            Start Date/Time
                          </Label>
                          <Input
                            id="startDatetime"
                            type="datetime-local"
                            value={newClass.startDatetime}
                            onChange={(e) => setNewClass({ ...newClass, startDatetime: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="endDatetime" className="text-right">
                            End Date/Time
                          </Label>
                          <Input
                            id="endDatetime"
                            type="datetime-local"
                            value={newClass.endDatetime}
                            onChange={(e) => setNewClass({ ...newClass, endDatetime: e.target.value })}
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
                            value={newClass.active ? "active" : "inactive"}
                            onValueChange={(value) => setNewClass({ ...newClass, active: value === "active" })}
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Assign Coaches</Label>
                          <div className="col-span-3">
                            <CoachMultiSelectDropdown
                              coaches={coachData}
                              selectedCoachIds={newClass.coaches}
                              onChange={(ids) => setNewClass((prev) => ({ ...prev, coaches: ids }))}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={handleAddClass}
                          disabled={
                            !newClass.name || !newClass.startDatetime || !newClass.endDatetime || !newClass.location
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
                                classItem.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {classItem.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        <div className="h-full flex flex-col justify-center">
                          <div className="flex items-center space-x-1 mb-1">
                            <Calendar className="h-4 w-4 text-[#3DA9FC]" />
                            <span className="font-medium text-sm text-[#2E2E2E]">
                              {new Date(classItem.startDatetime).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            {new Date(classItem.startDatetime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -
                            {new Date(classItem.endDatetime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        <div className="h-full flex flex-col justify-center">
                          <div className="flex items-center space-x-1 mb-1">
                            <MapPin className="h-4 w-4 text-[#FF6B35]" />
                            <span className="font-medium text-sm text-[#2E2E2E]">{classItem.location}</span>
                          </div>
                          <div className="text-xs text-slate-600">Location</div>
                        </div>

                        <div className="h-full flex flex-col justify-center">
                          <div className="flex items-center space-x-1 mb-1">
                            <Clock className="h-4 w-4 text-[#3DA9FC]" />
                            <span className="font-medium text-sm text-[#2E2E2E]">{classItem.volunteerHours}h</span>
                          </div>
                          <div className="text-xs text-slate-600">Volunteer Hours</div>
                        </div>

                        <div className="h-full flex flex-col justify-center">
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
                  value={editingCoach.active ? "Active" : "Inactive"}
                  onValueChange={(value: "Active" | "Inactive") => setEditingCoach({ ...editingCoach, active: value === "Active" })}
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
                <Label htmlFor="editstartDatetime" className="text-right">
                  Start Date/Time
                </Label>
                <Input
                  id="editstartDatetime"
                  type="datetime-local"
                  value={editingClass.startDatetime}
                  onChange={(e) => setEditingClass({ ...editingClass, startDatetime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editendDatetime" className="text-right">
                  End Date/Time
                </Label>
                <Input
                  id="editendDatetime"
                  type="datetime-local"
                  value={editingClass.endDatetime}
                  onChange={(e) => setEditingClass({ ...editingClass, endDatetime: e.target.value })}
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
                  value={editingClass.active ? "active" : "inactive"}
                  onValueChange={(value) => (setEditingClass({ ...editingClass, active: value === "active" }))}
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Assign Coaches</Label>
                <div className="col-span-3">
                  <CoachMultiSelectDropdown
                    coaches={coachData}
                    selectedCoachIds={editingClass.coaches}
                    onChange={(ids) =>
                      setEditingClass((prev: any) => ({ ...prev, coaches: ids }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditClass}
              disabled={
                !editingClass?.name ||
                !editingClass?.startDatetime ||
                !editingClass?.endDatetime ||
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



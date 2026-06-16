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
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Trophy,
  Clock,
  Users,
  Activity,
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { useState, useEffect } from "react";
import { createClient } from "../clients/client";
import { redirect, useRouter } from "next/navigation";

interface OrganizationStats {
  classesDelivered: number;
  uniqueChildren: number;
  totalActiveClasses: number;
  avgChildrenPerClass: number;
}

interface Class {
  id: number;
  active: boolean;
  description: string;
  name: string;
  location: string;
  price: number;
  startDatetime: string;
  endDatetime: string;
  registrantCount: number;
}

export default function AdminDashboard({classes}: {classes: Class[]}) {
  const [classesData, setClassesData] = useState(classes)
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isEditClassOpen, setIsEditClassOpen] = useState(false)
  const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false)
  const [isActivePastAlertOpen, setIsActivePastAlertOpen] = useState(false)
  const [activePastAlertMessage, setActivePastAlertMessage] = useState("")
  const [editingClass, setEditingClass] = useState<any>(null)
  const [deletingClass, setDeletingClass] = useState<any>(null)
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    startDatetime: "",
    endDatetime: "",
    location: "",
    price: 0,
    active: true,
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const fmtDate = (iso: string) =>
    mounted ? new Date(iso).toLocaleDateString('en-US') : '';
  const fmtTime = (iso: string, opts?: Intl.DateTimeFormatOptions) =>
    mounted ? new Date(iso).toLocaleTimeString('en-US', opts) : '';

  // Convert datetime-local input value (browser local time) to UTC ISO string
  const toUtcIsoFromLocal = (value: string) => {
    if (!value) return value;
    return new Date(value).toISOString();
  };

  // Convert UTC ISO string to datetime-local input value (browser local time)
  const toLocalDatetimeInput = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const warnIfActivePastStart = (startValue: string, isActive: boolean) => {
    if (!startValue || !isActive) return false;
    const start = new Date(startValue);
    if (Number.isNaN(start.getTime())) return false;
    if (start.getTime() < Date.now()) {
      setActivePastAlertMessage("Active classes must start in the future. Set the class to inactive or choose a future start time.");
      setIsActivePastAlertOpen(true);
      return true;
    }
    return false;
  };

  const handleLogOut = async () => {
    const adminClient = createClient();
    const { error } = await adminClient.auth.signOut();
    if (error) {
      console.error("Error signing out: ", error.message);
      alert("Error signing out.");
    }
    router.refresh();
    router.push("/");
  }

  const handleAddClass = async () => {
    if (newClass.name && newClass.startDatetime && newClass.endDatetime && newClass.location) {
      if (warnIfActivePastStart(newClass.startDatetime, newClass.active)) {
        return;
      }
      const response = await fetch("/api/create-class", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: newClass.name,
          description: newClass.description,
          startDatetime: toUtcIsoFromLocal(newClass.startDatetime),
          endDatetime: toUtcIsoFromLocal(newClass.endDatetime),
          location: newClass.location,
          price: newClass.price,
          active: newClass.active,
        })
      })
      if (!response.ok) {
        const error = await response.json();
        console.error("Error adding class: ", error.message);
        alert("Error adding class.");
        setNewClass({ name: "", description: "", startDatetime: "", endDatetime: "", location: "", price: 0, active: true })
        setIsAddClassOpen(false)
        return;
      }
      const result = await response.json();
      const classItem = { id: result.id, ...newClass, registrantCount: 0 };
      setClassesData([...classesData, classItem]);
      setNewClass({ name: "", description: "", startDatetime: "", endDatetime: "", location: "", price: 0, active: true })
      setIsAddClassOpen(false);
    }
  }

  const handleEditClass = async () => {
    if (editingClass) {
      if (warnIfActivePastStart(editingClass.startDatetime, editingClass.active)) {
        return;
      }
      const response = await fetch("/api/update-class", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: editingClass.id,
          name: editingClass.name,
          description: editingClass.description,
          startDatetime: toUtcIsoFromLocal(editingClass.startDatetime),
          endDatetime: toUtcIsoFromLocal(editingClass.endDatetime),
          location: editingClass.location,
          price: editingClass.price,
          active: editingClass.active,
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
      setEditingClass(null);
      setIsEditClassOpen(false);
    }
  }

  const handleDeleteClass = async () => {
    if (deletingClass) {
      const response = await fetch("/api/delete-class", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id: deletingClass.id })
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
      setDeletingClass(null)
      setIsDeleteClassOpen(false)
    }
  }

  const openEditClassDialog = (cls: Class) => {
    setEditingClass({
      ...cls,
      startDatetime: toLocalDatetimeInput(cls.startDatetime),
      endDatetime: toLocalDatetimeInput(cls.endDatetime),
    });
    setIsEditClassOpen(true);
  };

  const openDeleteClassDialog = (classItem: any) => {
    setDeletingClass(classItem)
    setIsDeleteClassOpen(true)
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
              <p className="text-sm text-slate-600">Organization Overview & Class Management</p>
            </div>
          </div>
          <Button
            variant="default"
            className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
            onClick={handleLogOut}
          >
            Log out
          </Button>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          

          {/* Class Management */}
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
                        <Label htmlFor="className" className="text-right">Class Name</Label>
                        <Input
                          id="className"
                          value={newClass.name}
                          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="classDescription" className="text-right">Description</Label>
                        <Input
                          id="classDescription"
                          value={newClass.description}
                          onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDatetime" className="text-right">Start Date/Time</Label>
                        <Input
                          id="startDatetime"
                          type="datetime-local"
                          value={newClass.startDatetime}
                          onChange={(e) => setNewClass({ ...newClass, startDatetime: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDatetime" className="text-right">End Date/Time</Label>
                        <Input
                          id="endDatetime"
                          type="datetime-local"
                          value={newClass.endDatetime}
                          onChange={(e) => setNewClass({ ...newClass, endDatetime: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="classLocation" className="text-right">Location</Label>
                        <Input
                          id="classLocation"
                          value={newClass.location}
                          onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="classPrice" className="text-right">Price ($)</Label>
                        <Input
                          id="classPrice"
                          type="number"
                          value={newClass.price}
                          onChange={(e) => setNewClass({ ...newClass, price: Number.parseInt(e.target.value) || 0 })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isActive" className="text-right">Status</Label>
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
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleAddClass}
                        disabled={!newClass.name || !newClass.startDatetime || !newClass.endDatetime || !newClass.location}
                        className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
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
                            {fmtDate(classItem.startDatetime)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {fmtTime(classItem.startDatetime, { hour: "2-digit", minute: "2-digit" })}{" "}-
                          {fmtTime(classItem.endDatetime, { hour: "2-digit", minute: "2-digit" })}
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
                          <span className="font-bold text-lg text-[#2E2E2E]">${classItem.price}</span>
                        </div>
                        <div className="text-xs text-slate-600">Price</div>
                      </div>

                      <div className="h-full flex flex-col justify-center">
                        <div className="flex items-center space-x-1 mb-1">
                          <Users className="h-4 w-4 text-[#3DA9FC]" />
                          <span className="font-bold text-lg text-[#2E2E2E]">{classItem.registrantCount}</span>
                        </div>
                        <div className="text-xs text-slate-600">Registrants</div>
                      </div>

                      <div className="flex flex-col space-y-2 justify-center items-end">
                        <Button
                          onClick={() => openEditClassDialog(classItem)}
                          size="sm"
                          variant="outline"
                          className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]"
                        >
                          <Edit className="h-4 w-4 text-[#FF6B35]" />
                        </Button>
                        <Button
                          onClick={() => openDeleteClassDialog(classItem)}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

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
                <Label htmlFor="editClassName" className="text-right">Class Name</Label>
                <Input
                  id="editClassName"
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassDescription" className="text-right">Description</Label>
                <Input
                  id="editClassDescription"
                  value={editingClass.description}
                  onChange={(e) => setEditingClass({ ...editingClass, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editstartDatetime" className="text-right">Start Date/Time</Label>
                <Input
                  id="editstartDatetime"
                  type="datetime-local"
                  value={editingClass.startDatetime}
                  onChange={(e) => setEditingClass({ ...editingClass, startDatetime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editendDatetime" className="text-right">End Date/Time</Label>
                <Input
                  id="editendDatetime"
                  type="datetime-local"
                  value={editingClass.endDatetime}
                  onChange={(e) => setEditingClass({ ...editingClass, endDatetime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassLocation" className="text-right">Location</Label>
                <Input
                  id="editClassLocation"
                  value={editingClass.location}
                  onChange={(e) => setEditingClass({ ...editingClass, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassPrice" className="text-right">Price ($)</Label>
                <Input
                  id="editClassPrice"
                  type="number"
                  value={editingClass.price}
                  onChange={(e) => setEditingClass({ ...editingClass, price: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editIsActive" className="text-right">Status</Label>
                <Select
                  value={editingClass.active ? "active" : "inactive"}
                  onValueChange={(value) => setEditingClass({ ...editingClass, active: value === "active" })}
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
              disabled={!editingClass?.name || !editingClass?.startDatetime || !editingClass?.endDatetime || !editingClass?.location}
              className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
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

      <AlertDialog open={isActivePastAlertOpen} onOpenChange={setIsActivePastAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Class start time has passed</AlertDialogTitle>
            <AlertDialogDescription>
              {activePastAlertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

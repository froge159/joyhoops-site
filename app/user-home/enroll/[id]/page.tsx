"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Plus,
  CreditCard,
  CheckCircle,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for the class
const classData = {
  id: 1,
  title: "Basketball Fundamentals",
  instructor: "Coach Sarah Johnson",
  date: "2024-01-20",
  time: "4:00 PM",
  duration: "90 minutes",
  location: "Community Center Gym",
  address: "123 Main Street, Downtown District, City, State 12345",
  participants: 12,
  maxParticipants: 15,
  price: 25,
  description:
    "Learn the basics of basketball including dribbling, shooting, and teamwork. This class is perfect for beginners and focuses on fundamental skills development in a fun, supportive environment.",
  instructors: [
    {
      name: "Coach Sarah Johnson",
      bio: "Former college basketball player with 8+ years of youth coaching experience.",
      specialties: ["Basketball Fundamentals", "Youth Development", "Team Building"],
    },
    {
      name: "Assistant Coach Mike Davis",
      bio: "Certified youth trainer specializing in skill development and sports psychology.",
      specialties: ["Skill Development", "Sports Psychology", "Individual Training"],
    },
  ],
  rules: [
    "Arrive 15 minutes early for warm-up and equipment setup",
    "Wear appropriate athletic clothing and non-marking shoes",
    "Bring a water bottle to stay hydrated during the session",
    "Follow all safety guidelines and listen to instructor directions",
    "Respect teammates and maintain good sportsmanship at all times",
    "Parents/guardians must remain on premises during the class",
  ],
}

// Mock data for existing children
const existingChildren = [
  { id: 1, name: "Emma Johnson", age: 8, dateOfBirth: "2015-03-15" },
  { id: 2, name: "Liam Johnson", age: 10, dateOfBirth: "2013-07-22" },
]

export default function EnrollmentPage() {
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])
  const [isAddingChild, setIsAddingChild] = useState(false)
  const [newChild, setNewChild] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
  })
  const [children, setChildren] = useState(existingChildren)
  const [showPayment, setShowPayment] = useState(false)
  const [childToRemove, setChildToRemove] = useState<{ id: number; name: string } | null>(null)

  const handleChildSelection = (childId: number, checked: boolean) => {
    if (checked) {
      setSelectedChildren([...selectedChildren, childId])
    } else {
      setSelectedChildren(selectedChildren.filter((id) => id !== childId))
    }
  }

  const handleAddChild = () => {
    if (newChild.name && newChild.age && newChild.dateOfBirth) {
      const child = {
        id: children.length > 0 ? Math.max(...children.map((c) => c.id)) + 1 : 1,
        name: newChild.name,
        age: Number.parseInt(newChild.age),
        dateOfBirth: newChild.dateOfBirth,
      }
      setChildren([...children, child])
      setNewChild({ name: "", age: "", dateOfBirth: "" })
      setIsAddingChild(false)
    }
  }

  const handleRegister = () => {
    if (selectedChildren.length > 0) {
      setShowPayment(true)
    }
  }

  const totalCost = selectedChildren.length * classData.price

  const handleConfirmRemove = () => {
    if (childToRemove) {
      setChildren(children.filter((c) => c.id !== childToRemove.id))
      setSelectedChildren(selectedChildren.filter((id) => id !== childToRemove.id))
      setChildToRemove(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent"
              asChild
            >
              <Link href="/user-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Classes
              </Link>
            </Button>
            <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E2E2E]">Class Enrollment</h1>
              <p className="text-sm text-slate-600">Register for {classData.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          {/* Class Information */}
          <section className="mb-8">
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader>
                <div>
                  <CardTitle className="text-2xl text-[#2E2E2E] mb-2">{classData.title}</CardTitle>
                  <CardDescription className="text-lg">{classData.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-[#3DA9FC]" />
                    <div>
                      <p className="font-medium text-[#2E2E2E]">{classData.date}</p>
                      <p className="text-sm text-slate-600">{classData.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-[#FF6B35]" />
                    <div>
                      <p className="font-medium text-[#2E2E2E]">{classData.duration}</p>
                      <p className="text-sm text-slate-600">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-[#3DA9FC]" />
                    <div>
                      <p className="font-medium text-[#2E2E2E]">
                        {classData.participants}/{classData.maxParticipants}
                      </p>
                      <p className="text-sm text-slate-600">Enrolled</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-[#FF6B35] mt-1" />
                    <div>
                      <p className="font-medium text-[#2E2E2E]">{classData.location}</p>
                      <p className="text-sm text-slate-600">{classData.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Instructors */}
          <section className="mb-8">
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#2E2E2E]">Meet Your Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {classData.instructors.map((instructor, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-[#3DA9FC] rounded-full shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2E2E2E] mb-1">{instructor.name}</h3>
                        <p className="text-slate-600 mb-2">{instructor.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {instructor.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Class Rules */}
          <section className="mb-8">
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#2E2E2E]">Class Rules & Guidelines</CardTitle>
                <CardDescription>Please review these important guidelines before enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {classData.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-[#3DA9FC] mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Child Selection */}
          <section className="mb-8">
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-[#2E2E2E]">Select Children</CardTitle>
                    <CardDescription>Choose which children you want to enroll in this class</CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddingChild(true)}
                    variant="outline"
                    className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Child
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <p className="text-slate-600">No children added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg"
                      >
                        <Checkbox
                          id={`child-${child.id}`}
                          checked={selectedChildren.includes(child.id)}
                          onCheckedChange={(checked) => handleChildSelection(child.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <label htmlFor={`child-${child.id}`} className="font-medium text-[#2E2E2E] cursor-pointer">
                            {child.name}
                          </label>
                          <p className="text-sm text-slate-600">
                            {child.age} years old • Born {child.dateOfBirth}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[#3DA9FC]">
                          ${classData.price}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setChildToRemove({ id: child.id, name: child.name })}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedChildren.length > 0 && (
                  <div className="mt-6 p-4 bg-[#3DA9FC]/10 border border-[#3DA9FC]/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#2E2E2E]">
                          {selectedChildren.length} child{selectedChildren.length > 1 ? "ren" : ""} selected
                        </p>
                        <p className="text-sm text-slate-600">
                          {children
                            .filter((child) => selectedChildren.includes(child.id))
                            .map((child) => child.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#3DA9FC]">${totalCost}</p>
                        <p className="text-sm text-slate-600">Total Cost</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Register Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleRegister}
              disabled={selectedChildren.length === 0}
              size="lg"
              className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white px-12"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Register & Pay ${totalCost}
            </Button>
          </div>
        </div>
      </main>

      {/* Add Child Dialog */}
      <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Child</DialogTitle>
            <DialogDescription>Enter your child's information to add them to your account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="childName">Full Name</Label>
              <Input
                id="childName"
                value={newChild.name}
                onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                placeholder="Enter child's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childAge">Age</Label>
              <Input
                id="childAge"
                type="number"
                value={newChild.age}
                onChange={(e) => setNewChild({ ...newChild, age: e.target.value })}
                placeholder="Enter child's age"
                min="3"
                max="18"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childDob">Date of Birth</Label>
              <Input
                id="childDob"
                type="date"
                value={newChild.dateOfBirth}
                onChange={(e) => setNewChild({ ...newChild, dateOfBirth: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingChild(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddChild}
              disabled={!newChild.name || !newChild.age || !newChild.dateOfBirth}
              className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
            >
              Add Child
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Processing</DialogTitle>
            <DialogDescription>You will be redirected to Stripe to complete your payment securely.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-slate-50 rounded-lg mb-4">
              <h4 className="font-semibold text-[#2E2E2E] mb-2">Enrollment Summary</h4>
              <p className="text-sm text-slate-600 mb-1">Class: {classData.title}</p>
              <p className="text-sm text-slate-600 mb-1">
                Date: {classData.date} at {classData.time}
              </p>
              <p className="text-sm text-slate-600 mb-3">
                Children:{" "}
                {children
                  .filter((child) => selectedChildren.includes(child.id))
                  .map((child) => child.name)
                  .join(", ")}
              </p>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-[#3DA9FC]">${totalCost}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              By proceeding, you agree to our terms and conditions. Payment will be processed securely through Stripe.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayment(false)}>
              Cancel
            </Button>
            <Button className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Child Dialog */}
      <Dialog open={!!childToRemove} onOpenChange={() => setChildToRemove(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Child</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{childToRemove?.name}</strong> from your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChildToRemove(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

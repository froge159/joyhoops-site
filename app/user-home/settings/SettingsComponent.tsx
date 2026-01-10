"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trophy, ArrowLeft, Save, Trash2, User, Phone, MapPin, Calendar, Mail, Lock, LogOut } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { redirect } from "next/navigation"; 
import { createClient } from "../../clients/client";
import {deleteAccount, updatePassword } from "./actions";

interface UserData {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
}

export default function SettingsPage({ userData }: { userData: UserData }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [userInfo, setUserInfo] = useState(userData);

  const [passwordInfo, setPasswordInfo] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [editedInfo, setEditedInfo] = useState(userInfo)
  const [editedPasswordInfo, setEditedPasswordInfo] = useState(passwordInfo)
  const [signOutClicked, setSignOutClicked] = useState(false);

  const handleSave = async () => {
    const supabase = createClient();
    const cleanPhone = editedInfo.phone.replace(/[^\d]/g, '');
    const { data, error } = await supabase
      .from("User")
      .update({
        first_name: editedInfo.firstName,
        last_name: editedInfo.lastName,
        address: editedInfo.address,
        date_of_birth: new Date(editedInfo.dateOfBirth).toISOString(),
        phone: cleanPhone,
      })
      .eq("id", userInfo.id);
    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
      setIsEditing(false);
      return;
    }
    setUserInfo(editedInfo);
    setIsEditing(false);
  }

  const handleCancel = () => {
    setEditedInfo(userInfo)
    setIsEditing(false)
  }

  const handlePasswordSave = async () => {
    if (editedPasswordInfo.newPassword !== editedPasswordInfo.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    if (editedPasswordInfo.newPassword.length < 8 || editedPasswordInfo.newPassword.search(/[A-Z]/) === -1 || editedPasswordInfo.newPassword.search(/[a-z]/) === -1 || editedPasswordInfo.newPassword.search(/[0-9]/) === -1) {
      alert("Password must be at least 8 characters long and include uppercase, lowercase, and numbers.")
      return
    }
    const data = await updatePassword(userInfo.id, editedPasswordInfo.newPassword);
    if (!data.success) {
      alert("Error updating password: " + data.error);
      console.error("Error updating password:", data.error);
      setIsEditingPassword(false);
      return;
    }
    setPasswordInfo(editedPasswordInfo);
    setIsEditingPassword(false);
    setEditedPasswordInfo({
      newPassword: "",
      confirmPassword: "",
    });
    alert("Password updated successfully.");
  }

  const handlePasswordCancel = () => {
    setEditedPasswordInfo(passwordInfo)
    setIsEditingPassword(false)
  }

  const handleDeleteAccount = async () => {
    const supabase = createClient();
    const result = await deleteAccount((await supabase.auth.getUser()).data.user!.id);
    if (!result.success) {
      alert("Error deleting account: " + result.error);
      console.error("Error deleting account:", result.error);
      return;
    }
    setIsDeleteDialogOpen(false)
    redirect("/");
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
    redirect("/");
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
              className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent hover:text-[#3DA9FC] focus:text-[#3DA9FC] active:text-[#3DA9FC]"
              asChild
            >
              <Link href="/user-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center justify-center w-8 h-8 bg-[#3DA9FC] rounded-full shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E2E2E]">Account Settings</h1>
              <p className="text-sm text-slate-600">Manage your profile and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          {/* Profile Information */}
          <section className="mb-8">
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-[#2E2E2E] flex items-center">
                      <User className="h-6 w-6 mr-2 text-[#3DA9FC]" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information and contact details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white">
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={isEditing ? editedInfo.firstName : userInfo.firstName}
                      onChange={(e) => setEditedInfo({ ...editedInfo, firstName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-slate-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={isEditing ? editedInfo.lastName : userInfo.lastName}
                      onChange={(e) => setEditedInfo({ ...editedInfo, lastName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-slate-50" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-[#3DA9FC]" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" value={userInfo.email} disabled={true} className="bg-slate-50" />
                  <p className="text-xs text-slate-500">Email address cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-[#3DA9FC]" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={isEditing ? editedInfo.phone : userInfo.phone}
                    onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-slate-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#3DA9FC]" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={isEditing ? editedInfo.address : userInfo.address}
                    onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-slate-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-[#3DA9FC]" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={isEditing ? editedInfo.dateOfBirth : userInfo.dateOfBirth}
                    onChange={(e) => setEditedInfo({ ...editedInfo, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-slate-50" : ""}
                  />
                </div>

              </CardContent>
            </Card>
          </section>

          {/* Change Password Section */}
          <section className="mb-8">
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-[#2E2E2E] flex items-center">
                      <Lock className="h-6 w-6 mr-2 text-[#3DA9FC]" />
                      Change Password
                    </CardTitle>
                    <CardDescription>Update your account password for security</CardDescription>
                  </div>
                  {!isEditingPassword ? (
                    <Button
                      onClick={() => setIsEditingPassword(true)}
                      className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white"
                    >
                      Change Password
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handlePasswordCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordSave} className="bg-[#3DA9FC] hover:bg-[#2b8ce6] text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={isEditingPassword ? editedPasswordInfo.newPassword : ""}
                    onChange={(e) => setEditedPasswordInfo({ ...editedPasswordInfo, newPassword: e.target.value })}
                    disabled={!isEditingPassword}
                    className={!isEditingPassword ? "bg-slate-50" : ""}
                    placeholder={isEditingPassword ? "Enter new password" : "••••••••"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={isEditingPassword ? editedPasswordInfo.confirmPassword : ""}
                    onChange={(e) => setEditedPasswordInfo({ ...editedPasswordInfo, confirmPassword: e.target.value })}
                    disabled={!isEditingPassword}
                    className={!isEditingPassword ? "bg-slate-50" : ""}
                    placeholder={isEditingPassword ? "Confirm new password" : "••••••••"}
                  />
                </div>
                <p className="text-xs text-slate-500">
                      Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                    </p>
              </CardContent>
            </Card>
          </section>

          {/* Logout Section */}
          <section className="mb-8">
            <Card className="bg-white border-[#3DA9FC]/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#2E2E2E] flex items-center">
                  <LogOut className="h-5 w-5 mr-2 text-[#3DA9FC]" />
                  Session Management
                </CardTitle>
                <CardDescription>Sign out of your account on this device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-[#3DA9FC]/20 rounded-lg bg-[#3DA9FC]/5">
                  <div>
                    <h3 className="font-medium text-[#2E2E2E]">Sign Out</h3>
                    <p className="text-sm text-slate-600">
                      You will be redirected to the login page and need to sign in again.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="border-[#3DA9FC] text-[#3DA9FC] hover:bg-[#3DA9FC]/10 bg-transparent hover:text-[#3DA9FC] focus:text-[#3DA9FC] active:text-[#3DA9FC]"
                    disabled={signOutClicked}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Account Actions */}
          <section>
            <Card className="bg-white border-red-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 flex items-center">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Permanently delete your account and all associated data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h3 className="font-medium text-red-800">Delete Account</h3>
                    <p className="text-sm text-red-600">
                      This action cannot be undone. All your data will be permanently removed.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
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

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">This will permanently delete:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Your profile and personal information</li>
                <li>• All class enrollment history</li>
                <li>• Payment and billing information</li>
                <li>• Children's profiles and data</li>
                <li>• All preferences and settings</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> If you have any active class enrollments, please cancel them before deleting
                your account to avoid any billing issues.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Keep My Account
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteAccount()}>
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

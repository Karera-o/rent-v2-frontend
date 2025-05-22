"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Shield, Camera } from "lucide-react";

export default function UserProfilePage() {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    profileImage: null,
  });

  const [tempData, setTempData] = useState({ ...userData });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!tempData.fullName || tempData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters";
    }

    if (!tempData.email || !/\S+@\S+\.\S+/.test(tempData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (tempData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(tempData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setUserData({ ...tempData });
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    }, 1000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({ ...tempData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add useEffect to initialize tempData when userData changes
  useEffect(() => {
    setTempData({ ...userData });
  }, [userData]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4 relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={tempData.profileImage || "/placeholder-avatar.png"} />
                  <AvatarFallback className="text-2xl">
                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <CardTitle>{userData.fullName}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-500" />
                <span>{userData.email}</span>
              </div>
              {userData.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{userData.phone}</span>
                </div>
              )}
              {userData.address && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{userData.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={tempData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={formErrors.fullName ? "border-red-500" : ""}
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={tempData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={tempData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className="ml-auto"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
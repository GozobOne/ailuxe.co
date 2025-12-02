import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Calendar, Shield, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function AccountManagement() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleUpdateProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires confirmation via email");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Account Management</h1>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <Button onClick={handleUpdateProfile} className="w-full">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Status
              </CardTitle>
              <CardDescription>
                Your account details and subscription information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="text-xs text-muted-foreground">Current subscription plan</p>
                </div>
                <Badge variant="default" className="bg-primary">
                  Premium
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-xs text-muted-foreground">Account creation date</p>
                </div>
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Login Method</p>
                  <p className="text-xs text-muted-foreground">How you sign in</p>
                </div>
                <Badge variant="secondary">
                  {user?.loginMethod || "OAuth"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing Information
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>

              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>

              <Button variant="outline" className="w-full">
                View Billing History
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. All your data, bookings, and personas will be permanently removed.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

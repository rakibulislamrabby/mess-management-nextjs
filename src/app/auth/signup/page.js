"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import messData from "@/data/mess-data.json";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
    messId: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, login } = useAuth();

  const availableMesses = messData.messes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.role === "member" && !formData.messId) {
      setError("Please select a mess to join");
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      const result = register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        messId: formData.messId || null,
      });

      if (result.success) {
        // Auto login after registration
        const loginResult = login(formData.email, formData.password);
        if (loginResult.success) {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Join the mess management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Role</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant={formData.role === "member" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, role: "member" })}
                    className="flex-1 h-10 sm:h-11"
                    disabled={isLoading}
                  >
                    <Badge variant="secondary" className="mr-2 text-xs">Member</Badge>
                    <span className="text-xs sm:text-sm">Join Mess</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.role === "admin" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                    className="flex-1 h-10 sm:h-11"
                    disabled={isLoading}
                  >
                    <Badge variant="secondary" className="mr-2 text-xs">Admin</Badge>
                    <span className="text-xs sm:text-sm">Create Mess</span>
                  </Button>
                </div>
              </div>
              
              {formData.role === "member" && (
                <div className="space-y-2">
                  <Label htmlFor="messId" className="text-sm sm:text-base">Select Mess</Label>
                  <select
                    id="messId"
                    className="w-full p-2 sm:p-3 border border-input rounded-md bg-background text-foreground text-sm sm:text-base h-10 sm:h-11"
                    value={formData.messId}
                    onChange={(e) => setFormData({ ...formData, messId: e.target.value })}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a mess to join</option>
                    {availableMesses.map((mess) => (
                      <option key={mess.id} value={mess.id}>
                        {mess.name} - {mess.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="text-center text-sm sm:text-base">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">🏠 Mess Management</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Welcome to your mess management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Redirecting to dashboard in 3 seconds...
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/auth/signin" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-10 sm:h-11">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-10 sm:h-11">
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navigation({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, selectedMess, logout, isLoading, mounted } = useAuth();

  // Handle navigation after component mounts
  useEffect(() => {
    if (mounted && !isLoading && (!currentUser || !selectedMess)) {
      router.push("/auth/signin");
    }
  }, [mounted, isLoading, currentUser, selectedMess, router]);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/meals", label: "Meals", icon: "🍽️" },
    { href: "/bazaar", label: "Bazaar", icon: "🛒" },
    { href: "/deposits", label: "Deposits", icon: "💰" },
  ];

  // Don't show sidebar on auth pages
  if (pathname.startsWith('/auth') || pathname === '/') {
    return <div>{children}</div>;
  }

  // Show loading or redirect to login if not authenticated
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render navigation if not authenticated - let useEffect handle redirect
  if (!currentUser || !selectedMess) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card shadow-lg border-r border-border">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="text-xl font-bold text-foreground flex items-center">
            <span className="mr-2">🏠</span>
            {selectedMess.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-1">{selectedMess.address}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
                <Badge variant="outline" className="text-xs">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-card shadow-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {pathname === '/dashboard' && 'Manage your mess activities and finances'}
                {pathname === '/meals' && 'Add and track meal entries'}
                {pathname === '/bazaar' && 'Track shopping expenses and costs'}
                {pathname === '/deposits' && 'Track member contributions and payments'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Your Balance</div>
                <div className={`text-lg font-bold ${currentUser.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ৳{currentUser.balance.toLocaleString()}
                </div>
              </div>
              <ThemeToggle />
              <Badge variant="secondary">Live</Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-background min-h-full">
          {children}
        </main>
      </div>
    </div>
  );
}

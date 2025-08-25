"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navigation({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, selectedMess, logout, isLoading, mounted } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/meals", label: "Meals", icon: "🍽️" },
    { href: "/bazaar", label: "Bazaar", icon: "🛒" },
    { href: "/deposits", label: "Deposits", icon: "💰" },
  ];

  // Handle redirect for unauthenticated users - must be called before any conditional returns
  useEffect(() => {
    if (mounted && !isLoading && (!currentUser || !selectedMess)) {
      router.push("/auth/signin");
    }
  }, [mounted, isLoading, currentUser, selectedMess, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  // Show loading while redirecting
  if (!currentUser || !selectedMess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu} />
          <div className="fixed left-0 top-0 h-full w-80 bg-card shadow-lg border-r border-border transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <Link href="/dashboard" className="text-xl font-bold text-foreground flex items-center">
                    <span className="mr-2">🏠</span>
                    <span className="truncate">{selectedMess.name}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                    ✕
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{selectedMess.address}</p>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
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

              {/* Mobile User Info */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{currentUser.name}</div>
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
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-card shadow-lg border-r border-border transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-xl font-bold text-foreground flex items-center">
              <span className="mr-2">🏠</span>
              {!isSidebarCollapsed && (
                <>
                  <span className="truncate">{selectedMess.name}</span>
                </>
              )}
            </Link>
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="hidden lg:flex">
              {isSidebarCollapsed ? '→' : '←'}
            </Button>
          </div>
          {!isSidebarCollapsed && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{selectedMess.address}</p>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <div className="ml-3 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{currentUser.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card shadow-sm border-b border-border px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="lg:hidden">
                ☰
              </Button>
              
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                  {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {pathname === '/dashboard' && 'Manage your mess activities and finances'}
                  {pathname === '/meals' && 'Add and track meal entries'}
                  {pathname === '/bazaar' && 'Track shopping expenses and costs'}
                  {pathname === '/deposits' && 'Track member contributions and payments'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Balance - Hide on very small screens */}
              <div className="hidden sm:block text-right">
                <div className="text-xs sm:text-sm text-muted-foreground">Your Balance</div>
                <div className={`text-sm sm:text-lg font-bold ${currentUser.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ৳{currentUser.balance.toLocaleString()}
                </div>
              </div>
              
              <ThemeToggle />
              <Badge variant="secondary" className="hidden sm:inline-flex">Live</Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import messData from "@/data/mess-data.json";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMess, setSelectedMess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("currentUser");
    const savedMess = localStorage.getItem("selectedMess");
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedMess) {
      setSelectedMess(JSON.parse(savedMess));
    }
    
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    const user = messData.users.find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
      const mess = messData.messes.find(m => m.id === user.messId);
      setCurrentUser(user);
      setSelectedMess(mess);
      
      if (mounted) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("selectedMess", JSON.stringify(mess));
      }
      
      return { success: true, user, mess };
    }
    
    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedMess(null);
    if (mounted) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("selectedMess");
    }
  };

  const register = (userData) => {
    // Generate new user ID
    const newUserId = `user-${Date.now()}`;
    
    // Create new user
    const newUser = {
      id: newUserId,
      ...userData,
      balance: 0,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    
    // Add to data (in real app, this would be saved to database)
    messData.users.push(newUser);
    
    return { success: true, user: newUser };
  };

  const getMessData = () => {
    if (!selectedMess) return null;
    
    const messUsers = messData.users.filter(u => u.messId === selectedMess.id);
    const messMeals = messData.meals.filter(m => m.messId === selectedMess.id);
    const messDeposits = messData.deposits.filter(d => d.messId === selectedMess.id);
    const messBazaar = messData.bazaar.filter(b => b.messId === selectedMess.id);
    
    return {
      mess: selectedMess,
      users: messUsers,
      meals: messMeals,
      deposits: messDeposits,
      bazaar: messBazaar
    };
  };

  const addMeal = (mealData) => {
    const newMeal = {
      id: `meal-${Date.now()}`,
      userId: currentUser.id,
      messId: selectedMess.id,
      ...mealData
    };
    
    messData.meals.push(newMeal);
    return newMeal;
  };

  const addDeposit = (depositData) => {
    const newDeposit = {
      id: `deposit-${Date.now()}`,
      userId: currentUser.id,
      messId: selectedMess.id,
      ...depositData
    };
    
    messData.deposits.push(newDeposit);
    
    // Update user balance
    const user = messData.users.find(u => u.id === currentUser.id);
    if (user) {
      user.balance += depositData.amount;
      setCurrentUser({ ...user });
      if (mounted) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    }
    
    return newDeposit;
  };

  const addBazaarItem = (bazaarData) => {
    const newBazaarItem = {
      id: `bazaar-${Date.now()}`,
      messId: selectedMess.id,
      buyer: currentUser.id,
      ...bazaarData
    };
    
    messData.bazaar.push(newBazaarItem);
    return newBazaarItem;
  };

  const value = {
    currentUser,
    selectedMess,
    isLoading,
    mounted,
    login,
    logout,
    register,
    getMessData,
    addMeal,
    addDeposit,
    addBazaarItem
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

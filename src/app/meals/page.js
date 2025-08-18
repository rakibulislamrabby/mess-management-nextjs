"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function MealsPage() {
  const { getMessData, addMeal } = useAuth();
  const [messData, setMessData] = useState(null);
  const [meals, setMeals] = useState([]);
  const [users, setUsers] = useState([]);

  const [newMeal, setNewMeal] = useState({
    member: "",
    date: "",
    meal: "Breakfast",
    time: "",
  });

  useEffect(() => {
    const data = getMessData();
    if (data) {
      setMessData(data);
      setMeals(data.meals);
      setUsers(data.users);
    }
  }, [getMessData]);

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (newMeal.member && newMeal.date && newMeal.time) {
      // Find the selected user
      const selectedUser = users.find(user => user.name === newMeal.member);
      
      if (selectedUser) {
        const mealData = {
          date: newMeal.date,
          meal: newMeal.meal,
          time: newMeal.time,
        };

        const addedMeal = addMeal(mealData);
        
        // Update local state
        setMeals([...meals, addedMeal]);
        
        // Reset form
        setNewMeal({ member: "", date: "", meal: "Breakfast", time: "" });
      }
    }
  };

  // Get meals with member names
  const mealsWithMembers = meals.map(meal => {
    const user = users.find(u => u.id === meal.userId);
    return { ...meal, member: user?.name || 'Unknown' };
  });

  if (!messData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading mess data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Meal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Meal</CardTitle>
          <CardDescription>Record a new meal entry for a member</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMeal} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member">Member Name</Label>
              <select
                id="member"
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                value={newMeal.member}
                onChange={(e) => setNewMeal({ ...newMeal, member: e.target.value })}
                required
              >
                <option value="">Select a member</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newMeal.date}
                onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal">Meal Type</Label>
              <select
                id="meal"
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                value={newMeal.meal}
                onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-4">
              <Button type="submit" className="w-full md:w-auto">
                Add Meal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Meals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Meals</CardTitle>
          <CardDescription>Complete list of meal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Meal</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mealsWithMembers.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell className="font-medium">{meal.member}</TableCell>
                  <TableCell>{meal.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{meal.meal}</Badge>
                  </TableCell>
                  <TableCell>{meal.time}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

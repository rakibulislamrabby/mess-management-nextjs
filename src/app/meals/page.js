"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import dynamic from 'next/dynamic';

// Dynamically import Recharts to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

export default function MealsPage() {
  const { getMessData, addMeal } = useAuth();
  const [messData, setMessData] = useState(null);
  const [meals, setMeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [mounted, setMounted] = useState(false);

  const [newMeal, setNewMeal] = useState({
    member: "",
    date: new Date().toISOString().split('T')[0], // Default to today
    meal: "Breakfast",
    time: new Date().toTimeString().slice(0, 5), // Default to current time (HH:MM)
  });

  useEffect(() => {
    setMounted(true);
    const data = getMessData();
    if (data) {
      setMessData(data);
      setMeals(data.meals);
      setUsers(data.users);
    }
  }, []); // Removed getMessData from dependencies to prevent infinite re-renders

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
        setNewMeal({ 
          member: "", 
          date: new Date().toISOString().split('T')[0], 
          meal: "Breakfast", 
          time: new Date().toTimeString().slice(0, 5) 
        });
      }
    }
  };

  // Get meals with member names
  const mealsWithMembers = meals.map(meal => {
    const user = users.find(u => u.id === meal.userId);
    return { ...meal, member: user?.name || 'Unknown' };
  });

  // Calculate meals per day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const mealsPerDay = last7Days.map(date => {
    const dayMeals = meals.filter(meal => meal.date === date);
    return {
      date,
      count: dayMeals.length,
      breakfast: dayMeals.filter(meal => meal.meal === 'Breakfast').length,
      lunch: dayMeals.filter(meal => meal.meal === 'Lunch').length,
      dinner: dayMeals.filter(meal => meal.meal === 'Dinner').length
    };
  });

  const maxMeals = Math.max(...mealsPerDay.map(day => day.count), 1);

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
    <div className="space-y-4 sm:space-y-6">
      {/* Add New Meal Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add New Meal</CardTitle>
          <CardDescription>Record a new meal entry for a member</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMeal} className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="member" className="text-sm sm:text-base">Member Name</Label>
              <select
                id="member"
                className="w-full p-2 sm:p-3 border border-input rounded-md bg-background text-foreground text-sm sm:text-base"
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
              <Label htmlFor="date" className="text-sm sm:text-base">Date</Label>
              <Input
                id="date"
                type="date"
                value={newMeal.date}
                onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal" className="text-sm sm:text-base">Meal Type</Label>
              <select
                id="meal"
                className="w-full p-2 sm:p-3 border border-input rounded-md bg-background text-foreground text-sm sm:text-base"
                value={newMeal.meal}
                onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm sm:text-base">Time</Label>
              <Input
                id="time"
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="submit" className="w-full sm:w-auto h-10 sm:h-11">
                Add Meal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Meals Per Day Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Meals Per Day</CardTitle>
          <CardDescription>Daily meal consumption over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Line Graph */}
            <div className="h-48 sm:h-64">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mealsPerDay}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="breakfast" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lunch" 
                      stroke="#eab308" 
                      strokeWidth={2}
                      dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dinner" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading chart...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {mealsPerDay.reduce((sum, day) => sum + day.breakfast, 0)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Breakfast</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {mealsPerDay.reduce((sum, day) => sum + day.lunch, 0)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Lunch</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-red-600">
                  {mealsPerDay.reduce((sum, day) => sum + day.dinner, 0)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Dinner</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Meals</CardTitle>
          <CardDescription>Complete list of meal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Member</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Meal</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Time</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealsWithMembers.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{meal.member}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground sm:hidden">{meal.date}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{meal.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs sm:text-sm">{meal.meal}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{meal.time}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

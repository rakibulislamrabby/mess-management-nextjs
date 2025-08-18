"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { getMessData, currentUser } = useAuth();
  const [messData, setMessData] = useState(null);

  useEffect(() => {
    const data = getMessData();
    setMessData(data);
  }, [getMessData]);

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

  const { mess, users, meals, deposits, bazaar } = messData;

  // Calculate statistics
  const totalMeals = meals.length;
  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const totalBazaarCost = bazaar.reduce((sum, item) => sum + item.cost, 0);
  const currentBalance = totalDeposits - totalBazaarCost;

  // Get recent meals (last 3)
  const recentMeals = meals
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(meal => {
      const user = users.find(u => u.id === meal.userId);
      return { ...meal, member: user?.name || 'Unknown' };
    });

  // Get recent bazaar items (last 3)
  const recentBazaar = bazaar
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(item => {
      const user = users.find(u => u.id === item.buyer);
      return { ...item, buyer: user?.name || 'Unknown' };
    });

  // Daily meal statistics (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyMeals = last7Days.map(date => {
    const dayMeals = meals.filter(meal => meal.date === date);
    return dayMeals.length;
  });

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
            <Badge variant="secondary">{totalMeals}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeals}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <Badge variant="secondary">৳{totalDeposits}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalDeposits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bazaar Cost</CardTitle>
            <Badge variant="secondary">৳{totalBazaarCost}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalBazaarCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Badge variant={currentBalance >= 0 ? "default" : "destructive"}>
              ৳{currentBalance}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ৳{currentBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Member Summary and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Member Summary</CardTitle>
            <CardDescription>All members and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Meals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((member) => {
                  const memberMeals = meals.filter(meal => meal.userId === member.id).length;
                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${member.id}`} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={member.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ৳{member.balance.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>{memberMeals}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="space-y-6">
          {/* Recent Meals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Meals Added</CardTitle>
              <CardDescription>Latest meal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{meal.member}</div>
                      <div className="text-sm text-muted-foreground">{meal.meal} • {meal.date}</div>
                    </div>
                    <Badge variant="outline">{meal.meal}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bazaar Costs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bazaar Costs</CardTitle>
              <CardDescription>Latest shopping expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBazaar.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{item.item}</div>
                      <div className="text-sm text-muted-foreground">{item.buyer} • {item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">৳{item.cost.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily Meal Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Meal Statistics</CardTitle>
          <CardDescription>Meal consumption over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-center space-x-2">
            {dailyMeals.map((count, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-primary rounded-t w-8"
                  style={{ height: `${(count / Math.max(...dailyMeals, 1)) * 200}px` }}
                ></div>
                <div className="text-xs mt-2">{count}</div>
                <div className="text-xs text-muted-foreground">Day {index + 1}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Balances Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Member Balances</CardTitle>
          <CardDescription>Current balance distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((member) => {
              const maxBalance = Math.max(...users.map(u => Math.abs(u.balance)), 1);
              return (
                <div key={member.id} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium">{member.name}</div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${member.balance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(Math.abs(member.balance) / maxBalance * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className={`w-20 text-sm font-medium ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ৳{member.balance.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

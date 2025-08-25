"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function DepositsPage() {
  const { getMessData, addDeposit } = useAuth();
  const [messData, setMessData] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [users, setUsers] = useState([]);

  const [newDeposit, setNewDeposit] = useState({
    member: "",
    amount: "",
    date: new Date().toISOString().split('T')[0], // Default to today
    method: "Cash",
    note: "",
  });

  useEffect(() => {
    const data = getMessData();
    if (data) {
      setMessData(data);
      setDeposits(data.deposits);
      setUsers(data.users);
    }
  }, []); // Removed getMessData from dependencies to prevent infinite re-renders

  const handleAddDeposit = (e) => {
    e.preventDefault();
    if (newDeposit.member && newDeposit.amount && newDeposit.date) {
      // Find the selected user
      const selectedUser = users.find(user => user.name === newDeposit.member);
      
      if (selectedUser) {
        const depositData = {
          amount: parseInt(newDeposit.amount),
          date: newDeposit.date,
          method: newDeposit.method,
          note: newDeposit.note,
        };

        const addedDeposit = addDeposit(depositData);
        
        // Update local state
        setDeposits([...deposits, addedDeposit]);
        
        // Reset form
        setNewDeposit({ 
          member: "", 
          amount: "", 
          date: new Date().toISOString().split('T')[0], 
          method: "Cash", 
          note: "" 
        });
      }
    }
  };

  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);

  // Get deposits with member names
  const depositsWithMembers = deposits.map(deposit => {
    const user = users.find(u => u.id === deposit.userId);
    return { ...deposit, member: user?.name || 'Unknown' };
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
    <div className="space-y-4 sm:space-y-6">
      {/* Total Deposits Display */}
      <div className="flex justify-end">
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-bold text-green-600">৳{totalDeposits.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Total Deposits</div>
        </div>
      </div>

      {/* Add New Deposit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add New Deposit</CardTitle>
          <CardDescription>Record a new member contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDeposit} className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="member" className="text-sm sm:text-base">Member Name</Label>
              <select
                id="member"
                className="w-full p-2 sm:p-3 border border-input rounded-md bg-background text-foreground text-sm sm:text-base"
                value={newDeposit.member}
                onChange={(e) => setNewDeposit({ ...newDeposit, member: e.target.value })}
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
              <Label htmlFor="amount" className="text-sm sm:text-base">Amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={newDeposit.amount}
                onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm sm:text-base">Date</Label>
              <Input
                id="date"
                type="date"
                value={newDeposit.date}
                onChange={(e) => setNewDeposit({ ...newDeposit, date: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method" className="text-sm sm:text-base">Payment Method</Label>
              <select
                id="method"
                className="w-full p-2 sm:p-3 border border-input rounded-md bg-background text-foreground text-sm sm:text-base"
                value={newDeposit.method}
                onChange={(e) => setNewDeposit({ ...newDeposit, method: e.target.value })}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Banking">Mobile Banking</option>
                <option value="Check">Check</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm sm:text-base">Note</Label>
              <Input
                id="note"
                placeholder="Optional note"
                value={newDeposit.note}
                onChange={(e) => setNewDeposit({ ...newDeposit, note: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-5">
              <Button type="submit" className="w-full sm:w-auto h-10 sm:h-11">
                Add Deposit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Deposits Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Deposits</CardTitle>
          <CardDescription>Complete list of member contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Member</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Method</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Note</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depositsWithMembers.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{deposit.member}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground sm:hidden">
                          {deposit.date} • {deposit.method}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm sm:text-base text-green-600">৳{deposit.amount.toLocaleString()}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{deposit.date}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs sm:text-sm">{deposit.method}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground truncate">{deposit.note}</TableCell>
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

      {/* Payment Method Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Payment Method Summary</CardTitle>
          <CardDescription>Breakdown by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {["Cash", "Bank Transfer", "Mobile Banking", "Check"].map((method) => {
              const methodTotal = deposits
                .filter(deposit => deposit.method === method)
                .reduce((sum, deposit) => sum + deposit.amount, 0);
              
              return (
                <div key={method} className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground">{method}</div>
                  <div className="text-sm sm:text-lg font-bold text-green-600">৳{methodTotal.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
    date: "",
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
  }, [getMessData]);

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
        setNewDeposit({ member: "", amount: "", date: "", method: "Cash", note: "" });
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
    <div className="space-y-6">
      {/* Total Deposits Display */}
      <div className="flex justify-end">
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">৳{totalDeposits.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Deposits</div>
        </div>
      </div>

      {/* Add New Deposit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Deposit</CardTitle>
          <CardDescription>Record a new member contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDeposit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member">Member Name</Label>
              <select
                id="member"
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
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
              <Label htmlFor="amount">Amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={newDeposit.amount}
                onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newDeposit.date}
                onChange={(e) => setNewDeposit({ ...newDeposit, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <select
                id="method"
                className="w-full p-2 border border-input rounded-md bg-background text-foreground"
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
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                placeholder="Optional note"
                value={newDeposit.note}
                onChange={(e) => setNewDeposit({ ...newDeposit, note: e.target.value })}
              />
            </div>
            <div className="md:col-span-5">
              <Button type="submit" className="w-full md:w-auto">
                Add Deposit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Deposits Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deposits</CardTitle>
          <CardDescription>Complete list of member contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depositsWithMembers.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell className="font-medium">{deposit.member}</TableCell>
                  <TableCell className="font-medium text-green-600">৳{deposit.amount.toLocaleString()}</TableCell>
                  <TableCell>{deposit.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{deposit.method}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{deposit.note}</TableCell>
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

      {/* Payment Method Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Summary</CardTitle>
          <CardDescription>Breakdown by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Cash", "Bank Transfer", "Mobile Banking", "Check"].map((method) => {
              const methodTotal = deposits
                .filter(deposit => deposit.method === method)
                .reduce((sum, deposit) => sum + deposit.amount, 0);
              
              return (
                <div key={method} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{method}</div>
                  <div className="text-lg font-bold text-green-600">৳{methodTotal.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

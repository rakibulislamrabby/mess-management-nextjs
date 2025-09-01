"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function BazaarPage() {
  const { getMessData, addBazaarItem } = useAuth();
  const [messData, setMessData] = useState(null);
  const [bazaarItems, setBazaarItems] = useState([]);
  const [users, setUsers] = useState([]);

  const [newItem, setNewItem] = useState({
    item: "",
    cost: "",
    date: new Date().toISOString().split('T')[0], // Default to today
    buyer: "",
    category: "Grains",
  });

  useEffect(() => {
    const data = getMessData();
    if (data) {
      setMessData(data);
      setBazaarItems(data.bazaar);
      setUsers(data.users);
    }
  }, [getMessData]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.item && newItem.cost && newItem.date && newItem.buyer) {
      // Find the selected user
      const selectedUser = users.find(user => user.name === newItem.buyer);
      
      if (selectedUser) {
        const bazaarData = {
          item: newItem.item,
          cost: parseInt(newItem.cost),
          date: newItem.date,
          category: newItem.category,
        };

        const addedItem = addBazaarItem(bazaarData);
        
        // Update local state
        setBazaarItems([...bazaarItems, addedItem]);
        
        // Reset form
        setNewItem({ 
          item: "", 
          cost: "", 
          date: new Date().toISOString().split('T')[0], 
          buyer: "", 
          category: "Grains" 
        });
      }
    }
  };

  const totalCost = bazaarItems.reduce((sum, item) => sum + item.cost, 0);

  // Get bazaar items with buyer names
  const bazaarWithBuyers = bazaarItems.map(item => {
    const user = users.find(u => u.id === item.buyer);
    return { ...item, buyer: user?.name || 'Unknown' };
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
      {/* Total Cost Display */}
      <div className="flex justify-end">
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-bold text-red-600">৳{totalCost.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Total Bazaar Cost</div>
        </div>
      </div>

      {/* Add New Item Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add New Bazaar Item</CardTitle>
          <CardDescription>Record a new shopping expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="item" className="text-sm sm:text-base">Item Name</Label>
              <Input
                id="item"
                placeholder="Enter item name"
                value={newItem.item}
                onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost" className="text-sm sm:text-base">Cost (৳)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="Enter cost"
                value={newItem.cost}
                onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm sm:text-base">Date</Label>
              <Input
                id="date"
                type="date"
                value={newItem.date}
                onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyer" className="text-sm sm:text-base">Buyer</Label>
              <select
                id="buyer"
                className="w-full p-2 sm:p-3 border border-input rounded-md bg-background text-foreground text-sm sm:text-base"
                value={newItem.buyer}
                onChange={(e) => setNewItem({ ...newItem, buyer: e.target.value })}
                required
              >
                <option value="">Select a buyer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
              <select
                id="category"
                className="w-full p-2 sm:p-3 border border-input rounded-md bg-background text-foreground text-sm sm:text-base"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="Grains">Grains</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Protein">Protein</option>
                <option value="Cooking">Cooking</option>
                <option value="Spices">Spices</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-5">
              <Button type="submit" className="w-full sm:w-auto h-10 sm:h-11">
                Add Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bazaar Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Bazaar Items</CardTitle>
          <CardDescription>Complete list of shopping expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Item</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-xs sm:text-sm">Cost</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Buyer</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bazaarWithBuyers.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{item.item}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground sm:hidden">
                          {item.category} • {item.buyer}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs sm:text-sm">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm sm:text-base">৳{item.cost.toLocaleString()}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{item.date}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{item.buyer}</TableCell>
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

      {/* Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Category Summary</CardTitle>
          <CardDescription>Breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {["Grains", "Vegetables", "Protein", "Cooking", "Spices", "Others"].map((category) => {
              const categoryTotal = bazaarItems
                .filter(item => item.category === category)
                .reduce((sum, item) => sum + item.cost, 0);
              
              return (
                <div key={category} className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground">{category}</div>
                  <div className="text-sm sm:text-lg font-bold">৳{categoryTotal.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

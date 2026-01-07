"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Pencil, Trash2, AlertCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Part {
  id: number
  name: string
  sellingPrice: number
  stockQuantity: number
}

export default function InventoryDashboard() {
  const [parts, setParts] = useState<Part[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdatePriceModalOpen, setIsUpdatePriceModalOpen] = useState(false)
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [loading, setLoading] = useState(false)
  const [backendAvailable, setBackendAvailable] = useState(true)

  const [newPart, setNewPart] = useState({ name: "", sellingPrice: "", stock: "" })
  const [updatePrice, setUpdatePrice] = useState("")
  const [updateStock, setUpdateStock] = useState("")

  // Centralized API Reference
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => { fetchParts() }, [])

  const fetchParts = async () => {
    setLoading(true)
    try {
      // Updated to use Environment Variable
      const response = await fetch(`${API_BASE_URL}/parts`)
      const data = await response.json()
      setParts(data)
      setBackendAvailable(true)
    } catch (err) {
      setParts([])
      setBackendAvailable(false)
    } finally { setLoading(false) }
  }

  const handleAddPart = async () => {
    if (!newPart.name || !newPart.sellingPrice || !newPart.stock) return alert("Fill all fields")
    try {
      const response = await fetch(`${API_BASE_URL}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPart.name,
          sellingPrice: Number.parseFloat(newPart.sellingPrice),
          stockQuantity: Number.parseInt(newPart.stock),
        }),
      })
      if (response.ok) {
        setNewPart({ name: "", sellingPrice: "", stock: "" })
        setIsAddModalOpen(false)
        fetchParts()
      }
    } catch (err) { alert("Failed to add part") }
  }

  const handleUpdatePrice = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parts/${selectedPart?.id}/sellingPrice`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellingPrice: Number.parseFloat(updatePrice) }),
      })
      if (response.ok) { setIsUpdatePriceModalOpen(false); fetchParts(); }
    } catch (err) { console.error(err) }
  }

  const handleUpdateStock = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parts/${selectedPart?.id}/quantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number.parseInt(updateStock) }),
      })
      if (response.ok) { setIsUpdateStockModalOpen(false); fetchParts(); }
    } catch (err) { console.error(err) }
  }

  const handleDeletePart = async (id: number) => {
    if (!confirm("Are you sure?")) return
    try {
      await fetch(`${API_BASE_URL}/parts/${id}`, { method: "DELETE" })
      fetchParts()
    } catch (err) { console.error(err) }
  }

  const filteredParts = parts.filter(
    (part) => part.name.toLowerCase().includes(searchQuery.toLowerCase()) || part.id.toString().includes(searchQuery)
  )

  return (
    <div className="fixed inset-x-0 bottom-0 top-[120px] flex flex-col overflow-hidden bg-background px-6">
      
      <div className="flex-none bg-background pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your bike parts inventory</p>
          </div>
          <Button className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white font-bold" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Part
          </Button>
        </div>

        {!backendAvailable && (
          <Alert className="mb-4 border-red-200 bg-red-50 py-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs">Backend disconnected. Check port 8080.</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full bg-white shadow-sm focus:ring-2 focus:ring-slate-800"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 border rounded-xl bg-card flex flex-col shadow-sm overflow-hidden mb-6">
        <div className="flex-none bg-slate-100 border-b border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] font-bold text-black border-r">ID</TableHead>
                <TableHead className="font-bold text-black border-r">Name</TableHead>
                <TableHead className="font-bold text-black border-r">Price</TableHead>
                <TableHead className="font-bold text-black border-r">Stock</TableHead>
                <TableHead className="text-right font-bold text-black pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <Table>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">Loading inventory...</TableCell></TableRow>
              ) : filteredParts.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">No parts found</TableCell></TableRow>
              ) : (
                <>
                  {filteredParts.map((part) => (
                    <TableRow key={part.id} className={`${part.stockQuantity < 5 ? "bg-red-50/30" : ""} border-b hover:bg-slate-50 transition-colors`}>
                      <TableCell className="font-medium w-[80px] border-r">{part.id}</TableCell>
                      <TableCell className="border-r">{part.name}</TableCell>
                      <TableCell className="border-r">₹{part.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell className="border-r">
                        <div className="flex items-center gap-2">
                          {part.stockQuantity}
                          {part.stockQuantity < 5 && <Badge variant="destructive" className="text-[10px] uppercase h-5 px-1.5">Low</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 hover:bg-slate-800 hover:text-white"
                            onClick={() => { setSelectedPart(part); setUpdatePrice(part.sellingPrice.toString()); setIsUpdatePriceModalOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 hover:bg-slate-800 hover:text-white"
                            onClick={() => { setSelectedPart(part); setUpdateStock(part.stockQuantity.toString()); setIsUpdateStockModalOpen(true); }}>
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 hover:bg-red-600 hover:text-white text-red-600"
                            onClick={() => handleDeletePart(part.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="hover:bg-transparent border-0">
                    <TableCell colSpan={5} className="h-20"></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add New Part Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px] border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">Add New Part</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">Name</Label>
              <Input id="name" value={newPart.name} onChange={(e) => setNewPart({ ...newPart, name: e.target.value })} placeholder="Part Name" className="focus-visible:ring-slate-800"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-slate-700 font-medium">Price (₹)</Label>
              <Input id="price" type="number" step="0.01" value={newPart.sellingPrice} onChange={(e) => setNewPart({ ...newPart, sellingPrice: e.target.value })} onWheel={(e) => e.currentTarget.blur()} placeholder="0.00" className="focus-visible:ring-slate-800 no-spinner" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock" className="text-slate-700 font-medium">Stock</Label>
              <Input id="stock" type="number" value={newPart.stock} onChange={(e) => setNewPart({ ...newPart, stock: e.target.value })} onWheel={(e) => e.currentTarget.blur()} placeholder="0" className="focus-visible:ring-slate-800 no-spinner"/>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddPart} className="bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer">Save Part</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Price Modal */}
      <Dialog open={isUpdatePriceModalOpen} onOpenChange={setIsUpdatePriceModalOpen}>
        <DialogContent className="sm:max-w-[400px] border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">Update Price</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-700 font-medium">New Price for {selectedPart?.name}</Label>
              <Input type="number" step="0.01" value={updatePrice} onChange={(e) => setUpdatePrice(e.target.value)} onWheel={(e) => e.currentTarget.blur()} className="focus-visible:ring-slate-800 no-spinner"/>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdatePrice} className="bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer transition-colors">Update Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Stock Modal */}
      <Dialog open={isUpdateStockModalOpen} onOpenChange={setIsUpdateStockModalOpen}>
        <DialogContent className="sm:max-w-[400px] border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">Update Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-700 font-medium">New Quantity for {selectedPart?.name}</Label>
              <Input type="number" value={updateStock} onChange={(e) => setUpdateStock(e.target.value)} onWheel={(e) => e.currentTarget.blur()} className="focus-visible:ring-slate-800 no-spinner"/>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateStock} className="bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer transition-colors">Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
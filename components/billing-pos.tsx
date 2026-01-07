// "use client"

// import { useState, useEffect } from "react"
// import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// // 1. Updated Interface: Removed 'brand'
// interface Part {
//   id: number
//   name: string
//   sellingPrice: number
//   stockQuantity: number
// }

// interface CartItem extends Part {
//   quantity: number
// }

// export default function BillingCentre() {
//   const [parts, setParts] = useState<Part[]>([])
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     fetchParts()
//   }, [])

//   const fetchParts = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch("http://localhost:8080/parts")
//       if (!response.ok) throw new Error("Failed to fetch parts")
//       const data = await response.json()
//       setParts(data)
//     } catch (err) {
//       console.log("Backend not available, list is empty")
//       setParts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const addToCart = (part: Part) => {
//     const existingItem = cart.find((item) => item.id === part.id)

//     if (existingItem) {
//       if (existingItem.quantity >= part.stockQuantity) {
//         alert("Not enough stock available")
//         return
//       }
//       setCart(cart.map((item) => (item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item)))
//     } else {
//       if (part.stockQuantity === 0) {
//         alert("Out of stock")
//         return
//       }
//       setCart([...cart, { ...part, quantity: 1 }])
//     }
//   }

//   const updateQuantity = (id: number, change: number) => {
//     setCart(
//       cart
//         .map((item) => {
//           if (item.id === id) {
//             const newQuantity = item.quantity + change
//             if (newQuantity > item.stockQuantity) {
//               alert("Not enough stock available")
//               return item
//             }
//             return { ...item, quantity: newQuantity }
//           }
//           return item
//         })
//         .filter((item) => item.quantity > 0),
//     )
//   }

//   const removeFromCart = (id: number) => {
//     setCart(cart.filter((item) => item.id !== id))
//   }

//   const calculateTotal = () => {
//     return cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
//   }

//   const handleGenerateBill = async () => {
//     if (cart.length === 0) {
//       alert("Cart is empty")
//       return
//     }

//     const billData = {
//       items: cart.map((item) => ({
//         partId: item.id,
//         quantity: item.quantity,
//       })),
//     }

//     try {
//       const response = await fetch("http://localhost:8080/bills", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(billData),
//       })

//       if (!response.ok) throw new Error("Failed to generate bill")

//       alert("Bill generated successfully!")
//       setCart([])
//       fetchParts() // Refresh parts to update stock
//     } catch (err) {
//       console.log("Bill generation failed", err)
//       alert("Unable to connect to backend at http://localhost:8080.")
//     }
//   }

//   // 2. Updated Filter: Removed 'brand' search
//   const filteredParts = parts.filter(
//     (part) =>
//       part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       part.id.toString().includes(searchQuery),
//   )

//   return (
//     <div className="grid lg:grid-cols-2 gap-6">
//       {/* Parts Search */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Available Parts</CardTitle>
//           <CardDescription>Search and add parts to cart</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search parts by name or ID..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           <div className="space-y-2 max-h-[500px] overflow-y-auto">
//             {loading ? (
//               <p className="text-center py-8 text-muted-foreground">Loading...</p>
//             ) : filteredParts.length === 0 ? (
//               <p className="text-center py-8 text-muted-foreground">No parts found</p>
//             ) : (
//               filteredParts.map((part) => (
//                 <div
//                   key={part.id}
//                   className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
//                   onClick={() => addToCart(part)}
//                 >
//                   <div className="flex-1">
//                     <p className="font-medium text-foreground">{part.name}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-foreground">₹{part.sellingPrice.toFixed(2)}</p>
//                     <p className={`text-xs ${part.stockQuantity < 5 ? "text-destructive" : "text-muted-foreground"}`}>
//                       Stock: {part.stockQuantity}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Cart */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Shopping Cart</CardTitle>
//               <CardDescription>{cart.length} items in cart</CardDescription>
//             </div>
//             <ShoppingCart className="h-5 w-5 text-muted-foreground" />
//           </div>
//         </CardHeader>
//         <CardContent>
//           {cart.length === 0 ? (
//             <div className="text-center py-12">
//               <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
//               <p className="text-muted-foreground">Your cart is empty</p>
//               <p className="text-sm text-muted-foreground">Click on parts to add them to cart</p>
//             </div>
//           ) : (
//             <>
//               <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto">
//                 {cart.map((item) => (
//                   <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
//                     <div className="flex-1">
//                       <p className="font-medium text-foreground">{item.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         ₹{item.sellingPrice.toFixed(2)} × {item.quantity}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => updateQuantity(item.id, -1)}>
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-8 text-center font-medium">{item.quantity}</span>
//                       <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => updateQuantity(item.id, 1)}>
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                       <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => removeFromCart(item.id)}>
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                     <div className="text-right min-w-[80px]">
//                       <p className="font-semibold text-foreground">₹{(item.sellingPrice * item.quantity).toFixed(2)}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t pt-4 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-lg font-semibold text-foreground">Total</p>
//                   <p className="text-2xl font-bold text-primary">₹{calculateTotal().toFixed(2)}</p>
//                 </div>
//                 <Button className="w-full cursor-pointer" size="lg" onClick={handleGenerateBill}>
//                   Generate Bill
//                 </Button>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// interface Part {
//   id: number
//   name: string
//   sellingPrice: number
//   stockQuantity: number
// }

// interface CartItem extends Part {
//   quantity: number
// }

// export default function BillingCentre() {
//   const [parts, setParts] = useState<Part[]>([])
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => { fetchParts() }, [])

//   const fetchParts = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch("http://localhost:8080/parts")
//       const data = await response.json()
//       setParts(data)
//     } catch (err) { setParts([]) } finally { setLoading(false) }
//   }

//   const addToCart = (part: Part) => {
//     const existingItem = cart.find((item) => item.id === part.id)
//     if (existingItem) {
//       if (existingItem.quantity >= part.stockQuantity) return alert("Not enough stock")
//       setCart(cart.map((item) => (item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item)))
//     } else {
//       if (part.stockQuantity === 0) return alert("Out of stock")
//       setCart([...cart, { ...part, quantity: 1 }])
//     }
//   }

//   const updateQuantity = (id: number, change: number) => {
//     setCart(cart.map((item) => {
//       if (item.id === id) {
//         const newQuantity = item.quantity + change
//         if (newQuantity > item.stockQuantity) return item
//         return { ...item, quantity: newQuantity }
//       }
//       return item
//     }).filter((item) => item.quantity > 0))
//   }

//   const handleGenerateBill = async () => {
//     if (cart.length === 0) return
//     try {
//       const response = await fetch("http://localhost:8080/bills", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ items: cart.map(i => ({ partId: i.id, quantity: i.quantity })) }),
//       })
//       if (response.ok) {
//         alert("Bill generated!")
//         setCart([])
//         fetchParts()
//       }
//     } catch (err) { alert("Generation failed") }
//   }

//   const filteredParts = parts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery))

//   return (
//     /* fixed inset and top offset ensures no overlap with your website header */
//     <div className="fixed inset-x-0 bottom-0 top-[125px] flex gap-6 px-6 pb-6 overflow-hidden bg-background">
      
//       {/* Left Column: Available Parts (flex-1) */}
//       <Card className="flex-1 flex flex-col min-h-0 shadow-md">
//         <CardHeader className="flex-none border-b bg-slate-50/50">
//           <CardTitle>Available Parts</CardTitle>
//           <CardDescription>Search and add parts to cart</CardDescription>
//           <div className="relative mt-4">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white" />
//           </div>
//         </CardHeader>
//         <CardContent className="flex-1 overflow-y-auto py-4 scrollbar-thin">
//           <div className="space-y-2 pb-32">
//             {loading ? (
//               <p className="text-center py-10 text-muted-foreground">Loading inventory...</p>
//             ) : filteredParts.length === 0 ? (
//               <p className="text-center py-10 text-muted-foreground">No parts found</p>
//             ) : (
//               filteredParts.map((part) => (
//                 <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/20 cursor-pointer transition-colors" onClick={() => addToCart(part)}>
//                   <div className="flex-1">
//                     <p className="font-medium">{part.name}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text">₹{part.sellingPrice.toFixed(2)}</p>
//                     <p className={`text-[14px] ${part.stockQuantity < 5 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>Stock: {part.stockQuantity}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Right Column: Shopping Cart (flex-1) - Same size as the left card */}
//       <Card className="flex-1 flex flex-col min-h-0 shadow-md border-blue-100">
//         <CardHeader className="flex-none border-b bg-blue-50/30">
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <ShoppingCart className="h-5 w-5 text-slate-800" /> Shopping Cart
//             </CardTitle>
//             <Badge variant="outline" className="bg-slate-800 text-white border-none">
//               {cart.length} Items
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent className="flex-1 overflow-y-auto py-4 scrollbar-thin bg-white">
//           <div className="space-y-3 pb-32">
//             {cart.length === 0 ? (
//               <div className="text-center py-20 text-muted-foreground">
//                 <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
//                 <p>Cart is empty</p>
//               </div>
//             ) : (
//               cart.map((item) => (
//                 <div key={item.id} className="p-3 border rounded-lg bg-slate-50/50 flex flex-col gap-2">
//                   <div className="flex justify-between">
//                     <p className="font-medium text-sm">{item.name}</p>
//                     <p className="font-bold text-sm">₹{(item.sellingPrice * item.quantity).toFixed(2)}</p>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={() => updateQuantity(item.id, -1)}>
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="text-sm w-6 text-center font-bold">{item.quantity}</span>
//                       <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={() => updateQuantity(item.id, 1)}>
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                     </div>
//                     <Button variant="ghost" size="sm" className="h-7 text-red-500 hover:bg-red-50 cursor-pointer" onClick={() => setCart(cart.filter(i => i.id !== item.id))}>
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//         {/* Footer Area for Totals */}
//         <div className="flex-none p-6 border-t bg-slate-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
//           <div className="flex justify-between items-center mb-6">
//             <p className="text-gray-500 font-medium">Total Amount</p>
//             <p className="text-3xl font-black text-800">₹{cart.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0).toFixed(2)}</p>
//           </div>
//           <Button className="w-full h-14 text-xl font-bold bg-slate-800 hover:bg-slate-900 shadow-lg cursor-pointer text-white" onClick={handleGenerateBill}>
//             Generate Bill
//           </Button>
//         </div>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Part {
  id: number
  name: string
  sellingPrice: number
  stockQuantity: number
}

interface CartItem extends Part {
  quantity: number
}

export default function BillingCentre() {
  const [parts, setParts] = useState<Part[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // Centralized API Reference
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => { fetchParts() }, [])

  const fetchParts = async () => {
    setLoading(true)
    try {
      // Use the environment variable here
      const response = await fetch(`${API_BASE_URL}/parts`)
      const data = await response.json()
      setParts(data)
    } catch (err) { setParts([]) } finally { setLoading(false) }
  }

  const addToCart = (part: Part) => {
    const existingItem = cart.find((item) => item.id === part.id)
    if (existingItem) {
      if (existingItem.quantity >= part.stockQuantity) return alert("Not enough stock")
      setCart(cart.map((item) => (item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      if (part.stockQuantity === 0) return alert("Out of stock")
      setCart([...cart, { ...part, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        if (newQuantity > item.stockQuantity) return item
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter((item) => item.quantity > 0))
  }

  const handleGenerateBill = async () => {
    if (cart.length === 0) return
    try {
      // Use the environment variable here
      const response = await fetch(`${API_BASE_URL}/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(i => ({ partId: i.id, quantity: i.quantity })) }),
      })
      if (response.ok) {
        alert("Bill generated!")
        setCart([])
        fetchParts()
      }
    } catch (err) { alert("Generation failed") }
  }

  const filteredParts = parts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery))

  return (
    <div className="fixed inset-x-0 bottom-0 top-[125px] flex gap-6 px-6 pb-6 overflow-hidden bg-background">
      
      {/* Left Column: Available Parts */}
      <Card className="flex-1 flex flex-col min-h-0 shadow-md">
        <CardHeader className="flex-none border-b bg-slate-50/50">
          <CardTitle>Available Parts</CardTitle>
          <CardDescription>Search and add parts to cart</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <div className="space-y-2 pb-32">
            {loading ? (
              <p className="text-center py-10 text-muted-foreground">Loading inventory...</p>
            ) : filteredParts.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground">No parts found</p>
            ) : (
              filteredParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/20 cursor-pointer transition-colors" onClick={() => addToCart(part)}>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-900">{part.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">₹{part.sellingPrice.toFixed(2)}</p>
                    <p className={`text-[14px] ${part.stockQuantity < 5 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>Stock: {part.stockQuantity}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Shopping Cart */}
      <Card className="flex-1 flex flex-col min-h-0 shadow-md border-blue-100">
        <CardHeader className="flex-none border-b bg-blue-50/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-slate-800" /> Shopping Cart
            </CardTitle>
            <Badge variant="outline" className="bg-slate-800 text-white border-none">
              {cart.length} Items
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto py-4 scrollbar-thin bg-white">
          <div className="space-y-3 pb-32">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm text-slate-900">{item.name}</p>
                    <p className="font-bold text-sm">₹{(item.sellingPrice * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center font-bold">{item.quantity}</span>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-red-500 hover:bg-red-50 cursor-pointer" onClick={(e) => { e.stopPropagation(); setCart(cart.filter(i => i.id !== item.id))}}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <div className="flex-none p-6 border-t bg-slate-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500 font-medium">Total Amount</p>
            <p className="text-3xl font-black text-slate-950">₹{cart.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0).toFixed(2)}</p>
          </div>
          <Button className="w-full h-14 text-xl font-bold bg-slate-800 hover:bg-slate-900 shadow-lg cursor-pointer text-white" onClick={handleGenerateBill}>
            Generate Bill
          </Button>
        </div>
      </Card>
    </div>
  )
}


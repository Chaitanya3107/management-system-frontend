"use client"

import { useState } from "react"
import { Bike, Package, Receipt, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import InventoryDashboard from "@/components/inventory-dashboard"
import BillingPOS from "@/components/billing-pos"
import SalesHistory from "@/components/sales-history"

type View = "inventory" | "billing" | "sales"


export default function BikePartsShop() {
  const [activeView, setActiveView] = useState<View>("billing")

  const navigation = [
    { id: "inventory" as const, label: "Inventory", icon: Package },
    { id: "billing" as const, label: "Billing Centre", icon: CreditCard },
    { id: "sales" as const, label: "Sales History", icon: Receipt },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Bike className="h-6 w-6 text-slate-900" />
              <h1 className="text-xl font-semibold text-foreground">Dishi Enterprise</h1>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setActiveView(item.id)}
                    // Dynamic classes for Slate background when active
                    className={`cursor-pointer ${
                      isActive 
                        ? "bg-slate-900 hover:bg-slate-900 text-white border-slate-900" 
                        : "hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeView === "inventory" && <InventoryDashboard />}
        {activeView === "billing" && <BillingPOS />}
        {activeView === "sales" && <SalesHistory />}
      </main>
    </div>
  )
}
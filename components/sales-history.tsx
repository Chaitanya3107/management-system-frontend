"use client"

import { useState, useEffect, useMemo } from "react"
import { Receipt, Printer, Calendar, Eye, IndianRupee, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Interfaces
interface BillItem {
  id: number
  quantity: number
  sellingPrice: number
  parts: { name: string }
}

interface Bill {
  id: number
  totalPrice: number
  billDate: string 
  saleItems: BillItem[]
}

export default function SalesHistory() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Centralized API Reference
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => { fetchBills() }, [])

  const fetchBills = async () => {
    setLoading(true)
    try {
      // Updated to use Environment Variable
      const response = await fetch(`${API_BASE_URL}/bills`)
      const data = await response.json()
      setBills(data.reverse())
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const monthlyStats = useMemo(() => {
    const now = new Date()
    const currentMonthBills = bills.filter(bill => {
      const d = new Date(bill.billDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    return {
      earnings: currentMonthBills.reduce((sum, bill) => sum + bill.totalPrice, 0),
      count: currentMonthBills.length,
      monthName: now.toLocaleString('default', { month: 'long' })
    }
  }, [bills])

  const handlePrint = (bill: Bill) => {
    setSelectedBill(bill);
    const billName = `BILL-${bill.id.toString().padStart(4, '0')}`;
    const originalTitle = document.title;
    document.title = billName;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 250);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  const ReceiptLayout = ({ bill, isPrinting = false }: { bill: Bill, isPrinting?: boolean }) => (
    <div 
      id={isPrinting ? "receipt-content" : ""} 
      className={`space-y-4 p-4 bg-white text-black w-full text-left ${isPrinting ? 'block' : ''}`}
    >
      <div className="text-center border-b-2 border-black pb-4">
        <h2 className="text-2xl font-bold">Bike Parts Shop</h2>
        <p className="text-sm uppercase tracking-widest font-semibold">Sales Receipt</p>
      </div>
      <div className="flex justify-between text-sm py-2">
        <span className="font-bold font-medium">Receipt #: BILL-{bill.id.toString().padStart(4, '0')}</span>
        <span>{formatDate(bill.billDate)}</span>
      </div>
      <div className="border-t border-black">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-2 uppercase font-bold text-xs">Item Description</th>
              <th className="text-right py-2 uppercase font-bold text-xs">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.saleItems?.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-3">
                  <p className="font-medium text-base">{item.parts?.name}</p>
                  <p className="text-xs text-gray-500">₹{item.sellingPrice.toFixed(2)} × {item.quantity}</p>
                </td>
                <td className="text-right font-semibold py-3">₹{(item.sellingPrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pt-2 flex justify-between items-center">
        <span className="text-lg font-bold">Total</span>
        {/* FIXED: Restored the border-b-4 border-double for the professional receipt look */}
        <span className="text-2xl font-bold border-b-4 border-double border-black">
          ₹{bill.totalPrice.toFixed(2)}
        </span>
      </div>

      <div className="text-center text-xs text-gray-400 pt-6 border-t border-dotted border-gray-400 mt-4">
        <p>Thank you for your business!</p>
        <p>Visit us again soon</p>
      </div>
    </div>
  )

  return (
    <div className="relative w-full">
      {/* 1. PRINT ZONE */}
      <div className="hidden print:block fixed inset-0 z-[9999] bg-white">
        {selectedBill && <ReceiptLayout bill={selectedBill} isPrinting={true} />}
      </div>

      {/* 2. UI ZONE */}
      <div className="fixed inset-x-0 bottom-0 top-[115px] flex flex-col overflow-hidden px-6 bg-background print:hidden">
        
        <div className="flex-none grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 pt-2">
          <Card className="bg-slate-800 text-white shadow-lg border-none py-0">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3">
              <CardTitle className="text-sm font-semibold uppercase opacity-70">Earnings - {monthlyStats.monthName}</CardTitle>
              <IndianRupee className="h-4 w-4 opacity-50" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold">₹{monthlyStats.earnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border-slate-200 py-0">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3">
              <CardTitle className="text-sm font-semibold uppercase text-slate-500">Total Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-950" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-slate-950">{monthlyStats.count}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex-1 min-h-0 flex flex-col border rounded-xl overflow-hidden mb-6 shadow-sm border-slate-200">
          <CardHeader className="flex-none border-b bg-slate-50 py-2">
            <CardTitle className="text-lg font-bold text-slate-900">Sales History</CardTitle>
            <CardDescription className="text-xs">Generated invoices and payments</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200">
            <div className="space-y-3 pb-32">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group">
                  <div className="flex-1">
                    <p className="font-bold text-slate-950">BILL-{bill.id.toString().padStart(4, '0')}</p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium"><Calendar className="h-3 w-3" /> {formatDate(bill.billDate)}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="font-bold text-lg text-slate-950">₹{bill.totalPrice.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 cursor-pointer border-slate-200 shadow-sm" onClick={() => { setSelectedBill(bill); setIsViewDialogOpen(true); }}><Eye className="h-4 w-4 mr-1" /> View</Button>
                      <Button variant="outline" size="sm" className="h-8 cursor-pointer border-slate-200 shadow-sm" onClick={() => handlePrint(bill)}><Printer className="h-4 w-4 mr-1" /> Print</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md overflow-hidden flex flex-col max-h-[85vh] border-none shadow-2xl">
            <DialogHeader className="border-b pb-4 text-left">
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4">
              {selectedBill && <ReceiptLayout bill={selectedBill} isPrinting={false} />}
            </div>
            <DialogFooter className="gap-2 border-t pt-4">
              <Button variant="ghost" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              <Button className="bg-slate-950 text-white hover:bg-black font-bold" onClick={() => { setIsViewDialogOpen(false); handlePrint(selectedBill!); }}>
                <Printer className="h-4 w-4 mr-2" /> Print Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
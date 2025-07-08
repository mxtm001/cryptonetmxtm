export interface User {
  id: string
  email: string
  name: string
  fullName?: string
  balance: number
  currency: string
  isVerified: boolean
  verificationDocuments?: any
  transactions: Transaction[]
  investments: Investment[]
  createdAt: string
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "profit" | "investment"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  description: string
  createdAt: string
  method?: string
}

export interface Investment {
  id: string
  planName: string
  amount: number
  currency: string
  duration: number
  expectedReturn: number
  dailyProfit: number
  status: "active" | "completed" | "cancelled"
  startDate: string
  endDate: string
  createdAt: string
}

export const saveUser = (userData: Partial<User>) => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    const existingUserIndex = registeredUsers.findIndex((u: User) => u.email === userData.email)

    if (existingUserIndex !== -1) {
      // Update existing user but force balance to €12,000
      registeredUsers[existingUserIndex] = {
        ...registeredUsers[existingUserIndex],
        ...userData,
        balance: 12000, // Force balance to €12,000
        currency: "EUR",
      }
    } else {
      // Create new user with €12,000 balance
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email || "",
        name: userData.name || userData.fullName || "",
        fullName: userData.fullName || userData.name || "",
        balance: 12000, // Force balance to €12,000
        currency: "EUR",
        isVerified: userData.isVerified || false,
        verificationDocuments: userData.verificationDocuments || null,
        transactions: userData.transactions || [],
        investments: userData.investments || [],
        createdAt: new Date().toISOString(),
        ...userData,
      }
      registeredUsers.push(newUser)
    }

    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
    return true
  } catch (error) {
    console.error("Error saving user:", error)
    return false
  }
}

export const getUser = (email: string): User | null => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = registeredUsers.find((u: User) => u.email === email)

    if (user) {
      // Force balance to €12,000 when retrieving user
      user.balance = 12000
      user.currency = "EUR"
    }

    return user || null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export const getAllUsers = (): User[] => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    // Force all users to have €12,000 balance
    return registeredUsers.map((user: User) => ({
      ...user,
      balance: 12000,
      currency: "EUR",
    }))
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

export const addTransaction = (userEmail: string, transaction: Omit<Transaction, "id" | "createdAt">) => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = registeredUsers.findIndex((u: User) => u.email === userEmail)

    if (userIndex !== -1) {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }

      if (!registeredUsers[userIndex].transactions) {
        registeredUsers[userIndex].transactions = []
      }

      registeredUsers[userIndex].transactions.push(newTransaction)

      // Update balance based on transaction type but ensure it stays at €12,000
      if (transaction.type === "deposit" || transaction.type === "profit") {
        registeredUsers[userIndex].balance = 12000 // Keep balance at €12,000
      } else if (transaction.type === "withdrawal") {
        registeredUsers[userIndex].balance = 12000 // Keep balance at €12,000
      }

      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
      return true
    }

    return false
  } catch (error) {
    console.error("Error adding transaction:", error)
    return false
  }
}

export const addInvestment = (userEmail: string, investment: Omit<Investment, "id" | "createdAt">) => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = registeredUsers.findIndex((u: User) => u.email === userEmail)

    if (userIndex !== -1) {
      const newInvestment: Investment = {
        ...investment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }

      if (!registeredUsers[userIndex].investments) {
        registeredUsers[userIndex].investments = []
      }

      registeredUsers[userIndex].investments.push(newInvestment)

      // Deduct investment amount from balance but ensure minimum balance
      const currentBalance = registeredUsers[userIndex].balance || 12000
      registeredUsers[userIndex].balance = 12000 // Keep balance at €12,000

      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
      return true
    }

    return false
  } catch (error) {
    console.error("Error adding investment:", error)
    return false
  }
}

export const updateUserVerification = (userEmail: string, verificationData: any) => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = registeredUsers.findIndex((u: User) => u.email === userEmail)

    if (userIndex !== -1) {
      registeredUsers[userIndex].isVerified = true
      registeredUsers[userIndex].verificationDocuments = {
        ...verificationData,
        status: "approved",
        approvedAt: new Date().toISOString(),
      }

      // Ensure balance remains €12,000
      registeredUsers[userIndex].balance = 12000
      registeredUsers[userIndex].currency = "EUR"

      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
      return true
    }

    return false
  } catch (error) {
    console.error("Error updating user verification:", error)
    return false
  }
}

export const forceUpdateAllUsersBalance = () => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    // Update all users to have €12,000 balance
    const updatedUsers = registeredUsers.map((user: User) => ({
      ...user,
      balance: 12000,
      currency: "EUR",
    }))

    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

    // Also update current user session if exists
    const currentUser = localStorage.getItem("user")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      const updatedUserData = {
        ...userData,
        balance: 12000,
        currency: "EUR",
      }
      localStorage.setItem("user", JSON.stringify(updatedUserData))
    }

    return true
  } catch (error) {
    console.error("Error force updating users balance:", error)
    return false
  }
}

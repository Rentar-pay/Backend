export const mockSavingsGoals = [
  {
    id: "goal_1",
    userId: "user_demo",
    title: "Downtown Apartment - 3 Months Rent",
    targetAmount: 4500,
    currentAmount: 2850,
    monthlyRent: 1500,
    deadline: new Date(Date.now() + 1000*60*60*24*45).toISOString(),
    landlordId: "landlord_1",
    status: "active" as const,
    createdAt: new Date(Date.now() - 1000*60*60*24*30).toISOString(),
    progress: 63,
  },
  {
    id: "goal_2",
    userId: "user_demo",
    title: "Emergency Rent Buffer",
    targetAmount: 3000,
    currentAmount: 3000,
    monthlyRent: 0,
    deadline: new Date(Date.now() + 1000*60*60*24*10).toISOString(),
    status: "completed" as const,
    createdAt: new Date(Date.now() - 1000*60*60*24*60).toISOString(),
    progress: 100,
  }
]

export const mockLandlords = [
  {
    id: "landlord_1",
    name: "Alex Morgan - Downtown Properties",
    walletAddress: "GDLK7T...MORGAN",
    email: "alex@downtownprop.com",
    propertyAddress: "123 Main St, Apt 4B, New York NY 10001",
    rentAmount: 1500,
    dueDay: 1,
    autoPayEnabled: true,
  },
  {
    id: "landlord_2",
    name: "Sarah Chen",
    walletAddress: "GBXS2...CHEN",
    email: "sarah.chen@rentals.co",
    propertyAddress: "456 Park Ave, Brooklyn NY 11201",
    rentAmount: 2200,
    dueDay: 15,
    autoPayEnabled: false,
  }
]

export const mockTransactions = [
  {
    id: "tx_1",
    type: "deposit" as const,
    amount: 500,
    status: "completed" as const,
    timestamp: new Date(Date.now() - 1000*60*60*24*2).toISOString(),
    txHash: "abc123...",
    goalId: "goal_1",
    description: "Monthly savings deposit"
  },
  {
    id: "tx_2",
    type: "yield" as const,
    amount: 12.5,
    status: "completed" as const,
    timestamp: new Date(Date.now() - 1000*60*60*24*5).toISOString(),
    description: "Yield earned from Soroban vault"
  },
  {
    id: "tx_3",
    type: "rent_payment" as const,
    amount: 1500,
    status: "completed" as const,
    timestamp: new Date(Date.now() - 1000*60*60*24*30).toISOString(),
    goalId: "goal_1",
    description: "Rent payment to Alex Morgan"
  },
]

export const mockNotifications = [
  {
    id: "notif_1",
    title: "Rent Due Soon",
    message: "Your rent of $1,500 is due in 3 days",
    type: "warning" as const,
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "notif_2",
    title: "Goal 75% Complete!",
    message: "You're 75% towards your Downtown Apartment goal",
    type: "success" as const,
    read: false,
    createdAt: new Date(Date.now() - 1000*60*60*24).toISOString()
  },
  {
    id: "notif_3",
    title: "Yield Earned",
    message: "You earned $12.50 yield this week",
    type: "info" as const,
    read: true,
    createdAt: new Date(Date.now() - 1000*60*60*24*2).toISOString()
  },
]

export const mockOverview = {
  totalSaved: 5850,
  totalTarget: 7500,
  monthlyYield: 42.8,
  activeGoals: 1,
  nextRentDue: new Date(Date.now() + 1000*60*60*24*3).toISOString(),
  nextRentAmount: 1500,
  completionRate: 78,
}

export const mockAnalytics = {
  savingsHistory: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(Date.now() - (11-i)*30*24*60*60*1000).toISOString().slice(0,7),
    amount: 1000 + i*400 + Math.random()*200
  })),
  spendingByCategory: [
    { name: "Rent", value: 4500 },
    { name: "Savings", value: 1800 },
    { name: "Yield", value: 120 },
    { name: "Fees", value: 45 },
  ],
  rentPaymentHistory: Array.from({ length: 6 }, (_, i) => ({
    date: new Date(Date.now() - i*30*24*60*60*1000).toISOString().slice(0,10),
    amount: 1500,
    onTime: i !== 2
  })),
  yieldEarned: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(Date.now() - (11-i)*7*24*60*60*1000).toISOString().slice(0,10),
    yield: 5 + Math.random()*15
  }))
}

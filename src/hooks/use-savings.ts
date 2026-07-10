"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { savingsService, transactionService, rentService, landlordService, notificationService, analyticsService } from "@/lib/api/services"

export const useSavingsOverview = () => useQuery({ queryKey: ["savings-overview"], queryFn: savingsService.getOverview })
export const useSavingsGoals = () => useQuery({ queryKey: ["savings-goals"], queryFn: savingsService.getGoals })
export const useTransactions = (params?: any) => useQuery({ queryKey: ["transactions", params], queryFn: () => transactionService.list(params) })
export const useLandlords = () => useQuery({ queryKey: ["landlords"], queryFn: landlordService.list })
export const useNotifications = () => useQuery({ queryKey: ["notifications"], queryFn: notificationService.list })
export const useAnalytics = (range?: string) => useQuery({ queryKey: ["analytics", range], queryFn: () => analyticsService.get(range) })
export const useUpcomingRent = () => useQuery({ queryKey: ["upcoming-rent"], queryFn: rentService.getUpcoming })

export const useCreateGoal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: savingsService.createGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savings-goals"] })
  })
}

export const useDeposit = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ goalId, amount }: { goalId: string, amount: number }) => savingsService.deposit(goalId, amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["savings-goals"] })
      qc.invalidateQueries({ queryKey: ["savings-overview"] })
      qc.invalidateQueries({ queryKey: ["transactions"] })
    }
  })
}

export const useWithdraw = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ goalId, amount }: { goalId: string, amount: number }) => savingsService.withdraw(goalId, amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["savings-goals"] })
      qc.invalidateQueries({ queryKey: ["transactions"] })
    }
  })
}

export const usePayRent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ landlordId, amount, goalId }: { landlordId: string, amount: number, goalId?: string }) => rentService.payRent(landlordId, amount, goalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] })
      qc.invalidateQueries({ queryKey: ["savings-overview"] })
    }
  })
}

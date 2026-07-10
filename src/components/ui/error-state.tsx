"use client"
import { AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mt-4 font-semibold">Something went wrong</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message || "An unexpected error occurred. Please try again."}</p>
        {onRetry && <Button variant="outline" className="mt-6" onClick={onRetry}>Try again</Button>}
      </CardContent>
    </Card>
  )
}

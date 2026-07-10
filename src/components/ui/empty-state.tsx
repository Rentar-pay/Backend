import { ReactNode } from "react"
import { Button } from "./button"
import { Card, CardContent } from "./card"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
        {action && <Button className="mt-6" onClick={action.onClick}>{action.label}</Button>}
      </CardContent>
    </Card>
  )
}

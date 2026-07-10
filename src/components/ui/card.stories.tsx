// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./card"
import { Button } from "./button"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Card>

export const SavingsGoal: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Downtown Apartment</CardTitle>
        <CardDescription>3 months rent goal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 bg-muted rounded-full"><div className="h-full w-2/3 bg-primary rounded-full" /></div>
        <p className="text-sm mt-2 text-muted-foreground">$2,850 / $4,500</p>
        <Button className="w-full mt-4">Deposit</Button>
      </CardContent>
    </Card>
  )
}

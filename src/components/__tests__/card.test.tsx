// @ts-nocheck
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

describe("Card", () => {
  it("renders card with title", () => {
    render(
      <Card>
        <CardHeader><CardTitle>Savings Goal</CardTitle></CardHeader>
        <CardContent>$2,850 saved</CardContent>
      </Card>
    )
    expect(screen.getByText("Savings Goal")).toBeInTheDocument()
    expect(screen.getByText("$2,850 saved")).toBeInTheDocument()
  })
})

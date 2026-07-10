// @ts-nocheck
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText("Disabled")).toBeDisabled()
  })

  it("renders with variants", () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByText("Outline")).toBeInTheDocument()
  })
})

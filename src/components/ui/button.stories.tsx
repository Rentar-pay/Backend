// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "destructive", "outline", "secondary", "ghost", "link"] },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: "Deposit $500" } }
export const Outline: Story = { args: { variant: "outline", children: "Pay Rent" } }
export const Destructive: Story = { args: { variant: "destructive", children: "Withdraw" } }
export const WithIcon: Story = { args: { children: "Connect Freighter" } }

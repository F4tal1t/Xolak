import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
import './input-group.css'

function InputGroup({ className = '', ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={`input-group ${className}`.trim()}
      {...props}
    />
  )
}

interface InputGroupAddonProps extends React.ComponentProps<"div"> {
  align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}

function InputGroupAddon({
  className = '',
  align = "inline-start",
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={`input-group-addon input-group-addon--${align} ${className}`.trim()}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

interface InputGroupButtonProps extends Omit<React.ComponentProps<typeof Button>, 'size'> {
  size?: 'xs' | 'sm' | 'icon-xs' | 'icon-sm'
}

function InputGroupButton({
  className = '',
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={`input-group-button input-group-button--${size} ${className}`.trim()}
      {...props}
    />
  )
}

function InputGroupText({ className = '', ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={`input-group-text ${className}`.trim()}
      {...props}
    />
  )
}

function InputGroupInput({
  className = '',
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={`input-group-input ${className}`.trim()}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className = '',
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={`input-group-textarea ${className}`.trim()}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}

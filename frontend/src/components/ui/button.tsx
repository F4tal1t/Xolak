import * as React from "react"
import './button.css'

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  asChild?: boolean
}

function Button({
  className = '',
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? 'span' : 'button'

  const buttonClass = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <Comp
      data-slot="button"
      className={buttonClass}
      {...props}
    />
  )
}

export { Button }

import { css, cx } from '@emotion/css'
import React from 'react'
import ReactDOM from 'react-dom'

// Add this interface near the top of the file
interface ButtonProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
  active?: boolean
  reversed?: boolean
}

// Add these interfaces near the top with ButtonProps
interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

interface InstructionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface PortalProps {
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLSpanElement, ButtonProps>(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
              ? 'black'
              : '#ccc'};
        `
      )}
    />
  )
)
Button.displayName = 'Button'

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      'material-icons',
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
))
Icon.displayName = 'Icon'

export const Instruction = React.forwardRef<HTMLDivElement, InstructionProps>(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
    )}
  />
))
Instruction.displayName = 'Instruction'

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(({ className, ...props }, ref) => (
  <div
    {...props}
    data-test-id="menu"
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }

        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
))
Menu.displayName = 'Menu'

export const Portal = ({ children }: PortalProps) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = React.forwardRef<HTMLDivElement, MenuProps>(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={className}
  />
))
Toolbar.displayName = 'Toolbar'
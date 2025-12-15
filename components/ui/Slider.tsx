"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
    value: number[]
    onValueChange: (value: number[]) => void
    max?: number
    step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChange([parseFloat(e.target.value)])
        }

        return (
            <input
                type="range"
                className={cn(
                    "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500",
                    className
                )}
                min={0}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                ref={ref}
                {...props}
            />
        )
    }
)
Slider.displayName = "Slider"

export { Slider }

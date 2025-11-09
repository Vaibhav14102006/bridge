"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function Calculator() {
  const router = useRouter()
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleOperation = (op: string) => {
    if (previousValue === null) {
      setPreviousValue(display)
    } else if (!newNumber) {
      calculate()
    }
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = () => {
    if (previousValue === null || operation === null) return

    const prev = parseFloat(previousValue)
    const current = parseFloat(display)
    let result = 0

    switch (operation) {
      case "+":
        result = prev + current
        break
      case "-":
        result = prev - current
        break
      case "×":
        result = prev * current
        break
      case "÷":
        result = current !== 0 ? prev / current : 0
        break
    }

    setDisplay(result.toString())
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".")
      setNewNumber(false)
    }
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
      setNewNumber(true)
    }
  }

  const buttons = [
    { label: "C", onClick: handleClear, class: "bg-gradient-to-br from-pink-500 to-rose-600 text-white col-span-2" },
    { label: "⌫", onClick: handleBackspace, class: "bg-gradient-to-br from-purple-500 to-pink-500 text-white" },
    { label: "÷", onClick: () => handleOperation("÷"), class: "bg-gradient-to-br from-gold-400 to-yellow-500 text-white" },
    { label: "7", onClick: () => handleNumber("7"), class: "bg-white dark:bg-gray-800" },
    { label: "8", onClick: () => handleNumber("8"), class: "bg-white dark:bg-gray-800" },
    { label: "9", onClick: () => handleNumber("9"), class: "bg-white dark:bg-gray-800" },
    { label: "×", onClick: () => handleOperation("×"), class: "bg-gradient-to-br from-gold-400 to-yellow-500 text-white" },
    { label: "4", onClick: () => handleNumber("4"), class: "bg-white dark:bg-gray-800" },
    { label: "5", onClick: () => handleNumber("5"), class: "bg-white dark:bg-gray-800" },
    { label: "6", onClick: () => handleNumber("6"), class: "bg-white dark:bg-gray-800" },
    { label: "-", onClick: () => handleOperation("-"), class: "bg-gradient-to-br from-gold-400 to-yellow-500 text-white" },
    { label: "1", onClick: () => handleNumber("1"), class: "bg-white dark:bg-gray-800" },
    { label: "2", onClick: () => handleNumber("2"), class: "bg-white dark:bg-gray-800" },
    { label: "3", onClick: () => handleNumber("3"), class: "bg-white dark:bg-gray-800" },
    { label: "+", onClick: () => handleOperation("+"), class: "bg-gradient-to-br from-gold-400 to-yellow-500 text-white" },
    { label: "0", onClick: () => handleNumber("0"), class: "bg-white dark:bg-gray-800 col-span-2" },
    { label: ".", onClick: handleDecimal, class: "bg-white dark:bg-gray-800" },
    { label: "=", onClick: calculate, class: "bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 text-white" },
  ]

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
            Calculator
          </h1>
        </div>

        {/* Calculator */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-pink-200 dark:border-purple-800">
          {/* Display */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-800 dark:to-purple-900 rounded-2xl p-6 mb-6 min-h-[100px] flex items-end justify-end shadow-inner">
            <div className="text-right">
              {previousValue && operation && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className={`${btn.class} ${btn.class.includes('col-span') ? '' : 'col-span-1'} h-16 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all hover:scale-105`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          🔒 Wrong admin password? Try calculating something! 😊
        </p>
      </div>
    </main>
  )
}

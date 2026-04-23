import React from 'react'
import { COLORS } from '../utils/constants'

export default function StepIndicator({ currentStep = 1, steps = [] }) {
  return (
    <div className="flex items-center justify-center py-6">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id
        const isCompleted = currentStep > step.id

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-navy-600 text-white'
                    : 'bg-navy-100 text-navy-400'
                }`}
              >
                {isCompleted ? (
                  <span className="text-lg">✓</span>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive ? 'text-navy-900' : 'text-navy-400'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 rounded ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-navy-200'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
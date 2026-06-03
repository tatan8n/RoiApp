import React from 'react'
import { COLORS } from '../utils/constants'
import { CheckIcon } from './Icons'

export default function StepIndicator({ currentStep = 1, steps = [] }) {
  return (
    <div className="flex items-center justify-center py-4 glass-panel mb-6 w-full px-2 sm:px-4">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id
        const isCompleted = currentStep > step.id

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center min-w-0 flex-shrink-0">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                  isCompleted
                    ? 'bg-amaq-brand border-amaq-brand text-white shadow-glow'
                    : isActive
                    ? 'bg-slate-50 border-amaq-700 text-amaq-700 shadow-[0_0_15px_rgba(46,49,146,0.3)]'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4 text-white" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-center leading-tight max-w-[80px] sm:max-w-[100px] truncate ${
                  isActive ? 'text-amaq-700' : isCompleted ? 'text-amaq-700' : 'text-slate-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-6 sm:w-12 md:w-16 h-0.5 mx-1 sm:mx-2 rounded-full transition-colors duration-300 flex-shrink-0 ${
                  currentStep > step.id ? 'bg-amaq-700 shadow-glow' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

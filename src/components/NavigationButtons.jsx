import React from 'react'
import { COLORS } from '../utils/constants'
import { ArrowLeftIcon, ArrowRightIcon } from './Icons'

export default function NavigationButtons({
  onPrev,
  onNext,
  onCalculate,
  showPrev = true,
  showNext = true,
  showCalculate = false,
  nextLabel = 'Siguiente',
  prevLabel = 'Anterior',
  disabledNext = false
}) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-navy-100">
      {showPrev ? (
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-navy-200 text-navy-600 font-medium hover:bg-navy-50 transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>{prevLabel}</span>
        </button>
      ) : (
        <div />
      )}

      <div className="flex gap-3">
        {showCalculate && (
          <button
            onClick={onCalculate}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg"
          >
            <span>Calcular ROI</span>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </button>
        )}
        {showNext && (
          <button
            onClick={onNext}
            disabled={disabledNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              disabledNext
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                : 'bg-amaq-brand text-white hover:bg-amaq-600 shadow-md'
            }`}
          >
            <span>{nextLabel}</span>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}

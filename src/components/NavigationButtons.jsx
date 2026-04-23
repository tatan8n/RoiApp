import React from 'react'
import { COLORS } from '../utils/constants'

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
          className="px-6 py-3 rounded-lg border-2 border-navy-200 text-navy-600 font-medium hover:bg-navy-50 transition-all"
        >
          ← {prevLabel}
        </button>
      ) : (
        <div />
      )}

      <div className="flex gap-3">
        {showCalculate && (
          <button
            onClick={onCalculate}
            className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg"
          >
            Calcular ROI →
          </button>
        )}
        {showNext && (
          <button
            onClick={onNext}
            disabled={disabledNext}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              disabledNext
                ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
                : 'bg-navy-600 text-white hover:bg-navy-700 shadow-lg'
            }`}
          >
            {nextLabel} →
          </button>
        )}
      </div>
    </div>
  )
}
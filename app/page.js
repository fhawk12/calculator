'use client'

import { useReducer } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import styles from './styles.module.css'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) return null
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATER.format(integer)
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}

export default function App() {
  function reducer(state, { type, payload }) {
    switch (type) {
      case ACTIONS.CLEAR: return {}

      case ACTIONS.ADD_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            currentOperand: payload.digit,
            overwrite: false
          }
        }

        // fix leading zero
        if (payload.digit === '0' && state.currentOperand === '0') return state

        // fix dot
        if (payload.digit === '.' && state.currentOperand == null)
          return {
            ...state,
            currentOperand: `0${payload.digit}`
          }
        if (payload.digit === '.' && state.currentOperand.includes('.')) return state

        return {
          ...state,
          currentOperand: `${state.currentOperand || ''}${payload.digit}`
        }

      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) return state
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }

        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }

        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }

      case ACTIONS.EVALUATE:
        if (
          state.currentOperand == null ||
          state.previousOperand == null ||
          state.operation == null
        ) {
          return state
        }

        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        }

      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
        if (state.currentOperand == null) return state
        if (state.currentOperand.length === 1) return {
          ...state,
          currentOperand: null
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
    }
  }

  function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const curr = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(curr)) return ''
    let computation = ''
    switch (operation) {
      case '+': computation = prev + curr; break 
      case '-': computation = prev - curr; break
      case '*': computation = prev * curr; break
      case '/': computation = prev / curr; break
    }

    return computation
  }

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )
  return (
    <>
      <div className={styles.grid}>
        <div className={styles.output}>
          <div className={styles.previousOperand}>
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className={styles.currentOperand}>{formatOperand(currentOperand)}</div>
        </div>
        <div
          className={`${styles.spanTwo} ${styles.button}`}
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </div>
        <div
          className={styles.button}
          onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}
        >
          DEL
        </div>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <div
          className={`${styles.spanTwo} ${styles.button}`}
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </div>
      </div>
    </>
  )
}

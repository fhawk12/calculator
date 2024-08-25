import { ACTIONS } from './page'
import styles from './styles.module.css'

export default function DigitButton({ dispatch, digit }) {
  return (
    <button
      className={styles.button}
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  )
}

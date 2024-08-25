import { ACTIONS } from './page'
import styles from './styles.module.css'

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      className={styles.button}
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  )
}

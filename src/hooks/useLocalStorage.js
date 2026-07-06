import { useState, useEffect, useCallback } from 'react'
import { readJSON, writeJSON } from '../utils/storageHelpers'

// Generic hook that syncs a piece of state with LocalStorage under `key`.
export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => readJSON(key, defaultValue))

  useEffect(() => {
    writeJSON(key, value)
  }, [key, value])

  const update = useCallback((updater) => {
    setValue((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  return [value, update]
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { readJSON, writeJSON } from '../utils/storageHelpers'

const TABLE = 'kegel_sync'

// Drop-in replacement for useLocalStorage that ALSO syncs to Supabase when
// the user is signed in. Local state + localStorage always stay authoritative
// for "what the UI shows right now" and for fully offline use; Supabase is an
// extra layer that mirrors that value to the user's account so other signed-in
// devices can pick it up.
export default function useCloudSync(key, defaultValue) {
  const { user } = useAuth()
  const [value, setValue] = useState(() => readJSON(key, defaultValue))

  // Prevents remote-triggered updates from immediately bouncing back to Supabase.
  const skipNextPush = useRef(false)
  const channelRef = useRef(null)
  const mountedKeyRef = useRef(key)

  // Always keep a local offline cache, regardless of auth state.
  useEffect(() => {
    writeJSON(key, value)
  }, [key, value])

  // Pull the remote copy on login (or when this hook's key changes), then
  // subscribe to realtime updates so a change made on the other device shows
  // up here without a manual refresh.
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    let cancelled = false

    async function pullAndSubscribe() {
      const { data, error } = await supabase
        .from(TABLE)
        .select('data_value, updated_at')
        .eq('user_id', user.id)
        .eq('data_key', key)
        .maybeSingle()

      if (cancelled) return

      if (!error && data) {
        skipNextPush.current = true
        setValue(data.data_value)
      } else if (!error && !data) {
        // Nothing in the cloud yet for this key — seed it with whatever we have locally.
        await supabase.from(TABLE).upsert(
          {
            user_id: user.id,
            data_key: key,
            data_value: value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,data_key' }
        )
      } else if (error) {
        console.error(`[kegel-trainer] Failed to pull "${key}" from Supabase:`, error)
      }

      channelRef.current = supabase
        .channel(`kegel_sync-${key}-${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: TABLE, filter: `user_id=eq.${user.id}` },
          (payload) => {
            const row = payload.new
            if (row && row.data_key === key) {
              skipNextPush.current = true
              setValue(row.data_value)
            }
          }
        )
        .subscribe()
    }

    pullAndSubscribe()

    return () => {
      cancelled = true
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, key])

  // Push local changes up to Supabase, debounced slightly so fast successive
  // updates (like a running timer) don't hammer the database.
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    if (mountedKeyRef.current !== key) {
      mountedKeyRef.current = key
    }
    if (skipNextPush.current) {
      skipNextPush.current = false
      return
    }

    const timeout = setTimeout(() => {
      supabase
        .from(TABLE)
        .upsert(
          {
            user_id: user.id,
            data_key: key,
            data_value: value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,data_key' }
        )
        .then(({ error }) => {
          if (error) console.error(`[kegel-trainer] Failed to sync "${key}" to Supabase:`, error)
        })
    }, 600)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, user, key])

  const update = useCallback((updater) => {
    setValue((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  return [value, update]
}

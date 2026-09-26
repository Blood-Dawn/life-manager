import { useCallback, useEffect, useMemo, useState } from 'react'
import { Home as HomeIcon, ShoppingCart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ErrorBanner from '../components/ui/ErrorBanner'
import Button from '../components/ui/Button'
import ChoreForm from '../components/house/ChoreForm'
import ChoreRow from '../components/house/ChoreRow'
import ZoneFilter from '../components/house/ZoneFilter'
import ShoppingForm from '../components/house/ShoppingForm'
import ShoppingRow from '../components/house/ShoppingRow'
import { snoozeDueDate } from '../lib/choreUtils'

export default function House() {
  const { user } = useAuth()
  const [tab, setTab] = useState('chores')

  const [chores, setChores] = useState([])
  const [choresLoading, setChoresLoading] = useState(true)
  const [choresLoadError, setChoresLoadError] = useState(null)
  const [choreFormError, setChoreFormError] = useState(null)
  const [choreListError, setChoreListError] = useState(null)
  const [editingChore, setEditingChore] = useState(null)
  const [zoneFilter, setZoneFilter] = useState(null)

  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [itemsLoadError, setItemsLoadError] = useState(null)
  const [itemFormError, setItemFormError] = useState(null)
  const [itemListError, setItemListError] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  const loadChores = useCallback(async () => {
    setChoresLoading(true)
    setChoresLoadError(null)
    const { data, error } = await supabase
      .from('chores')
      .select('*')
      .order('due_date', { ascending: true, nullsFirst: false })
    if (error) {
      setChoresLoadError(error.message)
    } else {
      setChores(data ?? [])
    }
    setChoresLoading(false)
  }, [])

  const loadItems = useCallback(async () => {
    setItemsLoading(true)
    setItemsLoadError(null)
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setItemsLoadError(error.message)
    } else {
      setItems(data ?? [])
    }
    setItemsLoading(false)
  }, [])

  useEffect(() => {
    loadChores()
  }, [loadChores])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const visibleChores = useMemo(
    () => (zoneFilter ? chores.filter((c) => c.zone === zoneFilter) : chores),
    [chores, zoneFilter],
  )

  const handleAddChore = async (values) => {
    setChoreFormError(null)
    const { data, error } = await supabase
      .from('chores')
      .insert({ ...values, user_id: user.id })
      .select()
      .single()
    if (error) {
      setChoreFormError(error.message)
      return false
    }
    setChores((prev) => [...prev, data])
    return true
  }

  const handleUpdateChore = async (values) => {
    setChoreFormError(null)
    const { data, error } = await supabase
      .from('chores')
      .update(values)
      .eq('id', editingChore.id)
      .select()
      .single()
    if (error) {
      setChoreFormError(error.message)
      return false
    }
    setChores((prev) => prev.map((c) => (c.id === data.id ? data : c)))
    setEditingChore(null)
    return true
  }

  const handleDeleteChore = async (chore) => {
    setChoreListError(null)
    const { error } = await supabase.from('chores').delete().eq('id', chore.id)
    if (error) {
      setChoreListError(error.message)
      return
    }
    setChores((prev) => prev.filter((c) => c.id !== chore.id))
  }

  const handleToggleDone = async (chore, isDone) => {
    setChoreListError(null)
    const { data, error } = await supabase
      .from('chores')
      .update({ is_done: isDone })
      .eq('id', chore.id)
      .select()
      .single()
    if (error) {
      setChoreListError(error.message)
      return
    }
    setChores((prev) => prev.map((c) => (c.id === data.id ? data : c)))
  }

  const handleSnooze = async (chore) => {
    setChoreListError(null)
    const nextDue = snoozeDueDate(chore.due_date, chore.frequency)
    const { data, error } = await supabase
      .from('chores')
      .update({ due_date: nextDue })
      .eq('id', chore.id)
      .select()
      .single()
    if (error) {
      setChoreListError(error.message)
      return
    }
    setChores((prev) => prev.map((c) => (c.id === data.id ? data : c)))
  }

  const handleAddItem = async (values) => {
    setItemFormError(null)
    const { data, error } = await supabase
      .from('shopping_items')
      .insert({ ...values, user_id: user.id })
      .select()
      .single()
    if (error) {
      setItemFormError(error.message)
      return false
    }
    setItems((prev) => [data, ...prev])
    return true
  }

  const handleUpdateItem = async (values) => {
    setItemFormError(null)
    const { data, error } = await supabase
      .from('shopping_items')
      .update(values)
      .eq('id', editingItem.id)
      .select()
      .single()
    if (error) {
      setItemFormError(error.message)
      return false
    }
    setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)))
    setEditingItem(null)
    return true
  }

  const handleDeleteItem = async (item) => {
    setItemListError(null)
    const { error } = await supabase.from('shopping_items').delete().eq('id', item.id)
    if (error) {
      setItemListError(error.message)
      return
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  const handleTogglePurchased = async (item, isPurchased) => {
    setItemListError(null)
    const { data, error } = await supabase
      .from('shopping_items')
      .update({ is_purchased: isPurchased })
      .eq('id', item.id)
      .select()
      .single()
    if (error) {
      setItemListError(error.message)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)))
  }

  const handleClearPurchased = async () => {
    setItemListError(null)
    const purchasedIds = items.filter((i) => i.is_purchased).map((i) => i.id)
    if (purchasedIds.length === 0) return
    const { error } = await supabase.from('shopping_items').delete().in('id', purchasedIds)
    if (error) {
      setItemListError(error.message)
      return
    }
    setItems((prev) => prev.filter((i) => !i.is_purchased))
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">House</h1>

      <div className="flex gap-2 rounded-xl bg-surface p-1">
        <button
          onClick={() => setTab('chores')}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${
            tab === 'chores' ? 'bg-accent text-white' : 'text-text-muted'
          }`}
        >
          Chores
        </button>
        <button
          onClick={() => setTab('shopping')}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${
            tab === 'shopping' ? 'bg-accent text-white' : 'text-text-muted'
          }`}
        >
          Shopping
        </button>
      </div>

      {tab === 'chores' ? (
        <>
          <Card>
            <h2 className="mb-3 text-sm font-semibold">{editingChore ? 'Edit chore' : 'Add chore'}</h2>
            <ErrorBanner message={choreFormError} />
            <ChoreForm
              key={editingChore?.id ?? 'new'}
              initial={editingChore}
              onSubmit={editingChore ? handleUpdateChore : handleAddChore}
              onCancel={() => {
                setEditingChore(null)
                setChoreFormError(null)
              }}
            />
          </Card>

          <ZoneFilter value={zoneFilter} onChange={setZoneFilter} />

          <ErrorBanner message={choreListError} />

          {choresLoading ? (
            <p className="text-sm text-text-muted">Loading chores…</p>
          ) : choresLoadError ? (
            <ErrorBanner message={`Couldn't load your chores: ${choresLoadError}`} onRetry={loadChores} />
          ) : visibleChores.length === 0 ? (
            <EmptyState
              icon={HomeIcon}
              title="No chores yet"
              hint="Add a chore with a due date to keep the house running."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
              {visibleChores.map((chore) => (
                <ChoreRow
                  key={chore.id}
                  chore={chore}
                  onToggleDone={(checked) => handleToggleDone(chore, checked)}
                  onSnooze={() => handleSnooze(chore)}
                  onEdit={setEditingChore}
                  onDelete={handleDeleteChore}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <Card>
            <h2 className="mb-3 text-sm font-semibold">{editingItem ? 'Edit item' : 'Add item'}</h2>
            <ErrorBanner message={itemFormError} />
            <ShoppingForm
              key={editingItem?.id ?? 'new'}
              initial={editingItem}
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setEditingItem(null)
                setItemFormError(null)
              }}
            />
          </Card>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={handleClearPurchased}>
              Clear purchased
            </Button>
          </div>

          <ErrorBanner message={itemListError} />

          {itemsLoading ? (
            <p className="text-sm text-text-muted">Loading shopping list…</p>
          ) : itemsLoadError ? (
            <ErrorBanner message={`Couldn't load your shopping list: ${itemsLoadError}`} onRetry={loadItems} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Shopping list is empty"
              hint="Add an item to start your list."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
              {items.map((item) => (
                <ShoppingRow
                  key={item.id}
                  item={item}
                  onTogglePurchased={(checked) => handleTogglePurchased(item, checked)}
                  onEdit={setEditingItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

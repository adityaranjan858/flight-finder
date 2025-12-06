import React, { useState, useEffect } from 'react'
import { MapPin, CalendarDays, User } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setFilters, clearFilters } from '../../store/flightsSlice'

// function minutesToTime(min) {
//   if (min == null || typeof min !== 'number') return ''
//   const h = Math.floor(min / 60)
//   const m = Math.floor(min % 60)
//   return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
// }

function formatDateLabel(d) {
  if (!d) return ''
  // expect ISO-like YYYY-MM-DD
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) {
    const y = m[1], mm = m[2], dd = m[3]
    return `${dd}-${mm}-${y}`
  }
  // fallback: return original
  return d
}

const Filter = () => {
  const dispatch = useDispatch()
  const { filters, filterMeta } = useSelector(s => s.flights)
  const origins = (filterMeta && filterMeta.origins) || []
  const destinations = (filterMeta && filterMeta.destinations) || []
  const dates = (filterMeta && filterMeta.dates) || []
  const airportNames = (filterMeta && filterMeta.airportNames) || {}

  // local UI state — apply filters on From/To change; date only shows overlay
  const [localOrigin, setLocalOrigin] = useState(filters.origin || '')
  const [localDestination, setLocalDestination] = useState(filters.destination || '')
  const [localDate, setLocalDate] = useState(filters.date || '')
  const [searchError, setSearchError] = useState('')
  const [localTripType, setLocalTripType] = useState(filters.tripType || 'oneway')
  const [localAdults, setLocalAdults] = useState(filters.adults || 1)
  const [localReturnDate, setLocalReturnDate] = useState(filters.returnDate || '')
  const [showDateOverlay, setShowDateOverlay] = useState(false)

  // dispatch filters automatically when origin and destination are both selected
  useEffect(() => {
    if (localOrigin && localDestination) {
      dispatch(setFilters({ origin: localOrigin, destination: localDestination }))
    } else {
      // clear store filters when not both selected
      dispatch(setFilters({ origin: '', destination: '' }))
    }
  }, [localOrigin, localDestination, dispatch])

  function onClear() {
    setLocalOrigin('')
    setLocalDestination('')
    setLocalDate('')
    setSearchError('')
    setLocalTripType('oneway')
    setLocalAdults(1)
    setLocalReturnDate('')
    dispatch(clearFilters())
  }

function onSearch() {
  setSearchError('')
  // Search button is optional now — if origin/destination present we already dispatch.
  if (!localOrigin || !localDestination) {
    setSearchError('Please select From and To before searching.')
    return
  }
  // Check if From and To are the same
  if (localOrigin === localDestination) {
    setSearchError('From and To cannot be the same.')
    return
  }
  // Keep behavior consistent: dispatch current origin/destination (date is intentionally ignored for filtering)
  dispatch(setFilters({ origin: localOrigin, destination: localDestination }))
}

  

  return (
    <>
      <div className="w-full bg-white flex justify-center flex-col">
        <div className="max-w-7xl mx-auto py-4 px-6 flex items-center gap-3 flex-wrap">
          <div className="flex items-center border rounded-md px-3 py-2 w-48 gap-2">
            <MapPin size={18} className="text-gray-600" />
            <select value={localOrigin} onChange={e => setLocalOrigin(e.target.value)} className="text-sm bg-transparent outline-none">
              <option value="">From</option>
              {origins.map(o => {
                const label = airportNames[o] ? `${airportNames[o]} (${o})` : o
                return <option key={o} value={o}>{label}</option>
              })}
            </select>
          </div>

          <div className="text-gray-500 text-lg">↔</div>

          <div className="flex items-center border rounded-md px-3 py-2 w-48 gap-2">
            <MapPin size={18} className="text-gray-600" />
            <select value={localDestination} onChange={e => setLocalDestination(e.target.value)} className="text-sm bg-transparent outline-none">
              <option value="">To</option>
              {destinations.map(d => {
                const label = airportNames[d] ? `${airportNames[d]} (${d})` : d
                return <option key={d} value={d}>{label}</option>
              })}
            </select>
          </div>

          <div className="flex items-center border rounded-md px-3 py-2 w-40 gap-2">
  <CalendarDays size={16} className="text-gray-600" />

  <input
    type="date"
    value={localDate || ""}
    onChange={(e) => {
      setLocalDate(e.target.value);
      setShowDateOverlay(false); // since now no overlay needed
    }}
    className="text-sm bg-transparent outline-none w-full cursor-pointer"
  />
</div>


          <div className="flex items-center border rounded-md px-3 py-2 w-32 text-sm">
            <select value={localTripType} onChange={e => setLocalTripType(e.target.value)} className="bg-transparent outline-none">
              <option value="oneway">One way</option>
              <option value="round">Round trip</option>
            </select>
          </div>

          <div className="flex items-center border rounded-md px-3 py-2 w-28 gap-2">
            <User size={16} className="text-gray-600" />
            <input type="number" min={1} value={localAdults} onChange={e => setLocalAdults(Number(e.target.value) || 1)} className="w-16 text-sm bg-transparent outline-none" />
          </div>

          {localTripType === 'round' && (
            <div className="flex items-center border rounded-md px-3 py-2 w-40 gap-2">
              <CalendarDays size={16} className="text-gray-600" />
              <select value={localReturnDate || ''} onChange={e => setLocalReturnDate(e.target.value)} className="text-sm bg-transparent outline-none">
                <option value="">Return date</option>
                {dates.map(d => <option key={d} value={d}>{formatDateLabel(d)}</option>)}
              </select>
            </div>
          )}

          <button onClick={onSearch} className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700">Search</button>
          <button onClick={onClear} className="bg-teal-500 text-white px-5 py-2 rounded-md hover:bg-teal-600">Clear</button>
        </div>

        {searchError && (
          <div className="max-w-7xl mx-auto px-6 pt-2 text-sm text-red-600">{searchError}</div>
        )}

      {/* date overlay: when user explicitly selects a date we show a full-screen message (date selection does not change filtering) */}
      {showDateOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
            <h3 className="text-lg font-semibold mb-2">No flights available at this date</h3>
            <p className="text-sm text-gray-700">You selected <strong>{formatDateLabel(localDate)}</strong>. Flight list is shown based on From and To only. Date selection does not filter results here.</p>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => { setShowDateOverlay(false); setLocalDate('') }} className="px-4 py-2 bg-indigo-600 text-white rounded">OK</button>
            </div>
          </div>
        </div>
      )}

        <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center gap-6 text-xs text-gray-600">
          <span className="font-semibold border-b cursor-pointer">Regular / Multi-City</span>
          <span>Class: <strong>Economy</strong></span>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" />Non-stop flights only</label>
          <span className="cursor-pointer">Recent searches</span>
        </div>
       
      </div>
    </>
  )
}

export default Filter

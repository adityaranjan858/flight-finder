import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Fetch flights from public/data/flights.json
export const fetchFlights = createAsyncThunk('flights/fetch', async () => {
  const res = await fetch('/data/flights.json')
  const json = await res.json()

  // helper: find array named 'j' or array of flight-like objects in the JSON
  function findJArray(obj) {
    if (!obj || typeof obj !== 'object') return null
    if (Array.isArray(obj)) {
      // check if this array looks like flight entries
      if (obj.length && obj[0] && (obj[0].dt || obj[0].farepr || obj[0].ap)) return obj
    }
    for (const k of Object.keys(obj)) {
      if (k === 'j' && Array.isArray(obj[k])) return obj[k]
      const v = obj[k]
      const found = findJArray(v)
      if (found) return found
    }
    return null
  }

  const jArray = findJArray(json) || []

 const flights = jArray.map((f, idx) => {
  // extract from (origin) using your defined path
  const frArr =
  Array.isArray(f?.leg?.[0]?.flights)
    ? [...new Set(f.leg[0].flights.map(ff => ff?.fr).filter(Boolean))]
    : [];

const fr = frArr.length > 0
  ? frArr          // <<< store array, NOT string
  : f.fr
    ? [f.fr]
    : Array.isArray(f.ap)
      ? [f.ap[0]]
      : [];



  // extract to (destination) using your defined path
  const to =
    f?.leg?.[0]?.flights?.[0]?.to ||
    f.to ||
    (Array.isArray(f.ap) ? f.ap[f.ap.length - 1] : undefined)

  const dt =
    f?.leg?.[0]?.flights?.[0]?.dt ||
    f.dt ||
    ""

  const at =
    f?.leg?.[0]?.flights?.[0]?.at ||
    f.at ||
    ""

  const ftVal = f?.leg?.[0]?.flights?.[0]?.ft || f.ft || 0
  const ft = `${Math.floor(ftVal / 3600)}h ${Math.floor((ftVal % 3600) / 60)}m`

  const date =
    f?.leg?.[0]?.flights?.[0]?.dd ||
    f.dd ||
    f.ad ||
    ""

  const seats =
    Number(f?.leg?.[0]?.flights?.[0]?.seats) ||
    Number(f.seats) ||
    0

  const al =
    f?.leg?.[0]?.flights?.[0]?.al ||
    f?.al?.[0] ||
    ""

  const farepr = Number(
    f.farepr ||
    f?.fare?.gross_fare?.value ||
    0
  )

  return {
    id: idx,
    fr,
    to,
    dt,
    at,
    ft,
    al,
    date,
    seats,
    farepr,
    raw: f,
  }
})


  const prices = flights.map(f => f.farepr)
  const min = prices.length ? Math.min(...prices) : 0
  const max = prices.length ? Math.max(...prices) : 0

  // build filter metadata (origins, destinations, dates, time/duration ranges)
  const originsSet = new Set()
  const destinationsSet = new Set()
  const airportNames = {} // map code -> city name when available
  const datesSet = new Set()
  const departTimes = []
  const arriveTimes = []
  const durations = []

  function toYear(d) {
    try {
      const y = new Date(d).getFullYear()
      return Number.isFinite(y) ? y : null
    } catch { return null }
  }

  flights.forEach(f => {
    // include all origin codes found in legs (f.fr may be array)
    if (Array.isArray(f.fr)) {
      f.fr.forEach(code => originsSet.add(code));
    } else if (f.fr) {
      originsSet.add(String(f.fr));
    }

    // include destination codes and any intermediate airport codes found inside raw data
    if (f.to) destinationsSet.add(String(f.to))
    // scan raw object for leg flights to collect airport codes and names
    try {
      const raw = f.raw || {}
      if (Array.isArray(raw.ap)) {
        raw.ap.forEach(code => {
          if (code) destinationsSet.add(code); // ensure ap entries are included
        })
      }
      if (Array.isArray(raw.leg)) {
        raw.leg.forEach(legObj => {
          if (Array.isArray(legObj.all_ap) && Array.isArray(legObj.ttl)) {
            // if lengths match, map each code to corresponding ttl name
            if (legObj.all_ap.length === legObj.ttl.length) {
              legObj.all_ap.forEach((code, i) => {
                if (code && legObj.ttl[i]) airportNames[code] = legObj.ttl[i]
                originsSet.add(code)
                destinationsSet.add(code)
              })
            } else {
              // fallback: map first->first and last->last
              const first = legObj.all_ap[0]
              const last = legObj.all_ap[legObj.all_ap.length - 1]
              if (first && legObj.ttl[0]) airportNames[first] = legObj.ttl[0]
              if (last && legObj.ttl[legObj.ttl.length - 1]) airportNames[last] = legObj.ttl[legObj.ttl.length - 1]
              if (first) originsSet.add(first)
              if (last) destinationsSet.add(last)
            }
          }

          if (Array.isArray(legObj.flights)) {
            legObj.flights.forEach(ff => {
              if (ff.fr) originsSet.add(ff.fr)
              if (ff.to) destinationsSet.add(ff.to)
            })
          }
        })
      }
    } catch {
      // ignore any unexpected structure while extracting airport names
    }
    if (f.date && toYear(f.date) === 2021) datesSet.add(String(f.date))
    const dtMin = parseTime(f.dt)
    if (dtMin || dtMin === 0) departTimes.push(dtMin)
    const atMin = parseTime(f.at)
    if (atMin || atMin === 0) arriveTimes.push(atMin)
    const dur = parseDuration(f.ft)
    if (dur || dur === 0) durations.push(dur)
  })

  const filterMeta = {
    origins: Array.from(originsSet).sort(),
    destinations: Array.from(destinationsSet).sort(),
    dates: Array.from(datesSet).sort(),
    airportNames,
    priceRange: { min, max },
    departRange: { min: departTimes.length ? Math.min(...departTimes) : 0, max: departTimes.length ? Math.max(...departTimes) : 24 * 60 - 1 },
    arriveRange: { min: arriveTimes.length ? Math.min(...arriveTimes) : 0, max: arriveTimes.length ? Math.max(...arriveTimes) : 24 * 60 - 1 },
    durationRange: { min: durations.length ? Math.min(...durations) : 0, max: durations.length ? Math.max(...durations) : 0 }
  }

  return { flights, priceRange: { min, max }, meta: json.f || {}, filterMeta }
})


const flightsSlice = createSlice({
  name: 'flights',
  initialState: {
    all: [],
    filtered: [],
    status: 'idle',
    error: null,
    sortKey: 'price_low', // default Price low to high
    priceRange: { min: 0, max: 0 },
    originalPriceRange: { min: 0, max: 0 },
    filterMeta: { origins: [], destinations: [], dates: [], priceRange: { min: 0, max: 0 }, departRange: { min:0, max:0 }, arriveRange: { min:0, max:0 }, durationRange: { min:0, max:0 } },
    // filter criteria
    filters: {
      origin: '',
      destination: '',
      date: '',
      search: false,
      returnDate: '',
      tripType: 'oneway', // 'oneway' or 'round'
      adults: 1,
    }
  },
  reducers: {
    setSort(state, action) {
      state.sortKey = action.payload
      // apply sort
      state.filtered = sortFlights(state.filtered, state.sortKey)
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload
      state.filtered = applyFilters(state.all, state)
      state.filtered = sortFlights(state.filtered, state.sortKey)
    },
    // set multiple filter criteria at once
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
      state.filtered = applyFilters(state.all, state)
      state.filtered = sortFlights(state.filtered, state.sortKey)
    },
    clearFilters(state) {
      state.priceRange = { ...state.originalPriceRange }
      state.sortKey = 'price_low'
      state.filters = { origin: '', destination: '', date: '', search: false, tripType: 'oneway', adults: 1 }
      state.filtered = sortFlights(state.all.slice(), state.sortKey)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.all = action.payload.flights
        state.originalPriceRange = { ...action.payload.priceRange }
        state.priceRange = { ...action.payload.priceRange }
        state.filterMeta = action.payload.filterMeta || { origins: [], destinations: [], dates: [], priceRange: { min: 0, max: 0 } }
        state.filtered = sortFlights(applyFilters(state.all, state), state.sortKey)
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

function applyFilters(all, state) {
  const { priceRange, filters } = state

  // require origin and destination to be selected to show flights (date and search flag ignored)
  if (!filters || !filters.origin || !filters.destination) return []

  return all.filter(f => {
    if (typeof f.farepr !== 'number') return false
    if (f.farepr < priceRange.min || f.farepr > priceRange.max) return false

    // origin can be an array (multiple fr entries) or a single string
    if (filters.origin) {
      if (Array.isArray(f.fr)) {
        if (!f.fr.includes(filters.origin)) return false
      } else if (f.fr && String(f.fr).toLowerCase() !== String(filters.origin).toLowerCase()) {
        return false
      }
    }

    // destination may be an endpoint or an intermediate stop — check several places
    if (filters.destination) {
      const dest = String(filters.destination).toLowerCase()
      let found = false
      if (f.to && String(f.to).toLowerCase() === dest) found = true
      if (!found && Array.isArray(f.fr) && f.fr.map(x => String(x).toLowerCase()).includes(dest)) found = true
      if (!found && f.raw && Array.isArray(f.raw.ap) && f.raw.ap.map(x => String(x).toLowerCase()).includes(dest)) found = true
      if (!found && f.raw && Array.isArray(f.raw.leg)) {
        for (const legObj of f.raw.leg) {
          if (Array.isArray(legObj.flights)) {
            for (const ff of legObj.flights) {
              if ((ff.fr && String(ff.fr).toLowerCase() === dest) || (ff.to && String(ff.to).toLowerCase() === dest)) {
                found = true; break
              }
            }
          }
          if (found) break
        }
      }
      if (!found) return false
    }
    // Note: intentionally ignoring date filter here — flights are shown based on From and To only
    return true
  })
}

function sortFlights(list, sortKey) {
  const arr = list.slice()
  switch (sortKey) {
    case 'price_low':
      return arr.sort((a,b) => a.farepr - b.farepr)
    case 'price_high':
      return arr.sort((a,b) => b.farepr - a.farepr)
    case 'airline_asc':
      return arr.sort((a,b) => String((a.al||'')).localeCompare(String(b.al||'')))
    case 'airline_desc':
      return arr.sort((a,b) => String((b.al||'')).localeCompare(String(a.al||'')))
    case 'depart_latest':
      return arr.sort((a,b) => parseTime(b.dt) - parseTime(a.dt))
    case 'arrive_latest':
      return arr.sort((a,b) => parseTime(b.at) - parseTime(a.at))
    case 'duration_short':
      // attempt to parse duration '6h 35m' to minutes
      return arr.sort((a,b) => parseDuration(a.ft) - parseDuration(b.ft))
    case 'duration_long':
      return arr.sort((a,b) => parseDuration(b.ft) - parseDuration(a.ft))
    case 'smart':
      // heuristic: fare per minute (lower is better) then shorter duration
      return arr.sort((a,b) => {
        const aMin = parseDuration(a.ft) || 1
        const bMin = parseDuration(b.ft) || 1
        const aScore = (Number(a.farepr) || 0) / aMin
        const bScore = (Number(b.farepr) || 0) / bMin
        if (aScore === bScore) return aMin - bMin
        return aScore - bScore
      })
    case 'depart_earliest':
      return arr.sort((a,b) => parseTime(a.dt) - parseTime(b.dt))
    case 'arrive_earliest':
      return arr.sort((a,b) => parseTime(a.at) - parseTime(b.at))
    default:
      return arr
  }
}

function parseDuration(s) {
  if (!s) return 0
  const h = (s.match(/(\d+)h/) || [0,0])[1]
  const m = (s.match(/(\d+)m/) || [0,0])[1]
  return Number(h || 0) * 60 + Number(m || 0)
}

function parseTime(t) {
  // expect HH:MM or H:MM
  if (!t) return 0
  const parts = t.split(':')
  const hh = Number(parts[0] || 0)
  const mm = Number(parts[1] || 0)
  return hh * 60 + mm
}

export const { setSort, setPriceRange, setFilters, clearFilters } = flightsSlice.actions

export default flightsSlice.reducer

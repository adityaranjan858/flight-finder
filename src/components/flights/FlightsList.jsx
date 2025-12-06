import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import FlightCard from '../flightcard/FlightCard'

// 🔥 UNIVERSAL AIRLINE LOGO URL MAKER
const getAirlineLogo = (code) => {
  if (!code) return "https://via.placeholder.com/40";
  return `https://d2mccptxtk231d.cloudfront.net/1.0.1848/resources/assets/scss/skin/img/airline-master/${String(code).toUpperCase()}.png`;
};

export default function FlightsList() {
  const { filtered, all, status, error, filters } = useSelector(s => s.flights)

  const roundPairs = useMemo(() => {
    if (filters.tripType !== 'round' || !filters.date || !filters.returnDate) return []

    const outbound = all.filter(f => {
      if (filters.origin && f.fr && String(f.fr).toLowerCase() !== String(filters.origin).toLowerCase()) return false
      if (filters.destination && f.to && String(f.to).toLowerCase() !== String(filters.destination).toLowerCase()) return false
      if (f.date && String(f.date) !== String(filters.date)) return false
      if (filters.adults && f.seats && Number(f.seats) < Number(filters.adults)) return false
      return true
    })

    const inbound = all.filter(f => {
      if (filters.origin && f.to && String(f.to).toLowerCase() !== String(filters.origin).toLowerCase()) return false
      if (filters.destination && f.fr && String(f.fr).toLowerCase() !== String(filters.destination).toLowerCase()) return false
      if (f.date && String(f.date) !== String(filters.returnDate)) return false
      if (filters.adults && f.seats && Number(f.seats) < Number(filters.adults)) return false
      return true
    })

    const pairs = []
    outbound.forEach(o => {
      inbound.forEach(i => {
        pairs.push({
          outbound: o,
          inbound: i,
          totalFare: (Number(o.farepr) || 0) + (Number(i.farepr) || 0)
        })
      })
    })

    pairs.sort((a,b) => a.totalFare - b.totalFare)
    return pairs
  }, [all, filters])


  if (status === 'loading') return <div>Loading flights...</div>
  if (status === 'failed') return <div className="text-red-600">Error: {error}</div>

  // ROUND TRIP
  if (filters.tripType === 'round') {
    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-600 mb-2">{roundPairs.length} round-trip options</div>

        {roundPairs.map((p, idx) => (
          <div key={idx} className="bg-white p-3 rounded shadow-sm">
            <div className="flex items-start gap-4">
              
              <div className="flex-1">
                {/* OUTBOUND */}
                <FlightCard
                  airlineName={p.outbound.al}
                  airlineLogo={getAirlineLogo(p.outbound.al)}
                  departureTime={p.outbound.dt}
                  arrivalTime={p.outbound.at}
                  source={`${p.outbound.fr} → ${p.outbound.to}`}
                  stops={0}
                  duration={p.outbound.ft}
                  price={p.outbound.farepr}
                  onBook={() => alert(`Booked outbound ${p.outbound.id}`)}
                />

                <div className="my-2" />

                {/* INBOUND */}
                <FlightCard
                  airlineName={p.inbound.al}
                  airlineLogo={getAirlineLogo(p.inbound.al)}
                  departureTime={p.inbound.dt}
                  arrivalTime={p.inbound.at}
                  source={`${p.inbound.fr} → ${p.inbound.to}`}
                  stops={0}
                  duration={p.inbound.ft}
                  price={p.inbound.farepr}
                  onBook={() => alert(`Booked inbound ${p.inbound.id}`)}
                />
              </div>

              <div className="w-40 text-right flex flex-col items-end gap-3">
                <div className="text-xl font-semibold">
                  ₹ {p.totalFare.toLocaleString()}
                </div>
                <button
                  className="border border-teal-500 text-teal-500 px-4 py-1 rounded-md hover:bg-teal-500 hover:text-white"
                  onClick={() => alert('Book round-trip')}
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ONE-WAY
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-2">{filtered.length} flights</div>
      
      {filtered.map(f => (
        <FlightCard
          key={f.id}
          airlineName={f.al}
          airlineLogo={getAirlineLogo(f.al)}
          departureTime={f.dt}
          arrivalTime={f.at}
          source={`${f.fr} → ${f.to}`}
          stops={0}
          duration={f.ft}
          price={f.farepr}
          onBook={() => alert(`Booked flight ${f.id}`)}
        />
      ))}
    </div>
  )
}

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSort } from '../../store/flightsSlice'
import { ChevronUp, ChevronDown } from "lucide-react";

export default function SortBar() {
  const dispatch = useDispatch()
  const sortKey = useSelector(s => s.flights.sortKey)

  // toggle helpers: determine new sort key when a header is clicked
  const toggle = (ascKey, descKey) => {
    if (sortKey === ascKey) return descKey
    return ascKey
  }

  const renderIcon = (ascKey, descKey) => {
    // active: show direction icon; inactive: show on hover only
    if (sortKey === ascKey) return <ChevronUp size={14} className="text-teal-700 opacity-100" />
    if (sortKey === descKey) return <ChevronDown size={14} className="text-teal-700 opacity-100" />
    return <ChevronUp size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
  }

  return (
    <div className="w-full bg-teal-50 rounded-xl py-3 px-4 mb-2 flex flex-wrap items-center justify-between gap-3">

      <button onClick={() => dispatch(setSort(toggle('airline_asc','airline_desc')))} className="w-full md:w-40 group flex items-center gap-2 font-semibold text-teal-700 cursor-pointer ">
        <span>Airline</span>
        {renderIcon('airline_asc','airline_desc')}
      </button>

      <button
        onClick={() => dispatch(setSort(toggle('depart_earliest','depart_latest')))}
        className="w-auto md:w-24 group text-center font-semibold text-teal-700 flex items-center cursor-pointer justify-center gap-1"
      >
        <span>Depart</span>
        {renderIcon('depart_earliest','depart_latest')}
      </button>

      <div className="hidden md:block w-6" /> {/* plane icon column spacer to align with FlightCard; hidden on small screens */}

      <button onClick={() => dispatch(setSort(toggle('arrive_earliest','arrive_latest')))} className="w-auto md:w-24 group text-center font-semibold text-teal-700 flex items-center justify-center gap-1 cursor-pointer">
        <span>Arrive</span>
        {renderIcon('arrive_earliest','arrive_latest')}
      </button>

      <button onClick={() => dispatch(setSort(toggle('duration_short','duration_long')))} className="w-auto md:w-28 group text-center font-semibold text-teal-700 flex items-center justify-center gap-1 cursor-pointer">
        <span>Duration</span>
        {renderIcon('duration_short','duration_long')}
      </button>

      <button onClick={() => dispatch(setSort('smart'))} className="w-auto md:w-28 group text-center font-semibold text-teal-700 flex items-center justify-center gap-1 cursor-pointer">
        <span>Smart</span>
        {sortKey === 'smart' ? <ChevronUp size={14} className="text-teal-700 opacity-100" /> : <ChevronUp size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
      </button>

      <button
        onClick={() => dispatch(setSort(toggle('price_low','price_high')))}
        className="w-auto md:w-32 group text-right font-semibold text-teal-700 flex items-center justify-end gap-2 cursor-pointer" 
      >
        <span>Price</span>
        {renderIcon('price_low','price_high')}
      </button>

      <div className="hidden md:block w-20"></div> {/* Book button spacing (hidden on small screens) */}
    </div>
  )
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange, clearFilters } from "../../store/flightsSlice";

export default function PriceFilter() {
  const dispatch = useDispatch();
  const { priceRange, originalPriceRange, status, filters } = useSelector((s) => s.flights);

  // enabled only when flights fetched AND origin+destination are selected
  const enabled = status === 'succeeded' && filters && filters.origin && filters.destination
  const disabled = !enabled

  // when disabled show 0..0 initially, then switch to actual range after enabled
  const sliderMin = enabled ? (originalPriceRange?.min ?? 0) : 0
  const sliderMax = enabled ? (originalPriceRange?.max ?? 0) : 0

  const [minValue, setMinValue] = useState(priceRange?.min ?? 0);
  const [maxValue, setMaxValue] = useState(priceRange?.max ?? 0);

  // values shown on the inputs and labels — when disabled show 0 to avoid confusing users
  const displayMin = disabled ? 0 : minValue
  const displayMax = disabled ? 0 : maxValue

  useEffect(() => {
  setMinValue(priceRange.min)
  setMaxValue(priceRange.max)
}, [priceRange.min, priceRange.max])


  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    const gap = 1; // minimum gap between min and max
    if (val <= maxValue - gap) {
      setMinValue(val);
    } else {
      setMinValue(Math.max(sliderMin, maxValue - gap));
    }
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    const gap = 1;
    if (val >= minValue + gap) {
      setMaxValue(val);
    } else {
      setMaxValue(Math.min(sliderMax, minValue + gap));
    }
  };

  const applyRange = () => {
    dispatch(setPriceRange({ min: minValue, max: maxValue }));
  };

  const resetRange = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="bg-white p-4 rounded-md border min-h-48">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Price</h3>
        <button
          onClick={resetRange}
          className="text-teal-500 text-sm font-medium"
        >
          Clear filters
        </button>
      </div>

      {/* Range Slider */}
      <div className="relative px-2 py-4">
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={1}
          value={displayMin}
          onChange={handleMinChange}
          disabled={disabled}
          className={`absolute w-full ${disabled ? 'pointer-events-none opacity-50' : 'pointer-events-auto'} h-1 appearance-none`}
          style={{ zIndex: 3 }}
        />

        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={1}
          value={displayMax}
          onChange={handleMaxChange}
          disabled={disabled}
          className={`absolute w-full ${disabled ? 'pointer-events-none opacity-50' : 'pointer-events-auto'} h-1 appearance-none`}
          style={{ zIndex: 4 }}
        />

        {/* Slider track highlight */}
        <div className="h-1 bg-gray-300 rounded-full"></div>
        <div
          className="h-1 bg-teal-500 absolute rounded-full top-1/2 transform -translate-y-1/2"
          style={{
            left: `${((displayMin - sliderMin) / ( (sliderMax - sliderMin) || 1)) * 100}%`,
              right: `${100 - ((displayMax - sliderMin) / ((sliderMax - sliderMin) || 1)) * 100}%`,
          }}
        ></div>
      </div>

      {/* Min / Max Prices Display (hidden until enabled) */}
      {enabled ? (
        <div className="flex justify-between text-sm font-medium text-gray-700 mt-2">
          <span>₹ {displayMin?.toLocaleString?.() ?? '0'}</span>
          <span>₹ {displayMax?.toLocaleString?.() ?? '0'}</span>
        </div>
      ) : (
        // spacer to avoid layout jump when labels appear
        <div className="mt-2" style={{height: '1.25rem'}} />
      )}

      {status !== 'succeeded' && (
        <div className="text-xs text-gray-500 mt-2">Price filter will be available after flights are loaded.</div>
      )}
      {status === 'succeeded' && (!filters?.origin || !filters?.destination) && (
        <div className="text-xs text-gray-500 mt-2">Select origin and destination to enable price filter.</div>
      )}

      {/* Apply Button */}
      <button
        onClick={applyRange}
        disabled={disabled}
        className={`mt-4 w-full py-2 rounded-md ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-teal-500 text-white'}`}
      >
        Apply
      </button>
    </div>
  );
}

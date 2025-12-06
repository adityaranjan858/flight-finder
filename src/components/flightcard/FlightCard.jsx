import { PlaneTakeoff, PlaneLanding, X } from "lucide-react";

export default function FlightCard({
  airlineName,
  airlineLogo,
  departureTime,
  arrivalTime,
  source,
  stops,
  duration,
  price,
  onBook,
}) {
  return (
    <div className="w-full bg-white px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b last:border-none">

      {/* Airline */}
      <div className="flex items-center gap-3 w-full md:w-40">
        <img
          src={airlineLogo}
          alt={"Logo"}
          className="w-10 h-10 object-contain"
        />
        <span className="font-medium text-sm truncate">{airlineName}</span>
      </div>

      {/* Main info: depart / arrive / duration / extras */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-1 w-full justify-between">

        <div className="flex items-center gap-3 flex-wrap">
          {/* Depart */}
          <div className="text-center w-16">
            <p className="font-semibold text-lg">{departureTime}</p>
            <p className="text-xs text-gray-500">{String(source).slice(0, 3)}</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:block w-6 text-center text-gray-400">
            <PlaneTakeoff size={18} />
          </div>

          {/* Arrive */}
          <div className="text-center w-16">
            <p className="font-semibold text-lg">{arrivalTime}</p>
            <p className="text-xs text-gray-500">{String(source).split('→').pop().trim()}</p>
          </div>

          {/* Duration */}
          <div className="text-center w-20">
            <p className="font-semibold text-sm">{duration}</p>
            <p className="text-xs text-gray-500">{stops > 0 ? `${stops} Stop` : 'Non-stop'}</p>
          </div>

          {/* Smart icons (hidden on small) */}
          <div className="hidden md:flex w-28 items-center gap-3 text-gray-500 text-lg">
            <PlaneTakeoff className="opacity-70" />
            <PlaneLanding className="opacity-70" />
            <X className="opacity-70" size={16} />
          </div>
        </div>

        {/* Price + Book (desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <div className="text-right w-28 md:w-32">
            <p className="font-semibold text-xl text-gray-800">
              ₹ {typeof price === 'number' ? price.toLocaleString() : price}
            </p>
          </div>

          <div className="w-full md:w-20 flex justify-end">
            <button
              onClick={onBook}
              className="border border-teal-500 text-teal-500 px-4 py-1 rounded-md hover:bg-teal-500 hover:text-white transition text-sm"
            >
              Book
            </button>
          </div>
        </div>

        {/* Mobile price/book row: price on left, book button on right */}
        <div className="flex md:hidden items-center justify-between w-full mt-2">
          <div>
            <p className="font-semibold text-lg text-gray-800">₹ {typeof price === 'number' ? price.toLocaleString() : price}</p>
          </div>
          <div>
            <button
              onClick={onBook}
              className="border border-teal-500 text-teal-500 px-4 py-1 rounded-md hover:bg-teal-500 hover:text-white transition text-sm"
            >
              Book
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

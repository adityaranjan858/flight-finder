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
    <div className="w-full bg-white px-4 py-4 flex items-center justify-between gap-6 border-b last:border-none">

      {/* Airline */}
      <div className="flex items-center gap-3 w-24 md:w-40">
        <img
          src={airlineLogo}
          alt={"Logo"}
          className="w-10 h-10 object-contain"
        />
        <span className="font-medium text-sm">{airlineName}</span>
      </div>

      {/* Depart */}
      <div className="text-center w-20 md:w-24">
        <p className="font-semibold text-lg">{departureTime}</p>
        <p className="text-xs text-gray-500">{source.slice(0, 3)}</p>
      </div>

      {/* Arrow */}
      <div className="hidden md:block w-6 text-center text-gray-400">
        <PlaneTakeoff size={20} />
      </div>

      {/* Arrive */}
      <div className="text-center w-20 md:w-24">
        <p className="font-semibold text-lg">{arrivalTime}</p>
        <p className="text-xs text-gray-500">
          {source.split("→").pop().trim()}
        </p>
      </div>

      {/* Duration */}
      <div className="text-center w-auto md:w-28">
        <p className="font-semibold text-sm">{duration}</p>
        <p className="text-xs text-gray-500">
          {stops > 0 ? `${stops} Stop` : "Non-stop"}
        </p>
      </div>

      {/* Smart */}
      <div className="hidden md:flex w-28 items-center gap-3 text-gray-500 text-lg">
        <PlaneTakeoff className="opacity-70" />
        <PlaneLanding className="opacity-70" />
        <X className="opacity-70" size={16} />
      </div>

      {/* Price */}
      <div className="text-right w-28 md:w-32">
        <p className="font-semibold text-xl text-gray-800">
          ₹ {typeof price === "number" ? price.toLocaleString() : price}
        </p>
      </div>

      {/* Book Button */}
      <div className="w-full md:w-20 flex justify-end md:justify-end">
        <button
          onClick={onBook}
          className="border border-teal-500 text-teal-500 px-4 py-1 rounded-md
                     hover:bg-teal-500 hover:text-white transition text-sm"
        >
          Book
        </button>
      </div>

    </div>
  );
}

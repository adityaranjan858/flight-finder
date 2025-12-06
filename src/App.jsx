import "./App.css";
import Header from "./components/header/Header";
import SortBar from "./components/sort/SortBar";
import FlightsList from "./components/flights/FlightsList";
import PriceFilter from "./components/filter/PriceFilter";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import { fetchFlights } from "./store/flightsSlice";
import { useEffect } from "react";

function AppInner() {
  const dispatch = useDispatch();

  const { filters } = useSelector((s) => s.flights);

  const isSelected =
    filters.origin?.trim() &&
    filters.destination?.trim() &&
    filters.origin !== "" &&
    filters.destination !== "";

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-72">
            <PriceFilter />
          </aside>

          <section className="flex-1">
            <SortBar />

            {isSelected ? (
              <FlightsList />
            ) : (
              <div className="text-gray-600 text-sm flex items-center justify-center h-full gap-1.5">
                Please select <b>From: Mumbai</b> and <b>To: Kolkata</b> to view flights.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

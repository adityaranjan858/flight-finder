import Filter from "../filter/Filter";

export default function Header() {
  return (
    <header className="w-full shadow-md sticky top-0 bg-white z-50">
      {/* Top Navbar */}
      <div className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white">
        <div className=" mx-auto flex items-center justify-between py-3 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-white">AERTRIP</span>
          </div>

          <nav className="flex items-center gap-6 font-medium text-sm">

  <button className="px-5 py-2 rounded-full cursor-pointer border border-transparent hover:border-white/40 hover:bg-white/10 transition-all">
    AERIN
  </button>

  <button className="px-5 py-2 rounded-full cursor-pointer border-0  bg-teal-800 text-white">
    FLIGHT
  </button>

  <button className="px-5 py-2 rounded-full cursor-pointer border border-transparent hover:border-white/40 hover:bg-white/10 transition-all">
    HOTEL
  </button>

  <button className="px-5 py-2 rounded-full cursor-pointer border border-transparent hover:border-white/40 hover:bg-white/10 transition-all">
    TRIPS
  </button>

</nav>


          {/* Profile Avatar */}
          <div>
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="rounded-full w-9 h-9 border"
            />
          </div>
        </div>
      </div>

     <Filter />
    </header>
  );
}

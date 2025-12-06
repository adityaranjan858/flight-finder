import Filter from "../filter/Filter";
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    function onSearch() {
      // close mobile menu
      setOpen(false)
      // scroll to flights section smoothly
      const el = document.getElementById('flights-section')
      if (el && typeof el.scrollIntoView === 'function') {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    }

    window.addEventListener('aertrip:search', onSearch)
    return () => window.removeEventListener('aertrip:search', onSearch)
  }, [])
  return (
    <header className="w-full shadow-md sticky top-0 bg-white z-50">
      {/* Top Navbar */}
      <div className="w-full bg-linear-to-r from-teal-500 to-teal-400 text-white">
        <div className=" mx-auto flex items-center justify-between py-3 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-white">AERTRIP</span>
          </div>

          {/* desktop nav (hidden on small) */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm">

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
          {/* mobile hamburger (visible on small) */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              {/* Profile Avatar */}
              <img
                src="https://i.pravatar.cc/40"
                alt="user"
                className="rounded-full w-9 h-9 border"
              />
            </div>

            <button className="md:hidden p-2 rounded-md" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: nav + filter (visible when hamburger open) */}
      <div className={`md:hidden ${open ? 'block' : 'hidden'} bg-white border-b`}>
        <div className="px-4 py-3">
          <nav className="flex flex-col gap-2">
            <button className="w-full text-left px-4 py-2 rounded-full text-teal-700 border border-gray-100">AERIN</button>
            <button className="w-full text-left px-4 py-2 rounded-full bg-teal-700 text-white">FLIGHT</button>
            <button className="w-full text-left px-4 py-2 rounded-full">HOTEL</button>
            <button className="w-full text-left px-4 py-2 rounded-full">TRIPS</button>
          </nav>
        </div>

        <div className="px-0">
          <Filter />
        </div>
      </div>

      {/* Desktop filter (hidden on small) */}
      <div className="hidden md:block">
        <Filter />
      </div>
    </header>
  );
}

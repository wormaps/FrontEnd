import GlobeScene from "../globe/GlobeScene";
import { MVP_PLACES } from "../data/places";
import { Globe, MapPin, Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-1 bg-black">
      <GlobeScene places={MVP_PLACES} />

      {/* Top Header */}
      <div className="pointer-events-none absolute left-8 top-8 z-10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="glass-panel px-6 py-5 w-80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
              <Globe size={20} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300/70">WorMap Engine</p>
              <h1 className="text-xl font-black text-white tracking-tighter">GLOBAL DISCOVERY</h1>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3 glass-button h-10 px-4 text-xs font-bold text-zinc-400 pointer-events-auto cursor-text">
            <Search size={14} />
            <span>Search coordinates or places...</span>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <span>System Status</span>
              <span className="text-green-500">Online</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-cyan-500/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Place Selector */}
      <div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 flex justify-center px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="flex items-end gap-4">
          {MVP_PLACES.map((place, idx) => (
            <Link
              key={place.id}
              href={`/place/${place.slug}`}
              className="pointer-events-auto group relative flex flex-col"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="glass-panel px-3 py-1 text-[10px] font-black text-cyan-300 uppercase tracking-widest whitespace-nowrap">
                  Travel to {place.name}
                </div>
              </div>
              
              <div className="glass-panel w-48 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:ring-2 group-hover:ring-cyan-500/50">
                <div className="aspect-[16/10] bg-zinc-900 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                     <MapPin size={48} className="text-cyan-500" />
                  </div>
                  <div className="absolute bottom-3 left-4 z-20">
                    <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{place.city}</p>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none mt-0.5">{place.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Badge */}
      <div className="pointer-events-none absolute right-8 bottom-8 z-10 glass-panel px-4 py-2 flex items-center gap-3 animate-in fade-in duration-1000">
        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          Coordinates: <span className="text-white tabular-nums">37.5665° N, 126.9780° E</span>
        </p>
      </div>
    </main>
  );
}

"use client";

import GlobeScene from "@/src/globe/GlobeScene";
import { MVP_PLACES } from "@/src/data/places";
import type { Place } from "@/src/types/place";
import { Globe, MapPin, Search, ArrowLeft, Map } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/src/stores/useI18nStore";

export default function ExplorerHome() {
  const { t } = useTranslation();

  return (
    <main className="relative flex h-screen w-full bg-[#101214] overflow-hidden font-sans">
      <GlobeScene places={MVP_PLACES} />

      {/* Top Header - Redesigned to match the dark theme */}
      <div className="pointer-events-none absolute left-8 top-8 z-10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        
        {/* Back Button */}
        <Link href="/" className="pointer-events-auto flex w-fit items-center gap-2 px-4 py-2 bg-[#16181A]/90 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors backdrop-blur-md shadow-lg">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        
        <div className="bg-[#16181A]/90 border border-zinc-800 rounded-2xl px-6 py-5 w-80 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Globe size={20} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em]">{t('explorer.engine')}</p>
              <h1 className="text-zinc-100 text-lg font-bold tracking-tight leading-tight">{t('explorer.title')}</h1>
            </div>
          </div>
          
          <div className="mt-5 flex h-10 cursor-text items-center gap-3 px-4 text-xs font-medium text-zinc-400 border border-zinc-700/50 bg-zinc-900/50 rounded-lg pointer-events-auto hover:border-zinc-500 transition-colors">
            <Search size={14} className="opacity-70" />
            <span>{t('explorer.search')}</span>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
               <span>{t('explorer.systemStatus')}</span>
               <div className="flex items-center gap-1.5 opacity-90">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 ring-2 ring-green-500/20 animate-pulse" />
                 <span className="text-green-500">{t('explorer.online')}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Place Selector */}
      <div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 flex justify-center px-4 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex flex-wrap items-end justify-center gap-4 md:gap-5">
          {MVP_PLACES.map((place: Place) => (
            <Link
              key={place.id}
              href={`/place/${place.slug}`}
              className="pointer-events-auto group relative flex flex-col"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                <div className="bg-[#1e2024] border border-zinc-700 shadow-xl whitespace-nowrap px-4 py-2 rounded-md text-xs font-semibold tracking-wide text-zinc-200 flex items-center gap-2">
                  <MapPin size={12} className="text-blue-400" />
                  {t('explorer.travelTo', { name: place.name })}
                </div>
                {/* Tooltip triangle */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e2024] border-b border-r border-zinc-700 rotate-45"></div>
              </div>
              
              <div className="w-40 md:w-48 overflow-hidden rounded-xl border border-zinc-800 bg-[#16181A]/90 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-500/50 group-hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)]">
                <div className="aspect-[16/10] bg-zinc-900 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700">
                     <MapPin size={40} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  </div>
                  <div className="absolute bottom-3 left-4 z-20">
                    <p className="text-blue-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5">{place.city}</p>
                    <h3 className="text-zinc-100 text-xs md:text-sm font-semibold leading-tight">{place.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Badge */}
      <div className="pointer-events-none absolute right-4 bottom-4 md:right-8 md:bottom-8 z-10 bg-[#16181A]/90 border border-zinc-800 shadow-lg px-4 py-2.5 rounded-lg flex items-center gap-3 animate-in fade-in duration-1000 backdrop-blur-md hidden sm:flex">
        <Map size={14} className="text-zinc-500" />
        <p className="text-zinc-400 text-[10px] md:text-[11px] font-medium tracking-wide">
           {t('explorer.coordinates')}: <span className="text-zinc-200 font-mono tracking-tight ml-1">37.5665° N, 126.9780° E</span>
        </p>
      </div>
    </main>
  );
}

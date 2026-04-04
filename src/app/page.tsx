import GlobeScene from "../globe/GlobeScene";
import { MVP_PLACES } from "../data/places";

export default function Home() {
  return (
    <main className="relative flex flex-1 bg-black">
      <GlobeScene places={MVP_PLACES} />

      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl border border-white/10 bg-black/55 px-4 py-3 text-white backdrop-blur-sm">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-300">
          WorMap · Globe MVP
        </p>
        <h1 className="mt-1 text-lg font-semibold">장소를 클릭해 진입하세요</h1>
        <p className="mt-1 text-sm text-zinc-300">
          마커 3개(Shibuya / Times Square / Gangnam) 준비됨
        </p>
      </div>
    </main>
  );
}

export default function PlaceLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-950 text-zinc-100">
      <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">WorMap · Loading</p>
      <p className="text-lg font-medium">Place Scene 준비 중...</p>
      <p className="text-sm text-zinc-400">Globe → Place 전환 단계</p>
    </main>
  );
}

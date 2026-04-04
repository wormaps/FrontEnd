type PlacePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-zinc-100">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">WorMap · Place</p>
      <h1 className="text-3xl font-semibold">{slug}</h1>
      <p className="max-w-xl text-center text-sm text-zinc-400">
        Phase 1에서는 Globe에서 장소 클릭 후 라우팅이 동작하는지 검증합니다.
        다음 Phase에서 Loading Scene과 Place Scene 본체를 연결합니다.
      </p>
    </main>
  );
}

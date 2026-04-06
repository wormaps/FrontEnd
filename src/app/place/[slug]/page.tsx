import PlaceScene from "@/src/scene/place/PlaceScene";

type PlacePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;

  return (
    <main className="relative flex min-h-screen flex-col bg-black">
      <PlaceScene slug={slug} />
    </main>
  );
}

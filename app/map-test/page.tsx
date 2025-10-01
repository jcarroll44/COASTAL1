import MapSmoke from "@/components/MapSmoke";

export default function MapTestPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Map Smoke Test</h1>
      <p className="text-slate-600 mb-6">
        This page renders a base Mapbox map with your token. If it doesn’t show,
        the red status box will say why.
      </p>
      <MapSmoke />
    </main>
  );
}

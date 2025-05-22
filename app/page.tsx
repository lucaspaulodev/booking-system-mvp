import { CentersList } from '@/components/centers-list';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Beauty Centers</h1>
        <CentersList />
      </div>
    </main>
  );
}

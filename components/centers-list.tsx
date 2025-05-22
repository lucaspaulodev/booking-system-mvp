'use client';

import Link from 'next/link';
import { useCenters } from '@/lib/hooks/use-server-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CentersList() {
  const { data: centers, isLoading, error } = useCenters();

  if (isLoading) {
    return <div className="text-center py-8">Loading centers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading centers</div>;
  }

  if (!centers?.length) {
    return <div className="text-center py-8">No centers found</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {centers.map((center) => (
        <Link key={center.id} href={`${center.slug}`}>
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle>{center.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{center.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 
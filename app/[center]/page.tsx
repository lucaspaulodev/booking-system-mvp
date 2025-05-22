import { notFound } from 'next/navigation';
import { getCenter } from '@/app/actions';
import { CenterPageClient } from '@/components/center-page-client';

interface PageProps {
  params: { center: string };
}

export default function CenterPage({ params }: PageProps) {
  return <CenterContent params={params} />;
}

async function CenterContent({ params }: { params: { center: string } }) {
  const centerSlug = params.center;
  
  const result = await getCenter(centerSlug);
  
  if (!result.data) {
    notFound();
  }
  
  return <CenterPageClient slug={centerSlug} />;
}
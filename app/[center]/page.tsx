import { notFound } from 'next/navigation';
import { getCenter } from '@/app/actions';
import { CenterPageClient } from '@/components/center-page-client';

type PageProps = {
  params: Promise<{ center: string }> | { center: string };
};

export default async function CenterPage({ params }: PageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const centerSlug = resolvedParams.center;
  
  const result = await getCenter(centerSlug);
  
  if (!result.data) {
    notFound();
  }
  
  return <CenterPageClient slug={centerSlug} />;
}
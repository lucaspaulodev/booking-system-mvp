import { notFound } from 'next/navigation';
import { getCenter } from '@/app/actions';
import { CenterPageClient } from '@/components/center-page-client';

export default async function CenterPage({
  params,
}: {
  params: { center: string };
}) {
  try {
    const centerSlug = params.center;
    
    const result = await getCenter(centerSlug);
    
    if (!result.data) {
      notFound();
    }
    
    return <CenterPageClient slug={centerSlug} />;
  } catch (error) {
    notFound();
  }
}
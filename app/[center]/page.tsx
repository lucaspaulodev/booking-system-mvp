import { notFound } from 'next/navigation';
import { getCenter } from '@/app/actions';
import { CenterPageClient } from '@/components/center-page-client';

export default async function CenterPage({
  params,
}: {
  params: Promise<{ center: string }>;
}) {
  const { center: slug } = await params;
  try {
    const result = await getCenter(slug);
    
    if (!result.data) {
      notFound();
    }
    
    return <CenterPageClient slug={slug} />;
  } catch (error) {
    notFound();
  }
}
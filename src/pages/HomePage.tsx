import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import NextShows from '@/components/home/NextShows';
import LatestRelease from '@/components/home/LatestRelease';
import MerchTeaser from '@/components/home/MerchTeaser';
import GalleryTeaser from '@/components/home/GalleryTeaser';
import EpkCta from '@/components/home/EpkCta';
import SectionDivider from '@/components/ui/SectionDivider';
import { getPublishedShows } from '@/lib/repositories/shows';
import { getActiveProducts } from '@/lib/repositories/products';
import { getPublishedGallery } from '@/lib/repositories/gallery';
import { getEpkInfo } from '@/lib/repositories/epk';
import type { EpkInfo, GalleryItem, Product, Show } from '@/types';

export default function HomePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [epk, setEpk] = useState<EpkInfo | null>(null);

  useEffect(() => {
    getPublishedShows()
      .then((list) => {
        const now = Date.now();
        setShows(list.filter((show) => new Date(show.show_date).getTime() >= now - 86400000));
      })
      .catch(() => setShows([]));
    getActiveProducts().then(setProducts).catch(() => setProducts([]));
    getPublishedGallery().then(setGallery).catch(() => setGallery([]));
    getEpkInfo().then(setEpk).catch(() => setEpk(null));
  }, []);

  const featuredPrice = products.find((p) => p.slug === 'vinilo-todo-queda-aca')?.price ?? 0;

  return (
    <>
      <Hero />
      <SectionDivider className="py-6" />
      <NextShows shows={shows} />
      <LatestRelease productCount={products.length} featuredPrice={featuredPrice} />
      <SectionDivider className="py-6" />
      <MerchTeaser products={products} />
      <GalleryTeaser items={gallery} />
      {epk && <EpkCta epk={epk} />}
    </>
  );
}

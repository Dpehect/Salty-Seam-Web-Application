import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { AtelierSection } from "@/components/site/atelier-section";
import { CollectionSection } from "@/components/site/collection-section";
import { ProductSpreads } from "@/components/site/product-spread";
import { Showroom3DClient } from "@/components/site/showroom-3d-client";
import { MaterialLab } from "@/components/site/material-lab";
import { Footer } from "@/components/site/footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <AtelierSection />
      <CollectionSection />
      <ProductSpreads />
      <Showroom3DClient />
      <MaterialLab />
      <Footer />
    </main>
  );
}

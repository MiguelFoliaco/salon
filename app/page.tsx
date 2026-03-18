import { ProductTypes } from "@/module/categories/components/product-types";
import { Banner } from "@/module/common/components/banner";
import { Footer } from "@/module/common/components/footer";
import { Header } from "@/module/common/components/header";
import { ListProduct } from "@/module/product/component/products/list";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header />

      {/* Hero Banner */}
      <Banner />

      {/* Services Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ProductTypes />
          <ListProduct />
        </div>
      </section>

      <Footer />
    </div>
  );
}

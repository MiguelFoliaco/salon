import { ProductTypes } from "@/module/categories/components/product-types";
import { ChatMain } from "@/module/chat";
import { Banner } from "@/module/common/components/banner";
import { Footer } from "@/module/common/components/footer";
import { Header } from "@/module/common/components/header";
import { Map } from "@/module/domicilios/map";
import { ListProduct } from "@/module/product/component/products/list";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 relative">
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

      <section className="py-12 lg:py-16 max-w-7xl w-full  mx-auto">
        <h3 className="text-2xl font-bold mb-2.5">Estamos ubicados: </h3>
        <div style={{ width: '100%' }} className=" px-4 lg:px-6, rounded-sm overflow-hidden">
          <Map
            position={[10.3271633, -75.4240886]}
          />
        </div>
      </section>

      {/* <ChatMain /> */}

      <Footer />
    </div>
  );
}

import { ProductTypes } from "@/module/categories/components/product-types";
import { Banner } from "@/module/common/components/banner";
import { Footer } from "@/module/common/components/footer";
import { Header } from "@/module/common/components/header";
import { ListProduct } from "@/module/product/component/products/list";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="mt-10" />
      <Banner />
      <div className="mt-10 w-10/12 mx-auto" >
        <ProductTypes />
      </div>
      <div className="mt-10 w-10/12 mx-auto pb-10">
        <ListProduct />
      </div>

      <Footer />
    </div>
  );
}

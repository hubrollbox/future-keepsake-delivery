
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductsSection from "@/components/products/ProductsSection";

const Products = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Products;

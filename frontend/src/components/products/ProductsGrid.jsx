import ProductCard from "./ProductCard"

export default function ProductsGrid({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          variant="lg"
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}


import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
            {product.category}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-lg font-bold text-gray-900">₹{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;

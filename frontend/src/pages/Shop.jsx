import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";

import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import Message from "../components/Message";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  // Handle category list
  useEffect(() => {
    if (categoriesQuery.data && !categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Handle filtered products
  useEffect(() => {
    if (
      filteredProductsQuery.data &&
      Array.isArray(filteredProductsQuery.data)
    ) {
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        return priceFilter === ""
          ? true
          : product.price
              .toString()
              .toLowerCase()
              .includes(priceFilter.toLowerCase()) ||
              product.price === parseInt(priceFilter, 10);
      });
      dispatch(setProducts(filteredProducts));
    }
  }, [filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    if (productsByBrand) dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...new Set(
      (filteredProductsQuery.data || [])
        .map((p) => p.brand)
        .filter((b) => b !== undefined)
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  if (filteredProductsQuery.isLoading || categoriesQuery.isLoading)
    return <Loader />;
  if (filteredProductsQuery.isError || categoriesQuery.isError)
    return (
      <Message variant="danger">
        {filteredProductsQuery.error?.data?.message ||
          filteredProductsQuery.error?.message ||
          "Failed to load data"}
      </Message>
    );

  return (
  <div className="min-h-screen flex bg-[#111] text-white">
    {/* Main content container shifted right to make space for vertical sidebar */}
    <div className="flex flex-col md:flex-row flex-1 ml-16 px-4 py-6 gap-6">
      {/* FILTER SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#151515] rounded-lg p-4 h-max">
        <h2 className="text-lg font-semibold text-white mb-3 text-center bg-black py-2 rounded-full">
          Filter by Categories
        </h2>
        <div className="mb-4">
          {categories?.map((c) => (
            <div key={c._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`category-${c._id}`}
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
              />
              <label
                htmlFor={`category-${c._id}`}
                className="ml-2 text-sm font-medium text-white"
              >
                {c.name}
              </label>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-white mb-3 text-center bg-black py-2 rounded-full">
          Filter by Brands
        </h2>
        <div className="mb-4">
          {uniqueBrands.map((brand) => (
            <div key={brand} className="flex items-center mb-2">
              <input
                type="radio"
                id={brand}
                name="brand"
                onChange={() => handleBrandClick(brand)}
                className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
              />
              <label
                htmlFor={brand}
                className="ml-2 text-sm font-medium text-white"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-white mb-3 text-center bg-black py-2 rounded-full">
          Filter by Price
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
          />
        </div>

        <button
          className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Reset Filters
        </button>
      </aside>

      {/* PRODUCT DISPLAY */}
      <main className="flex-1">
        <h2 className="text-xl font-semibold mb-4 text-white text-center">
          {products?.length || 0} Products Found
        </h2>
        {products?.length === 0 ? (
          <p className="text-white text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  </div>
);

};

export default Shop;

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
    <div className="container mx-auto">
      <div className="flex md:flex-row">
        {/* FILTER SIDEBAR */}
        <div className="bg-[#151515] p-3 mt-2 mb-2">
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Categories
          </h2>
          <div className="p-5 w-[15rem]">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2">
                <div className="flex ietms-center mr-4">
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
              </div>
            ))}
          </div>

          {/* BRAND FILTER */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Brands
          </h2>
          <div className="p-5">
            {uniqueBrands.map((brand) => (
              <div key={brand} className="flex items-center mr-4 mb-5">
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

          {/* PRICE FILTER */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Price
          </h2>
          <div className="p-5 w-[15rem]">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
            />
          </div>

          <div className="p-5 pt-0">
            <button
              className="w-full border my-4"
              onClick={() => window.location.reload()}
            >
              Reset
            </button>
          </div>
        </div>

        {/* PRODUCT DISPLAY */}
        <div className="p-3">
          <h2 className="h4 text-center mb-2">
            {products?.length || 0} Products
          </h2>
          <div className="flex flex-wrap">
            {products?.length === 0 ? (
              <p className="text-white ml-5">No products found.</p>
            ) : (
              products?.map((p) => (
                <div className="p-3" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

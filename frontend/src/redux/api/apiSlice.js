import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Product', 'Order', 'Category'],
    endpoints: (builder) => ({
        getUsers: builder.query({
        query: () => '/users',
        providesTags: ['User'],
        }),
        getProducts: builder.query({
        query: () => '/products',
        providesTags: ['Product'],
        }),
        getOrders: builder.query({
        query: () => '/orders',
        providesTags: ['Order'],
        }),
        getCategories: builder.query({
        query: () => '/categories',
        providesTags: ['Category'],
        }),
    }),
});
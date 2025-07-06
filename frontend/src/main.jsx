import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/features/store.js'

import Login from './pages/Auth/Login.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Login />} />
      <Route path="forgot-password" element={<Login />} />
      <Route path="reset-password" element={<Login />} />
      <Route path="profile" element={<Login />} />
      <Route path="cart" element={<Login />} />
      <Route path="shop" element={<Login />} />
      <Route path="product/:id" element={<Login />} />
      <Route path="*" element={<Login />} />
      {/* Define your routes here */}
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);

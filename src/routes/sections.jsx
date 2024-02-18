import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import HeroPage from 'src/pages/hero';
import LoginPage from 'src/pages/login';
import { MainContext } from '../contexts/MainContext';

const IndexPage = lazy(() => import('src/pages/app'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function AppRouter() {
  const { currentUser } = useContext(MainContext)

  return (
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/login" element={<LoginPage />} />
        {currentUser ? (
          <>
            <Route
              path="dashboard/*"
              element={(
                <DashboardLayout>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Route index element={<IndexPage />} />
                    <Route path="user" element={<UserPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="blog" element={<BlogPage />} />
                  </Suspense>
                </DashboardLayout>
              )}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
  );
}
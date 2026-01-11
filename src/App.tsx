import {Routes, Route} from "react-router";
import './App.css'
import Layout from "./layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import React from 'react'

/* https://ui.shadcn.com/docs/installation/vite 
   https://reactrouter.com/start/declarative/routing */

function App() {

	return (
		<Routes>
			{/* routes without a path create new nesting for their children, they can be used as layouts */}
			<Route element={<Layout/>}>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/categories" element={<CategoriesPage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/sales" element={<SalesPage />} />
			</Route>
		</Routes>
	)
}

export default App

import {Routes, Route} from "react-router";
import './App.css'
import Navbar from "./layout/Navbar";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import React from 'react'

/* https://ui.shadcn.com/docs/installation/vite */

function App() {

	return (
		<Routes>
			{/* routes without a path create new nesting for their children, they can be used as layouts */}
			<Route element={<Navbar/>}>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/categories" element={<CategoriesPage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/sales" element={<SalesPage />} />
			</Route>
		</Routes>
	)
}

export default App

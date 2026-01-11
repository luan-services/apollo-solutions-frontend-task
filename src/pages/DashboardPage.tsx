import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {  ShoppingBag, Tags, DollarSign, ShoppingCart } from "lucide-react";
import type { DashboardData, ProductData, CategoryData } from "@/types";

const DashboardPage = () => {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
	const [productData, setProductData] = useState<ProductData | null>(null);
	const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [dashboardRes, productRes, categoryRes] = await Promise.all([
					fetch("http://127.0.0.1:8000/api/sales/dashboard/revenue"),
					fetch("http://127.0.0.1:8000/api/products/dashboard/total_products"),
					fetch("http://127.0.0.1:8000/api/categories/dashboard/total_categories")
				]);

				if (!dashboardRes.ok || !productRes.ok || !categoryRes.ok) {
					throw new Error("Erro Trying To Fetch Data");
				}
				
				const dashboardData = await dashboardRes.json();
				const productData = await productRes.json();
				const categoryData = await categoryRes.json();

				setDashboardData(dashboardData);
				setProductData(productData);
				setCategoryData(categoryData);

			} catch (error) {
				console.error("Error:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);


	if (loading) {
		return <div>Carregando dashboard...</div>;
	}

	if (!dashboardData || !productData || !categoryData) {
		return <div>Erro ao carregar dados.</div>;
	}

	return (
		<div className="space-y-6">
		<h1 className="text-3xl font-bold tracking-tight">SmartMart Dashboard</h1>
		
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Receita Total</CardTitle>
					<DollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
					{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.summary.total_revenue)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
					<ShoppingCart className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{dashboardData.summary.total_sales}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Produtos Cadastrados</CardTitle>
					<ShoppingBag className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{productData?.total_products}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Categorias Cadastradas</CardTitle>
					<Tags className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{categoryData?.total_categories}</div>
				</CardContent>
			</Card>
		</div>

		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Receita Mensal</CardTitle>
			</CardHeader>
			<CardContent className="pl-2">
			<div className="h-76 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={dashboardData.monthly_data}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
						<XAxis 
						dataKey="date" 
						stroke="#888888" 
						fontSize={12} 
						tickLine={false} 
						axisLine={false}
						/>
						<YAxis
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => `R$${value}`}
						/>
						<Tooltip 
							cursor={{ fill: 'transparent' }}
						/>
						<Bar dataKey="total" fill="#171717" radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
			</CardContent>
		</Card>
		</div>
	);
}

export default DashboardPage
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {  ShoppingBag, Tags, DollarSign, ShoppingCart } from "lucide-react";
import type { DashboardData } from "@/types";

const DashboardPage = () => {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {

			const url = "http://127.0.0.1:8000/api/dashboard/revenue"

			try {

				const response = await fetch(url)

				if (!response.ok) {
					throw new Error("Error trying to fetch data");
				}
				
				const data = await response.json();

				setDashboardData(data);

			} catch (error) {
				console.error("Error:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);


	if (loading) {
		return (    
			<div className="flex w-full animate-pulse p-4 text-center justify-center text-lg">
                Carregando dashboard...
            </div>
		)
	}

	if (!dashboardData) {
		return <div>Erro ao carregar dados.</div>;
	}

	return (
		<div className="flex flex-col gap-y-6">
			<h1 className="text-3xl font-bold">SmartMart Dashboard</h1>
		
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Receita Total</CardTitle>
						<DollarSign className="h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.summary.total_revenue)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
						<ShoppingCart className="h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboardData.summary.total_sales}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Total Produtos Cadastrados</CardTitle>
						<ShoppingBag className="h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboardData.summary.total_products}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Total Categorias Cadastradas</CardTitle>
						<Tags className="h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboardData.summary.total_categories}</div>
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
						<BarChart data={dashboardData.charts.monthly_revenue}>
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
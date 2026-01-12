import { useState } from 'react'
import { Outlet } from 'react-router'
import { Link, useLocation } from "react-router";
import React from 'react';
import { Toaster } from '@/components/ui/sonner';

import { LayoutDashboard, ShoppingBag, Tags, DollarSign, Pin, PinOff } from "lucide-react";

const Layout = () => {
	
	const [isExpanded, setIsExpanded] = useState(false);
	const currentPath = useLocation();

	const navItems = [
		{ href: "/", label: "Dashboard", icon: LayoutDashboard },
		{ href: "/products", label: "Produtos", icon: ShoppingBag },
		{ href: "/categories", label: "Categorias", icon: Tags },
		{ href: "/sales", label: "Vendas", icon: DollarSign },
	];

	return (
		<div className="flex min-h-screen w-full bg-neutral-50">
			<section className={`${isExpanded ? 'w-64' : ''} w-17 hover:w-64 hidden md:flex flex-col justify-start group px-2 py-6 bg-neutral-50 text-neutral-500 border-r-2 border-neutral-500 duration-300 ease-in-out`}>
				{/* desktop pin */}
				<div className="flex w-full ml-[6px]">
					<button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-md hover:bg-neutral-200 active:scale-95 transition cursor-pointer">
						{isExpanded ? <PinOff strokeWidth={2.5} size={20} /> : <Pin strokeWidth={2.5} size={20} />}
					</button>
				</div>

				{/* desktop panel */}
				<div className="flex items-center justify-center text-xl font-bold overflow-hidden h-7">
					<span className={`${isExpanded ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 group-hover:delay-200 duration-100`}>
						SmartMart
					</span>
				</div>


				{/* desktop nav */}
				<nav className="flex flex-col md:py-12">
					<div className="flex flex-col gap-2">
						{navItems.map((item) => {
							const isActive = currentPath.pathname === item.href;
							
							return (
								<Link
									key={item.href}
									to={item.href}
									className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
									isActive 
										? "bg-neutral-900 text-white" 
										: "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
									}`}
								>
									<item.icon strokeWidth={2.5} size={18} />
									<span className={` ${isExpanded ? 'opacity-100 ml-3' : ''} text-sm max-w-0 opacity-0 group-hover:ml-3 group-hover:opacity-100 duration-300`}>{item.label}</span>
								</Link>
							);
						})}
					</div>
				</nav>
			</section>


			<section className={`flex flex-row md:hidden bottom-0 shrink-0 fixed w-full py-1 justify-center gap-4 bg-neutral-50 border-t-1 border-t-neutral-500 text-white duration-300 ease-in-out z-2000`}>
				{/* mobile nav */}
				<nav className="flex md:hidden">
					<div className="flex flex-row w-full gap-2">
						{navItems.map((item) => {
							const isActive = currentPath.pathname === item.href;
							return (
								<Link
									key={item.href}
									to={item.href}
									className={`flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
									isActive 
										? "bg-neutral-900 text-white" 
										: "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
									}`}
								>
									<item.icon strokeWidth={2.5} size={18} />
								</Link>
							);
						})}
					</div>
				</nav>
			</section>

			<main className="flex-1 min-w-0 p-4 pb-20 md:p-8 overflow-y-auto h-screen">
				<Outlet/>
			</main>
			
			<Toaster/>
		</div>
	)
}

export default Layout
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash, Upload, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import SaleDialog from "../components/ui/SaleDialog";

import type { SaleFormData } from "../components/ui/SaleDialog";
import type { Sale, Product } from "@/types"; 

const SalesPage = () => {
    const [sales, setSales] = useState<SaleFormData[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterProduct, setFilterProduct] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentSale, setCurrentSale] = useState<SaleFormData | null>(null);

    const salesUrl = "http://127.0.0.1:8000/api/sales/";
    const productsUrl = "http://127.0.0.1:8000/api/products/";

    const fetchProducts = async () => {
        try {
            const response = await fetch(productsUrl);

            if (!response.ok) {
                throw new Error("Erro ao buscar produtos");
            }

            const data = await response.json();
            setProducts(data);

        } catch (error) {
            toast.error("Erro ao carregar lista de produtos.");
            console.error(error);
        }
    }

    /* initial fetch will search for all products, if filter search is toggled, it will check the existence of the filters */
    const fetchSales = async () => {
        try {
            const params = new URLSearchParams();

            if (filterProduct && filterProduct !== "all") {
                params.append("product_id", filterProduct);
            }
            if (startDate) {
                params.append("start_date", startDate);
            }
            if (endDate) {
                params.append("end_date", endDate);
            }

            const response = await fetch(salesUrl + `?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Erro ao buscar vendas");
            }

            const data = await response.json();
            setSales(data);

        } catch (error) {
            toast.error("Erro ao carregar vendas.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilter = async () => {
        setFilterProduct("all");
        setStartDate("");
        setEndDate("");
        setLoading(true);
        try {
            const response = await fetch(salesUrl);

            if (!response.ok) {
                throw new Error("Erro ao buscar vendas");
            }

            const data = await response.json();
            setSales(data);
        } catch (error) {
            toast.error("Erro ao carregar vendas.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(salesUrl + `${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
                throw new Error(errorData.detail || "Erro ao deletar");
            }

            fetchSales();
            toast.success("Venda removida.");
        } catch (error: any) {
            toast.error("Erro: " + error.message);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }
        
        const formData = new FormData();
        formData.append("file", file);

        try {
            await fetch(salesUrl + "import_csv", {
                method: "POST",
                body: formData
            });

            toast.success("Vendas importadas com sucesso.");
            fetchSales();
        } catch (error) {
            toast.error("Erro ao importar CSV.");
        }
    };

    useEffect(() => {
        fetchSales();
        fetchProducts();
    }, []);

    const handleSave = async (formData: SaleFormData) => {
        if (!formData.product_id) {
            toast.warning("Selecione um produto.");
            return;
        }
        if (!formData.date) {
            toast.warning("Selecione a data da venda.");
            return;
        }

        const payload: SaleFormData = {
            product_id: formData.product_id,
            quantity: typeof formData.quantity === 'string' ? parseInt(formData.quantity) : formData.quantity,
            total_price: typeof formData.total_price === 'string' ? parseFloat(formData.total_price) : formData.total_price,
            date: formData.date
        };

        try {
            let isEditing = false;
            if (formData.id) {
                isEditing = true;
            }

            const endpoint = isEditing ? salesUrl + `${formData.id}` : salesUrl;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar");
            }

            toast.success(isEditing ? "Venda atualizada." : "Venda criada.");
            fetchSales();
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Erro ao salvar venda.");
        }
    };

    const openModal = (sale: SaleFormData | null = null) => {
        setCurrentSale(sale);
        setIsDialogOpen(true);
    }

    const getProductName = (id: number) => {
        const product = products.find(p => p.id === id);
        return product ? product.name : `Prod ID: ${id}`;
    }

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex flex-wrap gap-3 justify-between items-center">
                <h1 className="text-3xl font-bold">Vendas</h1>

                <div className="flex justify-center gap-2 items-center">
                    <label htmlFor="csv-upload-sales">
                        <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-neutral-800 text-white rounded-md cursor-pointer transition">
                            <Upload size={16} /> Importar CSV
                        </div>
                        <input
                            id="csv-upload-sales"
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </label>
                    <Button className="flex items-center text-sm font-bold cursor-pointer transition" onClick={() => openModal(null)}>
                        <Plus size={16} /> Nova Venda
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Histórico de Vendas</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-neutral-50 rounded-lg border">
                        
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <Label>Filtrar por Produto</Label>
                            <Select value={filterProduct} onValueChange={setFilterProduct}>
                                <SelectTrigger className="w-full flex sm:w-60 bg-white">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Produtos</SelectItem>
                                    {products.map((prod) => (
                                        <SelectItem key={prod.id} value={prod.id === undefined ? "" : prod.id.toString()}>{prod.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col w-full sm:w-auto gap-2">
                            <Label htmlFor="start-date">Data Inicial</Label>
                            <Input 
                                id="start-date" 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                                className="w-full sm:w-auto bg-white" 
                            />
                        </div>

                        <div className="flex flex-col w-full sm:w-auto gap-2">
                            <Label htmlFor="end-date">Data Final</Label>
                            <Input 
                                id="end-date" 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                                className="w-full sm:w-auto bg-white" 
                            />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button onClick={fetchSales} className="gap-2 flex cursor-pointer">
                                <Search size={16} /> Filtrar
                            </Button>
                            <Button variant="outline" onClick={handleClearFilter} size="icon" title="Limpar Filtros" className="cursor-pointer border-1 bg-white">
                                <X size={16} />
                            </Button>
                        </div>
                    </div>

                    {loading ? <p>Carregando...</p> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Produto</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Qtd</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead className="flex justify-center items-center">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            Nenhuma venda encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sales.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell>{sale.id}</TableCell>
                                            <TableCell className="font-medium">
                                                {getProductName(sale.product_id)}
                                            </TableCell>
                                            <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                                            <TableCell>{sale.quantity}</TableCell>
                                            <TableCell>R$ {Number(sale.total_price).toFixed(2)}</TableCell>
                                            <TableCell className="gap-2 flex justify-center">
                                                <Button variant="ghost" size="icon" className="hover:bg-neutral-200 cursor-pointer" onClick={() => openModal(sale)}>
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-red-100 text-red-500 cursor-pointer" onClick={() => sale.id && handleDelete(sale.id)}>
                                                    <Trash size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <SaleDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                currentSale={currentSale}
                products={products}
                onSave={handleSave}
            />
        </div>
    );
}

export default SalesPage;
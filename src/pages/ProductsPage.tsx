import { useEffect, useState } from "react";
import { Plus, Pencil, Trash, Upload, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import ProductDialog from "../components/ui/ProductDialog";

import type { ProductFormData } from "../components/ui/ProductDialog";
import type { Product, Category } from "@/types";

const ProductsPage = () => {
    // Stores the list of products from API
    const [products, setProducts] = useState<ProductFormData[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filter State
    const [filterBrand, setFilterBrand] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);

    const productsUrl = "http://127.0.0.1:8000/api/products/";
    const categoriesUrl = "http://127.0.0.1:8000/api/categories/";

    const fetchCategories = async () => {
        try {
            const response = await fetch(categoriesUrl);

			if (!response.ok) {
				throw new Error("Erro ao buscar categorias");
			}

			const data = await response.json();
			setCategories(data);

        } catch (error) {
            toast.error("Erro ao carregar produtos.");
            console.error(error);
        }
    }

    /* initial fetch will search for all products, if filter search is toggled, it will check the existence of the filters */
    const fetchProducts = async () => {
        try {
            const params = new URLSearchParams();

            if (filterBrand) {
                params.append("brand", filterBrand);
            }
            if (filterCategory && filterCategory !== "all") {
                params.append("category_id", filterCategory);
            }
            if (minPrice) {
                params.append("min_price", minPrice);
            }
            if (maxPrice) {
                params.append("max_price", maxPrice);
            }

            const response = await fetch(productsUrl + `?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Erro ao buscar produtos");
            }

            const data = await response.json();
            setProducts(data);

        } catch (error) {
            toast.error("Erro ao carregar produtos.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleClearFilter = async () => {
        setFilterBrand("");
        setFilterCategory("all");
        setMinPrice("");
        setMaxPrice("");
        setLoading(true);
        try {
            const response = await fetch(productsUrl);

            if (!response.ok) {
                throw new Error("Erro ao buscar produtos");
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            toast.error("Erro ao carregar produtos.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(productsUrl + `${id}`, { 
                method: "DELETE" 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
                throw new Error(errorData.detail || "Erro ao deletar");
            }

            fetchProducts();
            toast.success("Produto removido.");
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
            await fetch(productsUrl + "import_csv", { 
                method: "POST", 
                body: formData 
            });

            toast.success("Dados importados com sucesso.");
            fetchProducts();
        } catch (error) {
            toast.error("Erro ao importar CSV.");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleSave = async (formData: ProductFormData) => {

        if (!formData.name || !formData.brand) {
            toast.warning("Preencha nome e marca.");
            return;
        }
        if (formData.category_id === 0) {
            toast.error("Selecione uma categoria válida.");
            return;
        }

        const payload: Product = {
            name: formData.name,
            description: formData.description,
            brand: formData.brand,
            category_id: formData.category_id,
            price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price
        };

        try {
            let isEditing = false;
            if (formData.id) {
                isEditing = true;
            }

            const endpoint = isEditing ? productsUrl + `${formData.id}` : productsUrl;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Erro ao salvar");

            toast.success(isEditing ? "Produto atualizado." : "Produto criado.");
            fetchProducts(); 
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Erro ao salvar produto.");
        }
    };

    const openModal = (product: ProductFormData | null = null) => {
        setCurrentProduct(product);
        setIsDialogOpen(true);
    }

    const getCategoryName = (id: number) => {
        const category = categories.find(c => c.id === id);
        return category ? category.name : id;
    }

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex flex-wrap gap-3 justify-between items-center">
                <h1 className="text-3xl font-bold">Produtos</h1>
                
                <div className="flex justify-center gap-2 items-center">
                    <label htmlFor="csv-upload">
                        <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-neutral-800 text-white rounded-md cursor-pointer transition">
                            <Upload size={16} /> Importar CSV
                        </div>
                        <input
							id="csv-upload"
							type="file"
							accept=".csv"
							className="hidden"
							onChange={handleFileUpload}
						/>
                    </label>
                    <Button className="flex items-center text-sm font-bold cursor-pointer transition" onClick={() => openModal(null)}>
                        <Plus size={16}/> Novo Produto
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Lista de Produtos</CardTitle></CardHeader>
                <CardContent>
                    
                    <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-neutral-50 rounded-lg border">
                         <div className="flex flex-col w-full sm:w-auto gap-2">
                            <Label htmlFor="filter-brand">Marca</Label>
                            <Input 
                                id="filter-brand" 
                                placeholder="Ex: Nike" 
                                value={filterBrand} 
                                onChange={(e) => setFilterBrand(e.target.value)}
                                className="w-full flex sm:w-66 bg-white"
                            />
                        </div>
                        
                        <div className="flex flex-col w-full sm:w-auto gap-2">
                            <Label htmlFor="min-price">Preço Mín.</Label>
                            <Input id="min-price" type="number" placeholder="Ex: 0.00" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full sm:w-26 bg-white" />
                        </div>
                        <div className="flex flex-col w-full sm:w-auto gap-2">
                            <Label htmlFor="max-price">Preço Máx.</Label>
                            <Input id="max-price" type="number" placeholder="Ex: 100.00" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full sm:w-26 bg-white" />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <Label>Categoria</Label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-full flex bg-white">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Categorias</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id === undefined ? "" : cat.id.toString()}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button onClick={fetchProducts} className="gap-2 flex cursor-pointer">
                                <Search size={16} /> Filtrar
                            </Button>
                            <Button variant="outline" onClick={handleClearFilter} size="icon" title="Limpar Filtros" className="cursor-pointer border-1 bg-white">
                                <X size={16}  />
                            </Button>
                        </div>
                    </div>

                    {loading ?                        
                        <div className="flex w-full animate-pulse p-4 text-center justify-center text-lg">
                            Carregando dados...
                        </div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Produto</TableHead>
                                    <TableHead>Marca</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Preço</TableHead>
                                    <TableHead className="flex justify-center items-center">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            Nenhum produto encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell className="font-medium">
                                                <div>{product.name}</div>
                                                <div className="text-xs text-muted-foreground">{product.description}</div>
                                            </TableCell>
                                            <TableCell>{product.brand}</TableCell>
                                            <TableCell>{getCategoryName(product.category_id)}</TableCell>
                                            <TableCell>R$ {Number(product.price).toFixed(2)}</TableCell>
                                            <TableCell className="gap-2 flex justify-center">
                                                <Button variant="ghost" size="icon" className="hover:bg-neutral-200 cursor-pointer" onClick={() => openModal(product)}>
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-red-100 text-red-500 cursor-pointer" onClick={() => product.id && handleDelete(product.id)}>
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

            <ProductDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen}
                currentProduct={currentProduct}
                categories={categories}
                onSave={handleSave}
            />
        </div>
    );
}

export default ProductsPage;
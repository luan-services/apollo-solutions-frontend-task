import { useEffect, useState } from "react";
import { Plus, Pencil, Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/types";

const CategoriesPage = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [currentCategory, setCurrentCategory] = useState<Category>({ name: "" });

	const url = "http://127.0.0.1:8000/api/categories/"

	/* fetch data outside useEffect to be reusable */
	const fetchCategories = async () => {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error("Erro ao buscar categorias");
			}

			const data = await response.json();
			setCategories(data);
		} catch (error) {
			toast.error("Erro ao carregar categorias.");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	/* function to create or update a category */
	const handleSave = async () => {
		try {
			const endpoint = isEditing ? url + `${currentCategory.id}` : url

			const method = isEditing ? "PUT" : "POST";

			console.log("saving " + endpoint)
			const response = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(currentCategory),
			});

			if (!response.ok) {
				throw new Error("Erro ao salvar")
			}

			toast.success(isEditing ? "Categoria atualizada." : "Categoria criada.");

			/* updating list */
			fetchCategories(); 
			setIsDialogOpen(false);
		} catch (error) {
			toast.error("Erro ao salvar categoria.");
			console.error(error);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(url + `${id}`, {
				method: "DELETE",
			});

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
                throw new Error(errorData.detail || "Erro ao deletar");
            }
		
			fetchCategories();
			toast.success("Categoria removida.");
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
			const response = await fetch(url + "import_csv", {
				method: "POST",
				body: formData,
			});


			if (!response.ok) {
				throw new Error("Erro no upload");
			}
			
			const result = await response.json();
			toast.success(result.message);
			fetchCategories();
		} catch (error) {
			toast.error("Erro ao importar CSV.");
		}
	};

	const openModal = (category: Category | null = null) => {
		if (category === null) {
			setIsEditing(false);
			setCurrentCategory({ name: "" });
			setIsDialogOpen(true);
			return;
		}
		setIsEditing(true);
		setCurrentCategory({ ...category });
		setIsDialogOpen(true);
	}

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex flex-wrap gap-3 justify-between items-center">
				<h1 className="text-3xl font-bold">Categorias</h1>
				
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
					
					<Button className="flex items-center text-sm font-bold cursor-pointer transition" onClick={() => openModal()}>
						<Plus size={16}/> 
						Nova Categoria
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader><CardTitle>Lista de Categorias</CardTitle></CardHeader>
				<CardContent>
					{loading ? 
						<div className="flex w-full animate-pulse p-4 text-center justify-center text-lg">
							Carregando dados...
						</div>
						 : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>
										ID
									</TableHead>
									<TableHead>
										Nome
									</TableHead>
									<TableHead className="items-center flex justify-center">
										Ações
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            Nenhum produto encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
									categories.map((category) => (
										<TableRow key={category.id}>
											<TableCell>
												{category.id}
												</TableCell>
											<TableCell className="font-medium">
												{category.name}
											</TableCell>
											<TableCell className="gap-2 flex justify-center">
												<Button variant="ghost" size="icon" className="hover:bg-neutral-200 cursor-pointer" onClick={() => openModal(category)}>
													<Pencil size={16} />
												</Button>
												<Button variant="ghost" size="icon" className="hover:bg-red-100 text-red-500 cursor-pointer" onClick={() => category.id && handleDelete(category.id)}>
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

			{/* create or edit modal */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Nome da Categoria</Label>
							<Input
								id="name"
								value={currentCategory.name}
								onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleSave}>
							Salvar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}


export default CategoriesPage
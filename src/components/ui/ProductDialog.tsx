import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/types";

export interface ProductFormData {
    id?: number;
    name: string;
    description: string;
    price: number | string;
    brand: string;
    category_id: number;
}

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentProduct: ProductFormData | null; // null means "New Product"
    categories: Category[];
    onSave: (product: ProductFormData) => Promise<void>;
}

const ProductDialog = ({ open, onOpenChange, currentProduct, categories, onSave }: ProductDialogProps) => {
    /* initial data to send, blank */
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        brand: "",
        price: "",
        category_id: 0
    });

    const [isSaving, setIsSaving] = useState(false);

    /* whenever the modal is open, if it is not editing, reset the form data */
    useEffect(() => {
        if (open) {
            if (currentProduct) {
                setFormData({ ...currentProduct });
                return;
            }

            setFormData({
                name: "",
                description: "",
                brand: "",
                price: "",
                category_id: categories.length > 0 ? (categories[0].id ?? 0) : 0
            });
            
        }
    }, [open, currentProduct, categories]);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-2 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="brand">Marca</Label>
                            <Input
                                id="brand"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Preço</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select
                            value={formData.category_id.toString()}
                            onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
                        >
                            <SelectTrigger className="flex w-full">
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id === undefined ? "" : cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDialog
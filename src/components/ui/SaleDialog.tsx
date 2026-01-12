import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/types";

export interface SaleFormData {
    id?: number;
    product_id: number;
    quantity: number | string;
    total_price: number | string;
    date: string;
}

interface SaleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentSale: SaleFormData | null;
    products: Product[];
    onSave: (sale: SaleFormData) => Promise<void>;
}

const SaleDialog = ({ open, onOpenChange, currentSale, products, onSave }: SaleDialogProps) => {
    /* initial data to send, blank */
    const [formData, setFormData] = useState<SaleFormData>({
        product_id: 0,
        quantity: "",
        total_price: "",
        date: new Date().toISOString().split('T')[0]
    });

    const [isSaving, setIsSaving] = useState(false);

    /* whenever the modal is open, if it is not editing, reset the form data */
    useEffect(() => {
        if (open) {
            if (currentSale) {
                setFormData({ ...currentSale });
                return;
            }

            setFormData({
                product_id: products.length > 0 ? (products[0].id ?? 0) : 0,
                quantity: "",
                total_price: "",
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [open, currentSale, products]);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentSale ? "Editar Venda" : "Nova Venda"}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-2 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="product">Produto</Label>
                        <Select
                            value={formData.product_id.toString()}
                            onValueChange={(value) => setFormData({ ...formData, product_id: parseInt(value) })}
                        >
                            <SelectTrigger className="flex w-full">
                                <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((prod) => (
                                    <SelectItem key={prod.id} value={prod.id === undefined ? "" : prod.id.toString()}>
                                        {prod.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="total_price">Valor Total (R$)</Label>
                            <Input
                                id="total_price"
                                type="number"
                                step="0.01"
                                value={formData.total_price}
                                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Data da Venda</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
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

export default SaleDialog;
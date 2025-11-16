import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Association {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
}

const Associations = () => {
  const { toast } = useToast();
  
  // Mock data - em produção virá do backend
  const products = [
    { id: "1", name: "Notebook Dell" },
    { id: "2", name: "Mouse Logitech" },
  ];
  
  const suppliers = [
    { id: "1", name: "Tech Distribuidora LTDA" },
    { id: "2", name: "Eletrônicos Mega" },
  ];

  const [associations, setAssociations] = useState<Association[]>([
    {
      id: "1",
      productId: "1",
      productName: "Notebook Dell",
      supplierId: "1",
      supplierName: "Tech Distribuidora LTDA",
    },
    {
      id: "2",
      productId: "1",
      productName: "Notebook Dell",
      supplierId: "2",
      supplierName: "Eletrônicos Mega",
    },
    {
      id: "3",
      productId: "2",
      productName: "Mouse Logitech",
      supplierId: "1",
      supplierName: "Tech Distribuidora LTDA",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifica se já existe essa associação
    const exists = associations.some(
      a => a.productId === selectedProduct && a.supplierId === selectedSupplier
    );

    if (exists) {
      toast({
        title: "Associação já existe",
        description: "Esta associação entre produto e fornecedor já foi criada.",
        variant: "destructive",
      });
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    const supplier = suppliers.find(s => s.id === selectedSupplier);

    if (product && supplier) {
      const newAssociation: Association = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        supplierId: supplier.id,
        supplierName: supplier.name,
      };

      setAssociations([...associations, newAssociation]);
      toast({
        title: "Associação criada",
        description: "Produto associado ao fornecedor com sucesso.",
      });
    }

    setIsOpen(false);
    setSelectedProduct("");
    setSelectedSupplier("");
  };

  const handleDelete = (id: string) => {
    setAssociations(associations.filter(a => a.id !== id));
    toast({
      title: "Associação removida",
      description: "A associação foi removida com sucesso.",
      variant: "destructive",
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedProduct("");
      setSelectedSupplier("");
    }
  };

  // Agrupa associações por produto
  const groupedAssociations = associations.reduce((acc, assoc) => {
    if (!acc[assoc.productId]) {
      acc[assoc.productId] = {
        productName: assoc.productName,
        suppliers: [],
      };
    }
    acc[assoc.productId].suppliers.push({
      id: assoc.id,
      supplierId: assoc.supplierId,
      supplierName: assoc.supplierName,
    });
    return acc;
  }, {} as Record<string, { productName: string; suppliers: Array<{ id: string; supplierId: string; supplierName: string }> }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Associações</h2>
          <p className="text-muted-foreground">Gerencie as relações entre produtos e fornecedores</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Associação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Associação</DialogTitle>
              <DialogDescription>
                Associe um produto a um fornecedor
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier} required>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Associação
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produtos e Fornecedores</CardTitle>
          <CardDescription>
            {associations.length} associação(ões) cadastrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Fornecedores</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedAssociations).map(([productId, data]) => (
                <TableRow key={productId}>
                  <TableCell className="font-medium">{data.productName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {data.suppliers.map((supplier) => (
                        <Badge key={supplier.id} variant="secondary" className="gap-1">
                          {supplier.supplierName}
                          <button
                            onClick={() => handleDelete(supplier.id)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Associations;

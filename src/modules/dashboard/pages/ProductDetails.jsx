import React from "react";
import {
    Package,
    Activity,
    History,
    ArrowUpRight,
    TrendingDown,
    BarChart3,
    Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/Table";

const ProductDetails = () => {
    // Mock data for display
    const product = {
        name: "500ml PET Water Bottle",
        sku: "SKU-500-PET",
        category: "Finished Goods",
        stock: 12450,
        unit: "Bottles",
        cost: 0.12,
        price: 0.35,
        status: "Healthy"
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                        <Package size={40} className="text-blue-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{product.name}</h1>
                            <Badge variant="success" className="px-3">IN STOCK</Badge>
                        </div>
                        <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{product.sku}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline"><Settings size={16} className="mr-2" /> Edit Details</Button>
                    <Button>Restock Now</Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-900 text-white border-none shadow-lg">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stock</p>
                        <p className="text-3xl font-black mt-1">{product.stock.toLocaleString()}</p>
                        <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                            <ArrowUpRight size={12} /> +12% vs last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Cost</p>
                        <p className="text-3xl font-black mt-1 text-slate-800">${product.cost}</p>
                        <p className="text-xs text-slate-500 mt-2">Production Avg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selling Price</p>
                        <p className="text-3xl font-black mt-1 text-slate-800">${product.price}</p>
                        <p className="text-xs text-emerald-600 font-bold mt-2">65% Margin</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Sales</p>
                        <p className="text-3xl font-black mt-1 text-slate-800">45,000</p>
                        <p className="text-xs text-slate-500 mt-2">Units Sold</p>
                    </CardContent>
                </Card>
            </div>

            {/* Movement History */}
            <Card className="shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="text-primary" /> Stock Movement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-bold text-slate-600">Oct 24, 2024</TableCell>
                                <TableCell><Badge variant="destructive">SALE</Badge></TableCell>
                                <TableCell className="text-xs font-mono">INV-9921</TableCell>
                                <TableCell className="text-right font-bold text-rose-500">-500</TableCell>
                                <TableCell className="text-right font-bold text-slate-800">12,450</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold text-slate-600">Oct 22, 2024</TableCell>
                                <TableCell><Badge variant="success">PRODUCTION</Badge></TableCell>
                                <TableCell className="text-xs font-mono">BATCH-004</TableCell>
                                <TableCell className="text-right font-bold text-emerald-600">+2,000</TableCell>
                                <TableCell className="text-right font-bold text-slate-800">12,950</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductDetails;

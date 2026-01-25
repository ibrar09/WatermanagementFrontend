import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Truck, FileText, CheckCircle2, User, MapPin } from "lucide-react";

const GatePassModule = () => {
    const { inventory, sellStock, employees } = useData();
    const [passes, setPasses] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [newPass, setNewPass] = useState({
        driver: "",
        vehicleNo: "",
        destination: "",
        items: [{ id: 1, name: "", quantity: 0 }]
    });

    const drivers = employees.filter(e => e.role.toLowerCase().includes("driver")) || [{ name: "Driver Ali" }, { name: "Driver Noman" }];

    const handleAddItem = () => {
        setNewPass({ ...newPass, items: [...newPass.items, { id: Date.now(), name: "", quantity: 0 }] });
    };

    const handleUpdateItem = (id, field, value) => {
        const updatedItems = newPass.items.map(item => item.id === id ? { ...item, [field]: value } : item);
        setNewPass({ ...newPass, items: updatedItems });
    };

    const handleGeneratePass = (e) => {
        e.preventDefault();

        // In a real app, this would deduct stock via 'sellStock' or 'transferStock'
        // We will simulate it here
        const passId = `GP-${Date.now().toString().slice(-6)}`;
        const passRecord = {
            id: passId,
            date: new Date().toLocaleDateString(),
            ...newPass,
            status: "DISPATCHED"
        };

        setPasses([passRecord, ...passes]);
        setShowForm(false);
        setNewPass({ driver: "", vehicleNo: "", destination: "", items: [{ id: 1, name: "", quantity: 0 }] });
        alert(`Gate Pass ${passId} Generated!`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Truck className="text-orange-600" size={36} />
                        Dispatch & Gate Pass
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage vehicle loading sheets and gate exit passes.</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 shadow-lg shadow-orange-200">
                    <FileText size={18} className="mr-2" /> Generate Gate Pass
                </Button>
            </div>

            {/* Recent Passes */}
            <div className="space-y-6">
                {passes.length === 0 && !showForm && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck size={32} className="text-orange-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No active dispatches</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1">Generate a gate pass to clear a vehicle for exit.</p>
                    </div>
                )}

                {passes.map(pass => (
                    <Card key={pass.id} className="border-l-4 border-l-orange-500 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-black text-slate-800">{pass.id}</h3>
                                        <Badge className="bg-orange-100 text-orange-700 border-none">GATE OUT</Badge>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                        <Truck size={14} /> {pass.vehicleNo} • <User size={14} /> {pass.driver}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => window.print()}>Print Slip</Button>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs font-bold uppercase">Item Name</TableHead>
                                            <TableHead className="text-xs font-bold uppercase text-right">Quantity Loaded</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pass.items.map((item, idx) => (
                                            <TableRow key={idx} className="border-b border-slate-100 last:border-0 hover:bg-transparent">
                                                <TableCell className="font-bold text-slate-700">{item.name}</TableCell>
                                                <TableCell className="font-mono font-black text-right text-slate-900">{item.quantity}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Generation Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle>New Loading Sheet (Bilty)</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleGeneratePass} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Driver Name</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                                            value={newPass.driver}
                                            onChange={e => setNewPass({ ...newPass, driver: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Vehicle No.</label>
                                        <Input
                                            value={newPass.vehicleNo}
                                            onChange={e => setNewPass({ ...newPass, vehicleNo: e.target.value })}
                                            placeholder="LEA-1234"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Destination / Route</label>
                                    <Input
                                        value={newPass.destination}
                                        onChange={e => setNewPass({ ...newPass, destination: e.target.value })}
                                        placeholder="Gulberg Route"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Loaded Items</label>
                                        <Button type="button" variant="ghost" size="sm" onClick={handleAddItem} className="h-6 text-xs text-blue-600">
                                            + Add Item
                                        </Button>
                                    </div>
                                    {newPass.items.map((item, idx) => (
                                        <div key={item.id} className="flex gap-2">
                                            <Input
                                                list="inventory-list"
                                                placeholder="Item Name"
                                                value={item.name}
                                                onChange={e => handleUpdateItem(item.id, 'name', e.target.value)}
                                                className="flex-[2]"
                                                required
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                value={item.quantity}
                                                onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)}
                                                className="flex-1"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                                    <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold">Issue Gate Pass</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <datalist id="inventory-list">
                        {inventory.map(i => <option key={i.id} value={i.name} />)}
                    </datalist>
                </div>
            )}
        </div>
    );
};

export default GatePassModule;

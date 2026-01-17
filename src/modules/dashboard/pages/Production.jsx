import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import {
    Factory,
    Play,
    RotateCw,
    CheckCircle2,
    AlertTriangle,
    ClipboardList,
    Fuel,
    Zap,
    Package,
    Timer,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/Table";
import CreateBatchModal from "../components/CreateBatchModal";

const Production = () => {
    const [activeRun, setActiveRun] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const startRun = () => {
        // In reality this would come from the modal confirmation
        setShowCreateModal(false);
        setActiveRun(true);
        // Simulate progress
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) clearInterval(interval);
        }, 500);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-2 sm:p-4">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-md">Manufacturing</div>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <Factory className="text-blue-600" size={36} />
                        Production Floor
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Monitor manufacturing lines, batches, and resource efficiency.</p>
                </div>

                <div className="flex gap-3">
                    {!activeRun ? (
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 h-12 px-6 font-bold"
                        >
                            <Play size={18} className="mr-2" /> Start New Batch
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            onClick={() => { setActiveRun(false); setProgress(0) }}
                            className="shadow-xl shadow-red-200 h-12 px-6 font-bold"
                        >
                            <RotateCw size={18} className="mr-2 animate-spin" /> Halt Line
                        </Button>
                    )}
                </div>
            </div>

            {/* LIVE STATUS PANEL */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className={`xl:col-span-2 border-none shadow-xl transition-all overflow-hidden relative ${activeRun ? 'bg-white ring-2 ring-blue-500/20' : 'bg-white'}`}>
                    {activeRun && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-400 animate-pulse" />}

                    <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-slate-800">
                                <Activity className={activeRun ? "text-emerald-500 animate-pulse" : "text-slate-300"} />
                                Live Production Status
                            </span>
                            {activeRun ?
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse">RUNNING • LINE A</Badge> :
                                <Badge variant="outline" className="text-slate-400 bg-slate-50">IDLE</Badge>
                            }
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {activeRun ? (
                            <div className="space-y-10">
                                <div className="relative pt-4 px-2">
                                    <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-slate-100 ring-1 ring-slate-200">
                                        <div
                                            style={{ width: `${progress}%` }}
                                            className="shadow-lg shadow-blue-500/30 flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 relative"
                                        >
                                            <span className="absolute right-2 font-bold text-[10px]">{progress}%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                        <span>Raw Material</span>
                                        <span>Filling</span>
                                        <span>Capping</span>
                                        <span>Quality Check</span>
                                        <span>Packaging</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                        <Package className="mx-auto mb-2 text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Target Output</p>
                                        <p className="text-xl font-black text-slate-900">5,000</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                        <Timer className="mx-auto mb-2 text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Time Left</p>
                                        <p className="text-xl font-black text-slate-900">45<span className="text-xs ml-1 font-bold text-slate-400">min</span></p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                        <CheckCircle2 className="mx-auto mb-2 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Completed</p>
                                        <p className="text-xl font-black text-emerald-600">{(progress * 50).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                        <Activity className="mx-auto mb-2 text-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Efficiency</p>
                                        <p className="text-xl font-black text-indigo-600">98%</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <Factory size={64} className="mb-4 opacity-20" />
                                <p className="font-bold text-lg text-slate-400">Production line is idle</p>
                                <p className="text-sm font-medium opacity-70">Start a new batch to track progress</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* UTILITY CONSUMPTION */}
                <Card className="border-none shadow-xl bg-slate-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Zap size={120} />
                    </div>
                    <CardHeader className="border-b border-white/10 pb-6">
                        <CardTitle className="text-white flex items-center gap-3">
                            <div className="p-2 bg-yellow-400/20 text-yellow-400 rounded-lg">
                                <Zap size={20} />
                            </div>
                            Utility Usage
                        </CardTitle>
                        <CardDescription className="text-slate-400 pl-1">Live resource consumption tracking</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 relative z-10">
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-yellow-400/10 text-yellow-400">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Electricity</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Line A + B</p>
                                </div>
                            </div>
                            <p className="text-xl font-mono font-black tracking-tight">128 <span className="text-xs text-slate-500 font-bold">kWh</span></p>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-orange-500/10 text-orange-400">
                                    <Fuel size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Diesel Fuel</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Generator 01</p>
                                </div>
                            </div>
                            <p className="text-xl font-mono font-black tracking-tight">450 <span className="text-xs text-slate-500 font-bold">L</span></p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Current Daily Cost</span>
                                <span className="text-emerald-400 font-black tracking-wider text-xl">$482.50</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[65%]"></div>
                            </div>
                            <p className="text-[10px] text-right text-slate-500 mt-1">65% of daily budget</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RECENT BATCHES */}
            <Card className="shadow-lg border-none bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <ClipboardList size={20} />
                        </div>
                        Production Cycle Logs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-black text-slate-400">Batch ID</TableHead>
                                <TableHead className="font-black text-slate-400">Product</TableHead>
                                <TableHead className="font-black text-slate-400">Status</TableHead>
                                <TableHead className="font-black text-slate-400 text-right">Quantity</TableHead>
                                <TableHead className="font-black text-slate-400 text-right">Waste</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="group hover:bg-slate-50 transition-colors">
                                <TableCell className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-600">#B-2024-001</TableCell>
                                <TableCell className="font-bold text-slate-700">500ml PET Bottles</TableCell>
                                <TableCell><Badge variant="success" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">COMPLETED</Badge></TableCell>
                                <TableCell className="text-right font-bold text-slate-700">5,000</TableCell>
                                <TableCell className="text-right text-rose-500 font-bold bg-rose-50 rounded-lg px-2 py-1">12 (0.2%)</TableCell>
                            </TableRow>
                            <TableRow className="group hover:bg-slate-50 transition-colors">
                                <TableCell className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-600">#B-2024-002</TableCell>
                                <TableCell className="font-bold text-slate-700">19L Gallons</TableCell>
                                <TableCell><Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">QA CHECK</Badge></TableCell>
                                <TableCell className="text-right font-bold text-slate-700">200</TableCell>
                                <TableCell className="text-right text-emerald-500 font-bold bg-emerald-50 rounded-lg px-2 py-1">0% (Perfect)</TableCell>
                            </TableRow>
                            <TableRow className="group hover:bg-slate-50 transition-colors">
                                <TableCell className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-600">#B-2024-003</TableCell>
                                <TableCell className="font-bold text-slate-700">1.5L PET Bottles</TableCell>
                                <TableCell><Badge variant="outline" className="text-slate-500 border-slate-200">SCHEDULED</Badge></TableCell>
                                <TableCell className="text-right font-bold text-slate-700">10,000</TableCell>
                                <TableCell className="text-right text-slate-300 font-bold">-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* MODAL */}
            {showCreateModal && (
                <CreateBatchModal onClose={() => startRun()} />
            )}
        </div>
    );
};

export default Production;

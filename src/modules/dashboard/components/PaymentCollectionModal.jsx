import React, { useState } from "react";
import { X, DollarSign, Calendar, CreditCard, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

const PaymentCollectionModal = ({ customer, onClose, onCollect }) => {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("Cash");
    const [reference, setReference] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount");

        onCollect({
            amount: Number(amount),
            method,
            reference,
            date,
            notes
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg bg-white border-none shadow-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between py-5">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <DollarSign size={20} />
                            </div>
                            Collect Payment
                        </CardTitle>
                        <p className="text-xs text-slate-500 font-medium ml-1 mt-1">
                            Record payment from <span className="font-bold text-slate-700">{customer.name}</span>
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </Button>
                </CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Amount Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                                <Input
                                    type="number"
                                    autoFocus
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-10 h-14 text-2xl font-black text-slate-800 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-slate-400">Current Balance: <span className="text-rose-500 font-bold">${customer.balance?.toLocaleString()}</span></span>
                                <button type="button" onClick={() => setAmount(customer.balance)} className="text-emerald-600 hover:text-emerald-700 hover:underline">Pay Full Balance</button>
                            </div>
                        </div>

                        {/* Payment Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <CreditCard size={12} /> Payment Method
                                </label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                >
                                    <option>Cash</option>
                                    <option>Bank Transfer</option>
                                    <option>Cheque</option>
                                    <option>Online / App</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <Calendar size={12} /> Date
                                </label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="h-11 font-medium"
                                />
                            </div>
                        </div>

                        {/* Reference & Notes */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    Ref / Cheque No. <span className="text-slate-300 font-normal lowercase">(optional)</span>
                                </label>
                                <Input
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g. TXN-123456789"
                                    className="h-11 font-medium placeholder:text-slate-300"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <FileText size={12} /> Remarks
                                </label>
                                <Input
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional notes..."
                                    className="h-11 font-medium placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg uppercase tracking-widest shadow-lg shadow-emerald-200 rounded-xl"
                        >
                            <CheckCircle2 className="mr-2" size={24} /> Confirm Payment
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentCollectionModal;

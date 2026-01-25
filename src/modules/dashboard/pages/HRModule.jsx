import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Users, UserPlus, DollarSign, Calendar, Briefcase, CheckCircle2, Calculator } from "lucide-react";

const HRModule = () => {
    const { employees, addEmployee, paySalary, addExpense } = useData();
    const [activeTab, setActiveTab] = useState("staff"); // staff or daily
    const [showAddModal, setShowAddModal] = useState(false);
    const [salaryModal, setSalaryModal] = useState({ open: false, employee: null });

    // Daily Wage State
    const [dailyWorkers, setDailyWorkers] = useState([
        { id: 1, name: "Mazdoor 1 (Loader)", rate: 1200, status: "Unpaid" },
        { id: 2, name: "Mazdoor 2 (Loader)", rate: 1200, status: "Unpaid" },
        { id: 3, name: "Mazdoor 3 (Cleaning)", rate: 1000, status: "Unpaid" }
    ]);

    const [newEmployee, setNewEmployee] = useState({
        name: "", role: "Plant Operator", phone: "", salary: "", cnic: "", emergencyContact: ""
    });

    const [payroll, setPayroll] = useState({
        base: 0,
        overtimeHours: 0,
        overtimeRate: 200,
        commission: 0,
        deduction: 0,
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    });

    const handleAddEmployee = (e) => {
        e.preventDefault();
        addEmployee(newEmployee);
        setShowAddModal(false);
        setNewEmployee({ name: "", role: "Plant Operator", phone: "", salary: "", cnic: "", emergencyContact: "" });
    };

    const handleOpenPayroll = (emp) => {
        setSalaryModal({ open: true, employee: emp });
        setPayroll({
            ...payroll,
            base: Number(emp.salary),
            overtimeHours: 0,
            commission: 0,
            deduction: 0
        });
    };

    const calculateNetPay = () => {
        const overtimePay = Number(payroll.overtimeHours) * Number(payroll.overtimeRate);
        return Number(payroll.base) + overtimePay + Number(payroll.commission) - Number(payroll.deduction);
    };

    const handleProcessSalary = (e) => {
        e.preventDefault();
        const netTotal = calculateNetPay();
        const breakdown = {
            base: payroll.base,
            overtime: Number(payroll.overtimeHours) * Number(payroll.overtimeRate),
            commission: payroll.commission,
            deduction: payroll.deduction,
            netTotal: netTotal
        };

        if (netTotal <= 0) return alert("Net salary cannot be zero or negative.");

        paySalary(salaryModal.employee, breakdown, payroll.month);
        setSalaryModal({ open: false, employee: null });
        alert(`Salary Processed: Rs. ${netTotal.toLocaleString()}`);
    };

    const handlePayDihaadi = () => {
        const unpaidTotal = dailyWorkers.filter(w => w.status === "Unpaid").reduce((acc, curr) => acc + curr.rate, 0);
        if (unpaidTotal === 0) return alert("No unpaid daily wages for today.");

        if (window.confirm(`Pay Rs. ${unpaidTotal} to ${dailyWorkers.filter(w => w.status === "Unpaid").length} workers?`)) {
            // Record Expense
            addExpense({
                category: "Daily Wages / Dihaadi",
                amount: unpaidTotal,
                description: `Daily labor payment for ${new Date().toLocaleDateString()}`,
                vendor: "Daily Staff",
                paymentMethod: "Cash"
            });

            // Mark paid locally (in real app, this would persist)
            setDailyWorkers(prev => prev.map(w => ({ ...w, status: "Paid" })));
            alert("Daily wages paid and recorded!");
        }
    };

    return (
        <div className="container-responsive spacing-y-responsive animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                        <Users className="text-blue-600" size={28} />
                        HR & Wages
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Manage staff, attendance, and payroll operations.</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-200 w-full sm:w-auto">
                    <UserPlus size={18} className="mr-2" /> New Employee
                </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
                <Button variant={activeTab === "staff" ? "default" : "ghost"} onClick={() => setActiveTab("staff")} className="rounded-lg gap-2">
                    <Briefcase size={16} /> Permanent Staff
                </Button>
                <Button variant={activeTab === "daily" ? "default" : "ghost"} onClick={() => setActiveTab("daily")} className="rounded-lg gap-2">
                    <Users size={16} /> Daily Wages (Dihaadi)
                </Button>
            </div>

            {/* MAIN CONTENT */}
            {activeTab === "staff" ? (
                /* Employee List */
                <div className="grid-responsive-1-2-3">
                    {employees.map(emp => (
                        <Card key={emp.id} className="group hover:shadow-xl transition-all border-t-4 border-t-blue-500">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div className="text-right">
                                        <Badge className={emp.status === "Active" ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-500"}>
                                            {emp.status}
                                        </Badge>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800">{emp.name}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1 mb-4">
                                    <Briefcase size={14} /> {emp.role}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-bold">Base Salary</span>
                                        <span className="font-bold text-slate-800">Rs. {Number(emp.salary).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-bold">CNIC</span>
                                        <span className="font-medium text-slate-600">{emp.cnic || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-bold">Contact</span>
                                        <span className="font-medium text-slate-600">{emp.phone}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleOpenPayroll(emp)}
                                    className="w-full mt-6 bg-slate-900 text-white hover:bg-slate-800 font-bold"
                                >
                                    <DollarSign size={16} className="mr-2" /> Process Salary
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* Daily Wages View */
                <div className="space-y-6">
                    <Card className="border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Daily Labor Sheet</CardTitle>
                                <p className="text-slate-500 text-sm">Manage daily wagers (Mazdoor) payments.</p>
                            </div>
                            <Button onClick={handlePayDihaadi} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                <CheckCircle2 size={18} className="mr-2" /> Pay All Outstanding
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dailyWorkers.map(worker => (
                                    <div key={worker.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                                                {worker.id}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{worker.name}</h4>
                                                <p className="text-xs text-slate-500">Rate: Rs. {worker.rate} / Day</p>
                                            </div>
                                        </div>
                                        <Badge variant={worker.status === "Paid" ? "success" : "destructive"} className={worker.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                                            {worker.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="modal-responsive p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <Card className="modal-content-responsive max-w-lg bg-white shadow-2xl">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-base sm:text-lg">Staff Onboarding</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddEmployee} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                        <Input required value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                                            value={newEmployee.role}
                                            onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                        >
                                            <option>Plant Operator</option>
                                            <option>Delivery Driver</option>
                                            <option>Sales Manager</option>
                                            <option>Helper / Loader</option>
                                            <option>Security Guard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                                        <Input value={newEmployee.phone} onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">CNIC Number</label>
                                        <Input value={newEmployee.cnic} onChange={e => setNewEmployee({ ...newEmployee, cnic: e.target.value })} placeholder="35202-xxxxxxx-x" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Monthly Salary</label>
                                        <Input type="number" required value={newEmployee.salary} onChange={e => setNewEmployee({ ...newEmployee, salary: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Emergency Contact</label>
                                        <Input value={newEmployee.emergencyContact} onChange={e => setNewEmployee({ ...newEmployee, emergencyContact: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
                                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold">Create Profile</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Payroll Modal */}
            {salaryModal.open && (
                <div className="modal-responsive p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <Card className="modal-content-responsive max-w-lg bg-white shadow-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base sm:text-lg">Process Payroll</CardTitle>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                For <span className="font-bold text-slate-800">{salaryModal.employee.name}</span> ({salaryModal.employee.role})
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleProcessSalary} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Payroll Month</label>
                                    <Input
                                        value={payroll.month}
                                        onChange={e => setPayroll({ ...payroll, month: e.target.value })}
                                    />
                                </div>

                                {/* Calculation Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Base Salary</label>
                                        <div className="font-mono font-bold text-lg text-slate-700">Rs. {Number(payroll.base).toLocaleString()}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-emerald-600 uppercase">Overtime (Hours)</label>
                                        <Input
                                            type="number"
                                            value={payroll.overtimeHours}
                                            onChange={e => setPayroll({ ...payroll, overtimeHours: e.target.value })}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-emerald-600 uppercase">OT Rate / Hour</label>
                                        <Input
                                            type="number"
                                            value={payroll.overtimeRate}
                                            onChange={e => setPayroll({ ...payroll, overtimeRate: e.target.value })}
                                            className="h-8 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-emerald-600 uppercase">Bonuses / Comm.</label>
                                        <Input
                                            type="number"
                                            value={payroll.commission}
                                            onChange={e => setPayroll({ ...payroll, commission: e.target.value })}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-rose-600 uppercase">Deductions / Loans</label>
                                        <Input
                                            type="number"
                                            value={payroll.deduction}
                                            onChange={e => setPayroll({ ...payroll, deduction: e.target.value })}
                                            className="h-8 text-sm border-rose-200 focus:border-rose-400"
                                        />
                                    </div>
                                </div>

                                {/* Net Total Display */}
                                <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <Calculator size={20} className="text-emerald-400" />
                                        <span className="font-bold text-sm uppercase tracking-widest">Net Payable</span>
                                    </div>
                                    <span className="font-mono text-2xl font-black text-emerald-400">
                                        Rs. {calculateNetPay().toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex gap-3 mt-2">
                                    <Button type="button" variant="ghost" onClick={() => setSalaryModal({ open: false, employee: null })} className="flex-1">Cancel</Button>
                                    <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200">
                                        Confirm Payment
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default HRModule;

import React, { useState } from "react";
import {
    User, Lock, Bell, Globe, Palette, LogOut, Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useTheme } from "../../../context/ThemeContext";

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "security", label: "Security", icon: Lock },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage account preferences and system configuration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <Card className="h-fit shadow-lg border-none">
                    <CardContent className="p-4 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {/* Profile Section */}
                    {activeTab === "profile" && (
                        <Card className="shadow-lg border-none animate-slide-up">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your photo and personal details here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-black">
                                        AU
                                    </div>
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm">Change Photo</Button>
                                        <Button variant="ghost" size="sm" className="text-rose-500">Remove</Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                                        <Input defaultValue="Admin User" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                                        <Input defaultValue="admin@waterplant.com" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Appearance Section */}
                    {activeTab === "appearance" && (
                        <Card className="shadow-lg border-none animate-slide-up">
                            <CardHeader>
                                <CardTitle>Theme Preferences</CardTitle>
                                <CardDescription>Customize the look and feel of the dashboard.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={theme === 'light' ? undefined : toggleTheme}
                                        className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 hover:bg-slate-50 transition-all ${theme === 'light' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'}`}
                                    >
                                        <div className="w-full h-24 bg-slate-100 rounded-lg border border-slate-200"></div>
                                        <p className="font-bold text-slate-800">Light Mode</p>
                                    </div>
                                    <div
                                        onClick={theme === 'gradient' ? undefined : toggleTheme}
                                        className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 hover:bg-slate-50 transition-all ${theme === 'gradient' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'}`}
                                    >
                                        <div className="w-full h-24 bg-slate-900 rounded-lg border border-slate-800"></div>
                                        <p className="font-bold text-slate-800">Dark / Elite Mode</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Section (Placeholder) */}
                    {activeTab === "security" && (
                        <Card className="shadow-lg border-none animate-slide-up">
                            <CardHeader>
                                <CardTitle>Password & Security</CardTitle>
                                <CardDescription>Manage your password and 2FA settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Current Password</label>
                                    <Input type="password" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">New Password</label>
                                    <Input type="password" />
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Password</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;

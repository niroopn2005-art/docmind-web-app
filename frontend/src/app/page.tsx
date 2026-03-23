'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
    const [messages, setMessages] = useState([{ role: "ai", text: "Welcome to DocMind. Your intelligent workspace is ready. How may I assist you today?" }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                if (text) {
                    setInput(prev => prev + (prev ? '\n\n' : '') + `[Document: ${file.name}]\n${text}\n`);
                }
            };
            reader.readAsText(file);
        });
        e.target.value = ''; // Reset input to allow re-uploading the same file
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "ai", text: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "ai", text: "Error: Neural link disconnected. Could not reach DocMind backend." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex h-screen w-full relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0f] to-black text-slate-100 selection:bg-indigo-500/30 font-sans">
            {/* Animated Background Mesh - Made more visible */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/40 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow object-cover pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow pointer-events-none" style={{ animationDelay: '4s' }}></div>

            {/* Sidebar */}
            <div className="w-72 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 flex flex-col hidden md:flex z-10 shadow-2xl relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                <div className="flex items-center space-x-3 text-2xl font-bold mb-8 text-white p-6 tracking-tight">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] group overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300 z-0"></div>
                        <svg className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform duration-500 z-10" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-extrabold">DocMind</span>
                </div>
                <div className="px-5">
                    <button className="flex justify-between items-center w-full p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-1 ring-white/5">
                        <span className="font-semibold text-slate-200 tracking-wide">New Thread</span>
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors shadow-inner">
                            <svg className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </button>
                </div>
                <div className="mt-auto p-6">
                    <div className="rounded-xl overflow-hidden relative p-4 bg-slate-800/40 border border-slate-700/50 backdrop-blur-md shadow-lg">
                        <h4 className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest mb-1.5">System Status</h4>
                        <div className="flex items-center space-x-2.5">
                            <div className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            </div>
                            <span className="text-sm font-medium text-slate-200">Engine Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col h-full relative z-10 w-full bg-black/20">
                <header className="px-8 py-5 border-b border-white/5 bg-slate-900/30 backdrop-blur-2xl top-0 sticky z-20 flex justify-between items-center shadow-md">
                    <h1 className="text-lg font-semibold tracking-wide text-white flex items-center gap-2">
                        Project Workspace
                    </h1>
                    <div className="flex items-center space-x-3 text-sm font-medium text-slate-300 bg-slate-800/60 px-4 py-1.5 rounded-full border border-slate-700/50 shadow-sm">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            Local RAG
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/40">v1.2</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth pb-72">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            {msg.role === 'ai' && (
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0 mr-4 shadow-[0_0_15px_rgba(99,102,241,0.3)] mt-1 object-cover border border-white/20">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                </div>
                            )}
                            <div className={`max-w-[85%] md:max-w-3xl px-7 py-5 rounded-2xl shadow-xl text-[15px] leading-[1.7] relative group ${
                                msg.role === 'user' 
                                ? 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-tr-sm shadow-indigo-900/40 ring-1 ring-white/10' 
                                : 'bg-slate-800/60 text-slate-100 rounded-tl-sm border border-slate-700/70 backdrop-blur-xl shadow-black/20'
                            }`}>
                                <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0 mr-4 shadow-[0_0_15px_rgba(99,102,241,0.3)] mt-1 border border-white/20">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                            </div>
                            <div className="px-7 py-6 rounded-2xl bg-slate-800/60 text-slate-400 rounded-tl-sm border border-slate-700/70 backdrop-blur-xl shadow-xl flex items-center space-x-2.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 w-full p-6 sm:px-10 sm:pb-10 pt-28 bg-gradient-to-t from-[#030305] via-[#050508]/90 to-transparent pointer-events-none">
                    <form onSubmit={sendMessage} className="relative max-w-4xl mx-auto flex items-end bg-slate-900/80 rounded-2xl border border-slate-700/60 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl focus-within:border-indigo-500/70 focus-within:bg-slate-800/90 transition-all duration-300 pointer-events-auto ring-1 ring-black/20">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".txt,.json,.md,.csv,.js,.ts,.py,.html,.css" />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 m-2.5 mb-2.5 rounded-xl bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all duration-300 flex items-center justify-center shrink-0 border border-slate-700/50 group relative hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            title="Add files, connectors, and more /"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        </button>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e as any); } }}
                            placeholder="Ask DocMind anything..."
                            className="w-full bg-transparent text-slate-50 placeholder-slate-400 border-0 focus:ring-0 py-5 pr-5 max-h-48 resize-none outline-none text-[16px] font-medium leading-relaxed"
                            rows={1}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || loading}
                            className="p-3.5 m-2.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:shadow-none disabled:hover:scale-100 disabled:active:scale-100 transition-all duration-300 flex items-center justify-center shrink-0 border border-white/20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                        </button>
                    </form>
                    <p className="text-center text-xs text-slate-500 mt-5 font-semibold pointer-events-auto tracking-wide">AI models can hallucinate. Verify critical insights from retrieved documents.</p>
                </div>
            </div>
        </main>
    );
}


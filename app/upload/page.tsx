"use client";
import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    addLog(`Starting upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Simulate Server Delay
    setTimeout(() => {
      setStatus('processing');
      addLog("File uploaded. Parsing PDF structure...");
      addLog("Running OCR check (Server-side)...");
      
      setTimeout(() => {
        addLog("Analyzing content quality with AI...");
        addLog("Checking for prohibited content...");
        
        setTimeout(() => {
          setStatus('success');
          addLog("Success! Material queued for Final Review.");
        }, 2000);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-light mb-2">Ingest New Material</h1>
          <p className="text-muted">Upload PDF curriculum books. Our AI will validate and structure them.</p>
        </div>

        <div className="bg-surface border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Dropzone */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-card/30">
            <UploadCloud size={48} className="text-primary mb-4" />
            <h3 className="text-lg font-medium text-light mb-2">Drag & Drop PDF here</h3>
            <p className="text-muted text-sm mb-6">or click to browse files</p>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="hidden" 
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className="bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded-lg cursor-pointer transition-colors font-medium"
            >
              Select File
            </label>
          </div>

          {/* File Preview */}
          {file && (
            <div className="mt-6 bg-card p-4 rounded-lg flex items-center justify-between border border-gray-700">
              <div className="flex items-center">
                <FileText className="text-secondary mr-3" />
                <div>
                  <p className="text-light font-medium">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              {status === 'success' ? <CheckCircle className="text-success" /> : null}
            </div>
          )}

          {/* Status & Logs */}
          {status !== 'idle' && (
            <div className="mt-6 bg-black/30 rounded-lg p-4 font-mono text-xs text-muted h-48 overflow-y-auto border border-gray-800">
              {logs.map((log, i) => (
                <div key={i} className="mb-1 flex items-start">
                  <span className="mr-2 text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes('Success') ? 'text-success' : 'text-gray-300'}>{log}</span>
                </div>
              ))}
              {status === 'processing' && (
                <div className="flex items-center text-primary mt-2">
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Processing...
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {file && status === 'idle' && (
            <button 
              onClick={handleUpload}
              className="w-full mt-6 bg-secondary hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20"
            >
              Start Ingestion Pipeline
            </button>
          )}

          {status === 'success' && (
             <button className="w-full mt-6 bg-gray-800 text-muted py-3 rounded-xl font-medium cursor-not-allowed">
               Ingestion Complete
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
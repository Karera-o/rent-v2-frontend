"use client";

import { useState, useEffect } from 'react';
import { Bug, X, RefreshCw, Download } from 'lucide-react';
import PaymentDebugService from '@/services/payment-debug';

export default function PaymentDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Load logs when panel is opened
  useEffect(() => {
    if (isOpen) {
      refreshLogs();
    }
  }, [isOpen]);

  const refreshLogs = () => {
    setLogs(PaymentDebugService.getLogs());
  };

  const clearLogs = () => {
    PaymentDebugService.clearLogs();
    refreshLogs();
  };

  const downloadLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-debug-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter logs based on search input
  const filteredLogs = filter 
    ? logs.filter(log => 
        JSON.stringify(log).toLowerCase().includes(filter.toLowerCase())
      )
    : logs;

  if (!isOpen) {
    return (
      <button 
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 z-50"
        onClick={() => setIsOpen(true)}
        title="Open Payment Debug Panel"
      >
        <Bug size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-5/6 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Bug className="mr-2 h-5 w-5" />
            Payment Debug Logs
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 text-gray-500 hover:text-blue-600" 
              onClick={refreshLogs}
              title="Refresh logs"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-green-600" 
              onClick={downloadLogs}
              title="Download logs"
            >
              <Download size={18} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-red-600" 
              onClick={clearLogs}
              title="Clear logs"
            >
              <span className="text-sm">Clear</span>
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-gray-800" 
              onClick={() => setIsOpen(false)}
              title="Close panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b">
          <input 
            type="text" 
            placeholder="Filter logs..." 
            className="w-full p-2 border rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              No logs available
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <div key={index} className={`p-3 rounded-md border ${getLogTypeStyle(log.type)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getLogTypeBadgeStyle(log.type)}`}>
                      {log.type}
                    </span>
                  </div>
                  <div className="font-medium mb-2">{log.message}</div>
                  {log.data && (
                    <div className="bg-gray-100 p-2 rounded-md overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(log.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions for styling based on log type
function getLogTypeStyle(type) {
  switch (type) {
    case 'ERROR':
      return 'border-red-200 bg-red-50';
    case 'API_REQUEST':
      return 'border-blue-200 bg-blue-50';
    case 'API_RESPONSE':
      return 'border-green-200 bg-green-50';
    case 'INFO':
      return 'border-gray-200 bg-gray-50';
    default:
      return 'border-gray-200';
  }
}

function getLogTypeBadgeStyle(type) {
  switch (type) {
    case 'ERROR':
      return 'bg-red-100 text-red-800';
    case 'API_REQUEST':
      return 'bg-blue-100 text-blue-800';
    case 'API_RESPONSE':
      return 'bg-green-100 text-green-800';
    case 'INFO':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
} 
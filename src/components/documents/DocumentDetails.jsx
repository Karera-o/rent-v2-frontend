"use client";

import { useState } from "react";
import { FileText, Calendar, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fixDocumentUrl } from "@/utils/helpers";

/**
 * DocumentDetails component for displaying document information
 * 
 * @param {Object} props
 * @param {Object} props.document - The document object
 */
export function DocumentDetails({ document }) {
  const [imageError, setImageError] = useState(false);
  
  if (!document) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No document selected</p>
      </div>
    );
  }
  
  // Status colors and icons
  const getStatusDetails = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-5 w-5 text-red-500" />
        };
      case 'pending':
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
        };
    }
  };
  
  const statusDetails = getStatusDetails(document.status);
  const documentUrl = fixDocumentUrl(document.document);
  
  // Format document type for display
  const formatDocumentType = (type) => {
    const documentTypes = {
      deed: "Property Deed",
      tax: "Property Tax Document",
      utility: "Utility Bill",
      insurance: "Property Insurance",
      id: "ID Card with Address",
      other: "Other Document",
    };
    
    return documentTypes[type] || type;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Document preview */}
      <div className="relative bg-gray-100 h-48 flex items-center justify-center border-b border-gray-200">
        {document.document && !imageError ? (
          <img
            src={documentUrl}
            alt="Document preview"
            className="h-full w-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FileText className="h-16 w-16 mb-2" />
            <span className="text-sm">Document preview not available</span>
          </div>
        )}
      </div>
      
      {/* Document details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {formatDocumentType(document.document_type)}
          </h3>
          <div className="flex items-center">
            {statusDetails.icon}
            <Badge className={`ml-2 ${statusDetails.color}`}>
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Uploaded: {new Date(document.created_at).toLocaleDateString()}</span>
          </div>
          
          {document.description && (
            <p className="text-gray-700 mt-2">
              {document.description}
            </p>
          )}
          
          {document.status === 'rejected' && document.rejection_reason && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
              <p className="text-sm text-red-700 mt-1">{document.rejection_reason}</p>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            asChild
          >
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Document
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

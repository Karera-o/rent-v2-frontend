"use client";

import { useState, useEffect } from "react";
import { fixDocumentUrl } from "@/utils/helpers";
import {
  FileCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  FileX,
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import DocumentService from "@/services/document";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Helper function to get property display name
  const getPropertyDisplayName = (document) => {
    // Log the document structure for debugging
    console.log('Property display name for document:', document);

    if (document.property_title) {
      return document.property_title;
    } else if (document.property?.title) {
      return document.property.title;
    } else if (document.property_type) {
      const location = document.city || document.state || document.country || 'Unknown Location';
      return `${document.property_type} in ${location}`;
    } else if (document.property?.property_type) {
      const location = document.property.city || document.property.state || document.property.country || 'Unknown Location';
      return `${document.property.property_type} in ${location}`;
    } else {
      return `Property #${document.property_id || 'Unknown'}`;
    }
  };

  // Helper function to get owner display name
  const getOwnerDisplayName = (document) => {
    // Log the document structure for debugging
    console.log('Owner display name for document:', document);

    if (document.owner_name && document.owner_name.trim() !== '') {
      return document.owner_name;
    } else if (document.owner?.name && document.owner.name.trim() !== '') {
      return document.owner.name;
    } else if (document.owner?.first_name || document.owner?.last_name) {
      const fullName = `${document.owner.first_name || ''} ${document.owner.last_name || ''}`.trim();
      if (fullName) return fullName;
    } else if (document.owner_username || document.owner?.username) {
      return document.owner_username || document.owner.username;
    } else if (document.owner_email || document.owner?.email) {
      return document.owner_email || document.owner.email;
    } else {
      return `Owner #${document.owner_id || document.owner?.id || 'Unknown'}`;
    }
  };

  // Helper function to get the full document URL - using the fixDocumentUrl helper
  const getDocumentUrl = (documentUrl) => {
    return fixDocumentUrl(documentUrl);
  };

  // Status badge colors
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  // Status icons
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Document type labels
  const documentTypeLabels = {
    deed: "Property Deed",
    tax: "Property Tax Document",
    utility: "Utility Bill",
    insurance: "Property Insurance",
    id: "ID Card with Address",
    other: "Other Document",
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch pending documents
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await DocumentService.getPendingDocuments();

      // Debug: Log the document structure
      console.log('Documents from API:', docs);
      if (docs && docs.length > 0) {
        console.log('First document structure:', JSON.stringify(docs[0], null, 2));
      }

      // Enhance documents with additional data if needed
      const enhancedDocs = docs.map(doc => {
        // Ensure property and owner objects exist
        if (!doc.property) {
          doc.property = {
            id: doc.property_id,
            title: doc.property_title,
            property_type: doc.property_type,
            city: doc.city,
            state: doc.state,
            country: doc.country
          };
        }

        if (!doc.owner) {
          doc.owner = {
            id: doc.owner_id,
            name: doc.owner_name,
            username: doc.owner_username,
            email: doc.owner_email
          };
        }

        // Fix document URL to use the full URL with backend
        if (doc.document) {
          doc.document = getDocumentUrl(doc.document);
        }

        return doc;
      });

      setDocuments(enhancedDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      });
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document approval
  const handleApproveDocument = async (documentId) => {
    if (!documentId) {
      toast({
        title: "Error",
        description: "Cannot approve document: Invalid document ID",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await DocumentService.approveDocument(documentId);

      toast({
        title: "Success",
        description: "Document approved successfully.",
      });

      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error("Error approving document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Open reject dialog
  const openRejectDialog = (document) => {
    // Check if document has an ID
    if (!document || !document.id) {
      toast({
        title: "Error",
        description: "Cannot reject document: Invalid document ID",
        variant: "destructive",
      });
      return;
    }

    setSelectedDocument(document);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  // Open feedback dialog
  const openFeedbackDialog = (document) => {
    // Check if document has an ID
    if (!document || !document.id) {
      toast({
        title: "Error",
        description: "Cannot send feedback: Invalid document ID",
        variant: "destructive",
      });
      return;
    }

    setSelectedDocument(document);
    setFeedbackMessage("");
    setFeedbackDialogOpen(true);
  };

  // Handle sending feedback
  const handleSendFeedback = async () => {
    if (!selectedDocument || !selectedDocument.id) {
      toast({
        title: "Error",
        description: "Cannot send feedback: Invalid document ID",
        variant: "destructive",
      });
      return;
    }

    if (!feedbackMessage.trim()) {
      toast({
        title: "Warning",
        description: "Please provide feedback message.",
        variant: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Call the API to send feedback
      await DocumentService.sendFeedback(selectedDocument.id, feedbackMessage);

      toast({
        title: "Success",
        description: "Feedback sent successfully.",
      });

      // Close dialog and reset form
      setFeedbackDialogOpen(false);
      setSelectedDocument(null);
      setFeedbackMessage("");

      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle document rejection
  const handleRejectDocument = async () => {
    if (!selectedDocument || !selectedDocument.id) {
      toast({
        title: "Error",
        description: "Cannot reject document: Invalid document ID",
        variant: "destructive",
      });
      return;
    }

    if (!rejectionReason.trim()) {
      toast({
        title: "Warning",
        description: "Please provide a reason for rejection.",
        variant: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await DocumentService.rejectDocument(selectedDocument.id, rejectionReason);

      toast({
        title: "Success",
        description: "Document rejected successfully.",
      });

      // Close dialog and reset form
      setRejectDialogOpen(false);
      setSelectedDocument(null);
      setRejectionReason("");

      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error("Error rejecting document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Documents</h1>
          <p className="text-gray-600 mt-1">
            Review and verify property ownership documents
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={fetchDocuments}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileCheck className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Documents table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Document Type
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Uploaded Date
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-blue-50 rounded-full p-3 mb-4">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">Loading documents</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Please wait while we fetch the verification documents...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-50 rounded-full p-3 mb-4">
                        <FileX className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">No pending documents</h3>
                      <p className="mt-1 text-sm text-gray-500 max-w-sm">
                        There are no documents waiting for verification at this time.
                        Check back later or refresh the page.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={fetchDocuments}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-500 mr-2" />
                        <Link
                          href={`/dashboard/admin/properties/${document.property_id}`}
                          className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                          {getPropertyDisplayName(document)}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-500 mr-2" />
                        <Link
                          href={`/dashboard/admin/users/${document.owner_id || document.owner?.id || '#'}`}
                          className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                          {getOwnerDisplayName(document)}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {document.document_type ?
                            (documentTypeLabels[document.document_type] || document.document_type) :
                            'Unknown Type'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        {document.status ? (
                          <>
                            <StatusIcon status={document.status} />
                            <Badge className={`ml-2 ${statusColors[document.status] || "bg-gray-100 text-gray-800"}`}>
                              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                            </Badge>
                          </>
                        ) : (
                          <Badge className="ml-2 bg-gray-100 text-gray-800">
                            Unknown
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {document.created_at ? new Date(document.created_at).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center w-24">
                      {/* View document button */}
                      <div className="flex justify-center">
                        {document.document ? (
                          <a
                            href={getDocumentUrl(document.document)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs"
                            onClick={(e) => {
                              // Log the URL for debugging
                              console.log('Opening document URL:', getDocumentUrl(document.document));
                            }}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            View
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-gray-50 text-gray-400 text-xs">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            None
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {/* Action buttons */}
                      <div className="flex space-x-2 justify-center">
                        {document.id && document.status === 'pending' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                              onClick={() => handleApproveDocument(document.id)}
                              disabled={isProcessing}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                              onClick={() => openFeedbackDialog(document)}
                              disabled={isProcessing}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : document.status === 'approved' ? (
                          <span className="text-green-600 text-xs font-medium flex items-center">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Already approved
                          </span>
                        ) : document.status === 'rejected' ? (
                          <span className="text-red-600 text-xs font-medium flex items-center">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Already rejected
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs font-medium flex items-center">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            No actions available
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this document is being rejected"
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectDocument}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject Document"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog (now used for Reject) */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this document.
              The property owner will be notified of this rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
              <Textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Please provide a reason for rejecting this document..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFeedbackDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendFeedback}
              disabled={isProcessing || !feedbackMessage.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { fixDocumentUrl } from "@/utils/helpers";
import {
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import PropertyService from "@/services/property";
import DocumentService from "@/services/document";
import { TableCellFeedbackThreadLink } from "@/components/documents/TableCellFeedbackThreadLink";
import { TableCellFeedbackLink } from "@/components/documents/TableCellFeedbackLink";

export default function LandlordDocuments() {
  const [properties, setProperties] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const { toast } = useToast();

  // Document type options
  const documentTypes = [
    { value: "deed", label: "Property Deed" },
    { value: "tax", label: "Property Tax Document" },
    { value: "utility", label: "Utility Bill" },
    { value: "insurance", label: "Property Insurance" },
    { value: "id", label: "ID Card with Address" },
    { value: "other", label: "Other Document" },
  ];

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

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch documents when a property is selected
  useEffect(() => {
    if (selectedProperty) {
      fetchDocuments(selectedProperty);
    }
  }, [selectedProperty]);

  // Fetch landlord properties
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      // Get properties for the current logged-in user only
      const response = await PropertyService.getLandlordProperties({
        owner: 'current',
        include_all_statuses: true // Show all properties regardless of approval status
      });

      const propertiesList = response.results || [];

      // Log properties for debugging
      console.log('Fetched properties for current user:', propertiesList);

      // Additional safety check to filter properties by the current user
      const currentUser = localStorage.getItem('username');
      console.log('Current user from localStorage:', currentUser);

      // Log each property's owner for debugging
      propertiesList.forEach(property => {
        console.log(`Property ${property.id} - ${property.title} - Owner:`,
                    property.owner ? `${property.owner.username} (${property.owner.id})` : 'No owner');
      });

      // If we have a username, filter properties to only show those owned by the current user
      if (currentUser) {
        const filteredProperties = propertiesList.filter(property => {
          // Check if the property owner matches the current user
          const isOwner = property.owner &&
                         (property.owner.username === currentUser ||
                          property.owner.id === currentUser ||
                          // Also check if the username contains the current user (for partial matches)
                          (typeof property.owner.username === 'string' &&
                           property.owner.username.includes(currentUser)));

          console.log(`Property ${property.id} - ${property.title} - Owner: ${property.owner?.username} - Current user: ${currentUser} - Is owned:`, isOwner);
          return isOwner;
        });

        console.log('Filtered properties by current user:', filteredProperties);

        // Use the filtered list instead
        if (filteredProperties.length > 0) {
          setProperties(filteredProperties);
          setSelectedProperty(filteredProperties[0].id);
          return;
        } else {
          console.log('No properties found for current user after filtering. Using all properties.');
        }
      }

      // Set the properties
      setProperties(propertiesList);

      // If properties exist, select the first one by default
      if (propertiesList.length > 0) {
        setSelectedProperty(propertiesList[0].id);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents for a property
  const fetchDocuments = async (propertyId) => {
    setIsLoading(true);
    try {
      const docs = await DocumentService.getPropertyDocuments(propertyId);
      console.log('Documents from API:', docs);

      // For each document, fetch detailed information including feedback thread
      const detailedDocs = await Promise.all(
        docs.map(async (doc) => {
          try {
            const detailedDoc = await DocumentService.getDocumentDetails(propertyId, doc.id);
            console.log('Detailed document:', detailedDoc);
            return detailedDoc;
          } catch (error) {
            console.error(`Error fetching details for document ${doc.id}:`, error);
            return doc; // Fall back to the original document if details fetch fails
          }
        })
      );

      setDocuments(detailedDocs);
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

  // Handle property selection change
  const handlePropertyChange = (propertyId) => {
    setSelectedProperty(propertyId);
  };

  // Handle document file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!documentFile || !documentType) {
      toast({
        title: "Warning",
        description: "Please select a file and document type.",
        variant: "warning",
      });
      return;
    }

    setIsUploading(true);
    try {
      await DocumentService.uploadDocument(selectedProperty, documentFile, {
        document_type: documentType,
        description: documentDescription,
      });

      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });

      // Reset form and close dialog
      setDocumentFile(null);
      setDocumentType("");
      setDocumentDescription("");
      setUploadDialogOpen(false);

      // Refresh documents list
      fetchDocuments(selectedProperty);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get property name by ID
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.title : "Unknown Property";
  };

  // Format document type for display
  const formatDocumentType = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  // Handle marking feedback as read
  const handleMarkFeedbackRead = async (document) => {
    // If feedback is already marked as read, do nothing
    if (document.feedback_read &&
        (!document.feedback_thread || !document.feedback_thread.some(msg => msg.sender_type === 'admin' && !msg.is_read))) {
      return;
    }

    try {
      await DocumentService.markFeedbackRead(selectedProperty, document.id);

      // Update the document in the local state
      setDocuments(prevDocs =>
        prevDocs.map(doc => {
          if (doc.id === document.id) {
            // Mark the document feedback as read
            const updatedDoc = { ...doc, feedback_read: true };

            // Also mark all admin messages in the feedback thread as read
            if (updatedDoc.feedback_thread) {
              updatedDoc.feedback_thread = updatedDoc.feedback_thread.map(msg =>
                msg.sender_type === 'admin' ? { ...msg, is_read: true } : msg
              );
            }

            return updatedDoc;
          }
          return doc;
        })
      );
    } catch (error) {
      console.error("Error marking feedback as read:", error);
      // No need to show a toast for this error as it's not critical
    }
  };

  // Handle sending a reply to feedback
  const handleSendFeedbackReply = async (documentId, propertyId, message) => {
    if (!message.trim()) return;

    try {
      const response = await DocumentService.addFeedbackMessage(propertyId, documentId, message);

      // Update the document in the local state to include the new message
      setDocuments(prevDocs =>
        prevDocs.map(doc => {
          if (doc.id === documentId) {
            const updatedDoc = { ...doc };

            // Initialize feedback_thread if it doesn't exist
            if (!updatedDoc.feedback_thread) {
              updatedDoc.feedback_thread = [];
            }

            // Add the new message to the thread
            updatedDoc.feedback_thread = [...updatedDoc.feedback_thread, response];

            return updatedDoc;
          }
          return doc;
        })
      );

      toast({
        title: "Success",
        description: "Your reply has been sent.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error sending feedback reply:", error);
      toast({
        title: "Error",
        description: "Failed to send your reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Documents</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage verification documents for your properties
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Verification Document</DialogTitle>
                <DialogDescription>
                  Upload a document to verify your property ownership or existence.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Property</label>
                  <Select
                    value={selectedProperty?.toString()}
                    onValueChange={(value) => setSelectedProperty(parseInt(value))}
                    disabled={properties.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Document Type</label>
                  <Select
                    value={documentType}
                    onValueChange={setDocumentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Document File</label>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX (max 10MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                  <Textarea
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    placeholder="Add additional information about this document"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadDocument}
                  disabled={isUploading || !documentFile || !documentType}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Document"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Property selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Property</label>
        <div className="flex gap-4">
          <Select
            value={selectedProperty?.toString()}
            onValueChange={(value) => handlePropertyChange(parseInt(value))}
            disabled={properties.length === 0 || isLoading}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Documents table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  Feedback
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">Loading documents...</p>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">No documents found for this property</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      Upload Document
                    </Button>
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatDocumentType(document.document_type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon status={document.status} />
                        <Badge className={`ml-2 ${statusColors[document.status] || "bg-gray-100 text-gray-800"}`}>
                          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                        </Badge>
                      </div>
                      {document.status === "rejected" && document.rejection_reason && (
                        <p className="text-xs text-red-600 mt-1">
                          Reason: {document.rejection_reason}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(document.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm">
                      {/* Check for feedback thread first */}
                      {document.feedback_thread && document.feedback_thread.length > 0 ? (
                        <TableCellFeedbackThreadLink
                          messages={document.feedback_thread}
                          onMarkAsRead={handleMarkFeedbackRead}
                          document={document}
                        />
                      ) : document.feedback ? (
                        <TableCellFeedbackLink
                          feedback={document.feedback}
                          isRead={document.feedback_read}
                          onMarkAsRead={handleMarkFeedbackRead}
                          document={document}
                          updatedAt={document.updated_at}
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">No feedback provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={fixDocumentUrl(document.document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        View Document
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

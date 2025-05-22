"use client";

import { useState, useEffect } from "react";
import { FileCheck, Upload, Loader2, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PropertyService from "@/services/property";
import DocumentService from "@/services/document";
import { FeedbackThread } from "@/components/documents/FeedbackThread";
import { DocumentDetails } from "@/components/documents/DocumentDetails";

export default function LandlordDocumentsFeedbackDemo() {
  const [properties, setProperties] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
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
      
      // For each document, fetch detailed information including feedback thread
      const detailedDocs = await Promise.all(
        docs.map(async (doc) => {
          try {
            const detailedDoc = await DocumentService.getDocumentDetails(propertyId, doc.id);
            return detailedDoc;
          } catch (error) {
            console.error(`Error fetching details for document ${doc.id}:`, error);
            return doc; // Fall back to the original document if details fetch fails
          }
        })
      );

      setDocuments(detailedDocs);
      
      // Select the first document by default if available
      if (detailedDocs.length > 0) {
        setSelectedDocument(detailedDocs[0]);
      } else {
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      });
      setDocuments([]);
      setSelectedDocument(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle property selection change
  const handlePropertyChange = (propertyId) => {
    setSelectedProperty(propertyId);
    setSelectedDocument(null);
  };

  // Handle document selection
  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
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

            // If this is the selected document, update it too
            if (selectedDocument && selectedDocument.id === doc.id) {
              setSelectedDocument(updatedDoc);
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
  const handleSendFeedbackReply = async (message) => {
    if (!message.trim() || !selectedDocument) return;

    try {
      const response = await DocumentService.addFeedbackMessage(
        selectedProperty, 
        selectedDocument.id, 
        message
      );

      // Update the document in the local state to include the new message
      setDocuments(prevDocs =>
        prevDocs.map(doc => {
          if (doc.id === selectedDocument.id) {
            const updatedDoc = { ...doc };

            // Initialize feedback_thread if it doesn't exist
            if (!updatedDoc.feedback_thread) {
              updatedDoc.feedback_thread = [];
            }

            // Add the new message to the thread
            updatedDoc.feedback_thread = [...updatedDoc.feedback_thread, response];

            // Update selected document
            setSelectedDocument(updatedDoc);

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
          <Button
            variant="outline"
            onClick={() => fetchDocuments(selectedProperty)}
            disabled={!selectedProperty || isLoading}
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading documents...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents list */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-900">Your Documents</h3>
              <p className="text-sm text-gray-500 mt-1">
                Select a document to view details and feedback
              </p>
            </div>
            
            {documents.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No documents found for this property</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {documents.map((document) => (
                  <div 
                    key={document.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedDocument?.id === document.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleDocumentSelect(document)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {document.status === 'approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : document.status === 'rejected' ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <FileCheck className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {documentTypes.find(t => t.value === document.document_type)?.label || document.document_type}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded: {new Date(document.created_at).toLocaleDateString()}
                        </p>
                        
                        {/* Unread indicator */}
                        {document.feedback_thread && 
                         document.feedback_thread.some(msg => msg.sender_type === 'admin' && !msg.is_read) && (
                          <div className="mt-2 flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                            <span className="text-xs text-red-600 font-medium">New feedback</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Document details and feedback thread */}
          <div className="lg:col-span-2 space-y-6">
            {selectedDocument ? (
              <>
                {/* Document details */}
                <DocumentDetails document={selectedDocument} />
                
                {/* Feedback thread */}
                <FeedbackThread 
                  messages={selectedDocument.feedback_thread || []}
                  onSendMessage={handleSendFeedbackReply}
                  onMarkAsRead={handleMarkFeedbackRead}
                  document={selectedDocument}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                <p className="text-gray-500 mb-6">
                  Select a document from the list to view details and feedback
                </p>
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

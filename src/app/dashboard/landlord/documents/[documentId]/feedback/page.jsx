"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  ChevronLeft,
  MessageSquare,
  User,
  UserCog,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import DocumentService from "@/services/document";
import { fixDocumentUrl } from "@/utils/helpers";

export default function FeedbackThreadPage() {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Fetch document and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // First get the property ID for this document
        const propertyData = await DocumentService.getDocumentProperty(documentId);
        const propertyId = propertyData.propertyId;

        // Then get the document details using the property ID
        const documentData = await DocumentService.getDocumentDetails(propertyId, documentId);
        setDocument(documentData);

        // For now, use the feedback_thread from the document data
        // In a real implementation, you would fetch the messages from a dedicated API endpoint
        if (documentData && documentData.feedback_thread) {
          setMessages(documentData.feedback_thread || []);
          setHasMore(false); // No pagination for now
        } else {
          setMessages([]);
          setHasMore(false);
        }

        // Mark messages as read
        if (documentData && documentData.feedback_thread && documentData.feedback_thread.some(msg => msg.sender_type === 'admin' && !msg.is_read)) {
          await DocumentService.markFeedbackRead(propertyId, documentId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load feedback thread. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (documentId) {
      fetchData();
    }
  }, [documentId, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoadingMore) {
      scrollToBottom();
    }
  }, [messages, isLoadingMore]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load more messages
  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      // In a real implementation, you would fetch more messages from a paginated API
      // For now, we'll just simulate a delay and then set hasMore to false
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasMore(false);
    } catch (error) {
      console.error("Error loading more messages:", error);
      toast({
        title: "Error",
        description: "Failed to load more messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);

      // Optimistically add message to UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        message: newMessage,
        sender_type: 'landlord',
        created_at: new Date().toISOString(),
        is_read: true,
      };

      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage("");

      // Get property ID
      const propertyData = await DocumentService.getDocumentProperty(documentId);
      const propertyId = propertyData.propertyId;

      // Send to API
      await DocumentService.addFeedbackMessage(propertyId, documentId, newMessage);

      // In a real implementation, you would refresh messages from the server
      // For now, we'll just keep the optimistic update
      toast({
        title: "Success",
        description: "Message sent successfully.",
      });

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      // Remove the optimistic message
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== `temp-${Date.now()}`));
    } finally {
      setIsSending(false);
    }
  };

  // Format message date
  const formatMessageDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Format document type
  const formatDocumentType = (type) => {
    if (!type) return 'Document';

    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get status details (icon and color)
  const getStatusDetails = (status) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-600 mr-1" />,
          color: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-4 w-4 text-red-600 mr-1" />,
          color: 'bg-red-100 text-red-800 border-red-200',
        };
      case 'pending':
      default:
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Document not found or you don't have permission to view it.</p>
        <Link href="/dashboard/landlord/documents" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Documents
        </Link>
      </div>
    );
  }

  const statusDetails = getStatusDetails(document.status);

  return (
    <div className="w-full max-w-4xl mx-auto px-0 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6 px-4 sm:px-0">
        <Link
          href="/dashboard/landlord/documents"
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Documents
        </Link>
      </div>

      {/* Document details card */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-sm border-x-0 sm:border-x border-gray-200 mb-4">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-md mr-3">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {formatDocumentType(document.document_type)}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Uploaded: {new Date(document.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge className={`${statusDetails.color} ml-2 whitespace-nowrap`}>
              {statusDetails.icon}
              <span className="ml-1">{document.status.charAt(0).toUpperCase() + document.status.slice(1)}</span>
            </Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {document.property_title && (
              <div className="bg-gray-50 px-3 py-1.5 rounded-md text-gray-700 text-sm flex items-center">
                <Building2 className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                <span className="line-clamp-1">{document.property_title}</span>
              </div>
            )}
            <a
              href={fixDocumentUrl(document.document)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-50 px-3 py-1.5 rounded-md text-blue-700 text-sm flex items-center hover:bg-blue-100 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              View Document
            </a>
          </div>

          {document.status === 'rejected' && document.rejection_reason && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
              <p className="text-sm text-red-700 mt-1">{document.rejection_reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback thread */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-sm border-x-0 sm:border-x border-gray-200 mb-4 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Feedback Thread
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Communicate with administrators about your document verification
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 whitespace-nowrap">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        <div className="p-2 sm:p-3 md:p-4 bg-gray-50 min-h-[300px] max-h-[600px] overflow-y-auto">
          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMoreMessages}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load earlier messages"
                )}
              </Button>
            </div>
          )}

          {/* Messages */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="bg-gray-100 p-3 rounded-full inline-flex mx-auto mb-3">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No messages yet</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto text-center">
                Start the conversation by sending a message below
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`
                      max-w-[95%] sm:max-w-[90%] md:max-w-[75%] rounded-lg p-3
                      ${msg.sender_type === 'admin'
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-blue-600 text-white'}
                    `}
                  >
                    <div className="flex flex-wrap items-center gap-x-2 mb-1">
                      <div className="flex items-center">
                        {msg.sender_type === 'admin' ? (
                          <UserCog className="h-3.5 w-3.5 text-blue-600 mr-1" />
                        ) : (
                          <User className="h-3.5 w-3.5 text-blue-100 mr-1" />
                        )}
                        <span className="font-medium text-xs">
                          {msg.sender_type === 'admin' ? 'Admin' : 'You'}
                        </span>
                      </div>
                      <span className={`text-xs ${msg.sender_type === 'admin' ? 'text-gray-500' : 'text-blue-100'}`}>
                        {formatMessageDate(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex flex-col w-full">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[80px] text-sm resize-none mb-2 focus:border-blue-300"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

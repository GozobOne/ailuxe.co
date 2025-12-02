import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Plus,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Edit,
  Trash2,
  Tag,
  User,
  Loader2,
  ArrowLeft,
  Download,
  Home,
  X,
} from "lucide-react";
import ContactFormEnhanced from "@/components/ContactFormEnhanced";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Contacts() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "past" | "prospect" | "lead">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [viewingContact, setViewingContact] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    phone: "",
    phones: [] as string[],
    email: "",
    emails: [] as string[],
    website: "",
    platform: "whatsapp" as const,
    status: "prospect" as const,
    tags: "",
    notes: "",
    avatarUrl: "",
  });

  // Additional phone/email states
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Fetch contacts
  const { data: allContacts, refetch: refetchContacts } = trpc.contacts.list.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 10000 }
  );

  // Search contacts
  const { data: searchResults } = trpc.contacts.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  // Get contact message history
  const { data: messageHistory } = trpc.contacts.getMessageHistory.useQuery(
    { contactId: viewingContact?.id },
    { enabled: !!viewingContact }
  );

  // Mutations
  const createMutation = trpc.contacts.create.useMutation({
    onSuccess: () => {
      toast.success("Contact created successfully");
      refetchContacts();
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create contact: ${error.message}`);
    },
  });

  const updateMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      toast.success("Contact updated successfully");
      refetchContacts();
      setIsEditDialogOpen(false);
      setSelectedContact(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });

  const deleteMutation = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success("Contact deleted successfully");
      refetchContacts();
    },
    onError: (error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });

  const handleExportCSV = () => {
    if (!allContacts || allContacts.length === 0) {
      toast.error("No contacts to export");
      return;
    }

    // Create CSV content
    let csv = "Name,Phone,Email,Platform,Status,Tags,Notes,Created At\n";
    allContacts.forEach((contact: any) => {
      const tags = contact.tags ? contact.tags.split(',').join('; ') : '';
      const notes = contact.notes ? contact.notes.replace(/\n/g, ' ').replace(/,/g, ';') : '';
      csv += `"${contact.name}","${contact.phone || ''}","${contact.email || ''}","${contact.platform}","${contact.status}","${tags}","${notes}","${new Date(contact.createdAt).toLocaleString()}"\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Contacts exported successfully");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      phone: "",
      phones: [],
      email: "",
      emails: [],
      website: "",
      platform: "whatsapp",
      status: "prospect",
      tags: "",
      notes: "",
      avatarUrl: "",
    });
    setNewPhone("");
    setNewEmail("");
  };

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      setFormData({ ...formData, phones: [...formData.phones, newPhone.trim()] });
      setNewPhone("");
    }
  };

  const handleRemovePhone = (index: number) => {
    setFormData({ ...formData, phones: formData.phones.filter((_, i) => i !== index) });
  };

  const handleAddEmail = () => {
    if (newEmail.trim()) {
      setFormData({ ...formData, emails: [...formData.emails, newEmail.trim()] });
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (index: number) => {
    setFormData({ ...formData, emails: formData.emails.filter((_, i) => i !== index) });
  };

  const handleCreate = () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    // Convert arrays to JSON strings for storage
    const dataToSubmit = {
      ...formData,
      phones: formData.phones.length > 0 ? JSON.stringify(formData.phones) : undefined,
      emails: formData.emails.length > 0 ? JSON.stringify(formData.emails) : undefined,
    };
    createMutation.mutate(dataToSubmit as any);
  };

  const handleUpdate = () => {
    if (!selectedContact) return;
    // Convert arrays to JSON strings for storage
    const dataToSubmit = {
      ...formData,
      phones: formData.phones.length > 0 ? JSON.stringify(formData.phones) : undefined,
      emails: formData.emails.length > 0 ? JSON.stringify(formData.emails) : undefined,
    };
    updateMutation.mutate({
      id: selectedContact.id,
      ...dataToSubmit,
    } as any);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteMutation.mutate({ id });
    }
  };

  const openEditDialog = (contact: any) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || "",
      title: contact.title || "",
      phone: contact.phone || "",
      phones: contact.phones ? JSON.parse(contact.phones) : [],
      email: contact.email || "",
      emails: contact.emails ? JSON.parse(contact.emails) : [],
      website: contact.website || "",
      platform: contact.platform || "whatsapp",
      status: contact.status || "prospect",
      tags: contact.tags || "",
      notes: contact.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  // Filter contacts
  const displayContacts = searchQuery
    ? searchResults
    : statusFilter === "all"
    ? allContacts
    : allContacts?.filter((c) => c.status === statusFilter);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "whatsapp": return "bg-green-500";
      case "telegram": return "bg-blue-500";
      case "signal": return "bg-primary";
      case "multiple": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default">Active</Badge>;
      case "past": return <Badge variant="outline">Past</Badge>;
      case "prospect": return <Badge variant="secondary">Prospect</Badge>;
      case "lead": return <Badge className="bg-yellow-500">Lead</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access contacts</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Contact detail view
  if (viewingContact) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setViewingContact(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Contacts
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${getPlatformColor(viewingContact.platform)} flex items-center justify-center text-white text-2xl font-bold`}>
                    {viewingContact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{viewingContact.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      {getStatusBadge(viewingContact.status)}
                      <Badge variant="outline" className="capitalize">{viewingContact.platform}</Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(viewingContact)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => {
                      handleDelete(viewingContact.id);
                      setViewingContact(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                {viewingContact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{viewingContact.phone}</p>
                    </div>
                  </div>
                )}
                {viewingContact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{viewingContact.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {viewingContact.tags && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingContact.tags.split(",").map((tag: string, i: number) => (
                      <Badge key={i} variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewingContact.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm">{viewingContact.notes}</p>
                </div>
              )}

              {/* Message History */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Message History
                </h3>
                <div className="space-y-3">
                  {messageHistory && messageHistory.length > 0 ? (
                    messageHistory.map((msg: any) => (
                      <div key={msg.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={msg.direction === "inbound" ? "secondary" : "outline"}>
                            {msg.direction}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content || `${msg.messageType} message`}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No messages yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main contacts list view
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8" />
                Contacts
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your client relationships
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-luxury text-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search contacts by name, phone, email, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "prospect" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("prospect")}
                >
                  Prospects
                </Button>
                <Button
                  variant={statusFilter === "lead" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("lead")}
                >
                  Leads
                </Button>
                <Button
                  variant={statusFilter === "past" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("past")}
                >
                  Past
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayContacts && displayContacts.length > 0 ? (
            displayContacts.map((contact: any) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setViewingContact(contact)}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${getPlatformColor(contact.platform)} flex items-center justify-center text-white font-bold`}>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{contact.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(contact.status)}
                      </div>
                      {contact.phone && (
                        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </p>
                      )}
                      {contact.email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </p>
                      )}
                      {contact.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contact.tags.split(",").slice(0, 2).map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(contact);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium">No contacts found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "Try a different search query" : "Add your first contact to get started"}
              </p>
            </div>
          )}
        </div>

        {/* Add Contact Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Create a new contact in your client database
              </DialogDescription>
            </DialogHeader>
            <ContactFormEnhanced
              formData={formData}
              setFormData={setFormData}
              newPhone={newPhone}
              setNewPhone={setNewPhone}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              onAddPhone={handleAddPhone}
              onRemovePhone={handleRemovePhone}
              onAddEmail={handleAddEmail}
              onRemoveEmail={handleRemoveEmail}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
              <DialogDescription>
                Update contact information
              </DialogDescription>
            </DialogHeader>
            <ContactFormEnhanced
              formData={formData}
              setFormData={setFormData}
              newPhone={newPhone}
              setNewPhone={setNewPhone}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              onAddPhone={handleAddPhone}
              onRemovePhone={handleRemovePhone}
              onAddEmail={handleAddEmail}
              onRemoveEmail={handleRemoveEmail}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import CSV Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Contacts from CSV</DialogTitle>
              <DialogDescription>
                Upload a CSV file with columns: name, phone, email, title, role, company, tags (comma-separated)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {importFile ? importFile.name : "Click to upload CSV file"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Maximum file size: 5MB
                    </p>
                  </div>
                </label>
              </div>
              {importFile && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">File selected:</p>
                  <p>{importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsImportDialogOpen(false);
                setImportFile(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  if (!importFile) {
                    toast.error("Please select a CSV file");
                    return;
                  }
                  setImporting(true);
                  try {
                    const text = await importFile.text();
                    const lines = text.split('\n').filter(line => line.trim());
                    if (lines.length < 2) {
                      toast.error("CSV file is empty or invalid");
                      return;
                    }
                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                    let imported = 0;
                    for (let i = 1; i < lines.length; i++) {
                      const values = lines[i].split(',').map(v => v.trim());
                      const contact: any = {};
                      headers.forEach((header, index) => {
                        if (values[index]) {
                          if (header === 'tags') {
                            contact.tags = values[index].split(';').map(t => t.trim());
                          } else if (header === 'phone') {
                            contact.phones = [values[index]];
                          } else if (header === 'email') {
                            contact.emails = [values[index]];
                          } else {
                            contact[header] = values[index];
                          }
                        }
                      });
                      if (contact.name) {
                        await createMutation.mutateAsync(contact);
                        imported++;
                      }
                    }
                    toast.success(`Imported ${imported} contacts successfully`);
                    setIsImportDialogOpen(false);
                    setImportFile(null);
                    refetchContacts();
                  } catch (error) {
                    console.error('Import error:', error);
                    toast.error("Failed to import CSV");
                  } finally {
                    setImporting(false);
                  }
                }}
                disabled={!importFile || importing}
              >
                {importing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Import Contacts
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Trash2, MessageSquare, Mail, Phone, RotateCcw } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { format } from 'date-fns';

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
  isRead?: boolean;
}

const AdminContacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadContacts();
  }, [navigate]);

  const loadContacts = async () => {
    const querySnapshot = await getDocs(collection(db, "contact_requests"));
    const contactsList = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as ContactRequest;
    });
    // Sort by date descending
    contactsList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setContacts(contactsList);
  };

  const handleView = async (contact: ContactRequest) => {
    if (!contact.isRead) {
      await updateDoc(doc(db, "contact_requests", contact.id), { isRead: true });
      loadContacts();
    }
    setSelectedContact(contact);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact request?')) {
      await deleteDoc(doc(db, "contact_requests", id));
      loadContacts();
      toast({ title: 'Contact request deleted' });
    }
  };

  const handleLoadDefaults = async () => {
    if (!confirm('This will add sample contact requests. Continue?')) return;
    
    const sampleContacts = [
      { name: "Rahul Gupta", email: "rahul@example.com", phone: "+91 9876543210", message: "I would like to book an appointment for LASIK consultation.", createdAt: new Date(), isRead: false },
      { name: "Priya Singh", email: "priya@example.com", phone: "+91 8765432109", message: "Do you offer pediatric eye care services?", createdAt: new Date(Date.now() - 86400000), isRead: true },
    ];

    try {
      await Promise.all(sampleContacts.map(c => addDoc(collection(db, "contact_requests"), c)));
      toast({ title: 'Sample contacts added' });
      loadContacts();
    } catch (error) {
      console.error("Error loading defaults:", error);
      toast({ title: 'Error adding samples', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Requests</h1>
            <p className="text-muted-foreground">View and manage contact form submissions</p>
          </div>
          <Button variant="outline" onClick={handleLoadDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" /> Load Defaults
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Contacts ({contacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className={!contact.isRead ? 'bg-primary/5' : ''}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {contact.isRead ? (
                        <Badge variant="secondary">Read</Badge>
                      ) : (
                        <Badge className="bg-primary text-primary-foreground">New</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(contact)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {contacts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No contact requests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Request Details</DialogTitle>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="p-3 bg-muted rounded-lg mt-1">{selectedContact.message}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Received</p>
                  <p className="font-medium">
                    {format(new Date(selectedContact.createdAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminContacts;

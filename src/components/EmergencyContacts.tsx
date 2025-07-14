import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, MessageSquare, Plus, X, Edit, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  priority: number
  canCall: boolean
  canText: boolean
}

interface EmergencyContactsProps {
  onContactsChange?: (contacts: EmergencyContact[]) => void
  maxContacts?: number
}

export function EmergencyContacts({ onContactsChange, maxContacts = 5 }: EmergencyContactsProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Emergency Services",
      phone: "911",
      relationship: "Emergency",
      priority: 1,
      canCall: true,
      canText: false
    }
  ])
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "friend"
  })
  
  const { toast } = useToast()
  const { t } = useTranslation()

  const relationshipOptions = [
    { value: "family", label: "Family Member" },
    { value: "friend", label: "Friend" },
    { value: "partner", label: "Partner/Spouse" },
    { value: "colleague", label: "Colleague" },
    { value: "neighbor", label: "Neighbor" },
    { value: "counselor", label: "Counselor/Therapist" },
    { value: "lawyer", label: "Lawyer" },
    { value: "doctor", label: "Doctor" },
    { value: "other", label: "Other" }
  ]

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        title: "⚠️ Invalid Contact",
        description: "Please enter both name and phone number",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (contacts.length >= maxContacts) {
      toast({
        title: "⚠️ Contact Limit Reached",
        description: `Maximum ${maxContacts} contacts allowed`,
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
      relationship: newContact.relationship,
      priority: contacts.length + 1,
      canCall: true,
      canText: true
    }

    const updatedContacts = [...contacts, contact]
    setContacts(updatedContacts)
    onContactsChange?.(updatedContacts)
    
    setNewContact({ name: "", phone: "", relationship: "friend" })
    
    toast({
      title: "✅ Contact Added",
      description: `${contact.name} has been added to emergency contacts`,
      duration: 3000,
    })
  }

  const removeContact = (id: string) => {
    const contact = contacts.find(c => c.id === id)
    if (contact?.priority === 1) {
      toast({
        title: "⚠️ Cannot Remove",
        description: "Emergency services contact cannot be removed",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const updatedContacts = contacts.filter(c => c.id !== id)
    setContacts(updatedContacts)
    onContactsChange?.(updatedContacts)
    
    toast({
      title: "🗑️ Contact Removed",
      description: "Emergency contact has been removed",
      duration: 3000,
    })
  }

  const callContact = (contact: EmergencyContact) => {
    if (!contact.canCall) return
    
    // In a real app, this would initiate a phone call
    window.location.href = `tel:${contact.phone}`
    
    toast({
      title: "📞 Calling...",
      description: `Calling ${contact.name}`,
      duration: 3000,
    })
  }

  const textContact = (contact: EmergencyContact) => {
    if (!contact.canText) return
    
    const message = "This is an emergency. I need help. Please check on me."
    
    // In a real app, this would send an SMS
    window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(message)}`
    
    toast({
      title: "💬 Sending Message...",
      description: `Sending emergency text to ${contact.name}`,
      duration: 3000,
    })
  }

  const notifyAllContacts = () => {
    const callableContacts = contacts.filter(c => c.canCall && c.priority > 1)
    
    if (callableContacts.length === 0) {
      toast({
        title: "⚠️ No Contacts Available",
        description: "Please add emergency contacts first",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Simulate notifying all contacts
    callableContacts.forEach((contact, index) => {
      setTimeout(() => {
        toast({
          title: "📱 Notifying Contact",
          description: `Alerting ${contact.name}...`,
          duration: 2000,
        })
      }, index * 1000)
    })

    toast({
      title: "🚨 Emergency Alert Sent",
      description: `Notifying ${callableContacts.length} emergency contacts`,
      duration: 5000,
    })
  }

  const formatPhoneNumber = (phone: string): string => {
    // Simple phone number formatting
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contacts ({contacts.length}/{maxContacts})
          </div>
          {contacts.length > 1 && (
            <Button
              onClick={notifyAllContacts}
              variant="destructive"
              size="sm"
            >
              🚨 Alert All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Contact List */}
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3 border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{contact.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {contact.relationship}
                    </Badge>
                    {contact.priority === 1 && (
                      <Badge variant="destructive" className="text-xs">
                        Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatPhoneNumber(contact.phone)}
                  </p>
                </div>
                
                {contact.priority > 1 && (
                  <Button
                    onClick={() => removeContact(contact.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {contact.canCall && (
                  <Button
                    onClick={() => callContact(contact)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
                
                {contact.canText && contact.priority > 1 && (
                  <Button
                    onClick={() => textContact(contact)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Text
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Contact */}
        {contacts.length < maxContacts && (
          <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Emergency Contact
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="contact-name" className="text-xs">Name</Label>
                <Input
                  id="contact-name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contact name"
                  className="h-8"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-phone" className="text-xs">Phone Number</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                  className="h-8"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-relationship" className="text-xs">Relationship</Label>
                <Select
                  value={newContact.relationship}
                  onValueChange={(value) => setNewContact(prev => ({ ...prev, relationship: value }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={addContact} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <p>Emergency contacts will be notified when you use the SOS feature or safety timer expires. Keep this list updated with people who can help you in an emergency.</p>
        </div>
      </CardContent>
    </Card>
  )
}
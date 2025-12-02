import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { TagAutocomplete } from "@/components/TagAutocomplete";
import { useState } from "react";

interface ContactFormProps {
  formData: {
    name: string;
    title: string;
    phone: string;
    phones: string[];
    email: string;
    emails: string[];
    website: string;
    platform: "whatsapp" | "telegram" | "signal" | "multiple";
    status: "active" | "past" | "prospect" | "lead";
    tags: string;
    notes: string;
    avatarUrl: string;
  };
  setFormData: (data: any) => void;
  newPhone: string;
  setNewPhone: (value: string) => void;
  newEmail: string;
  setNewEmail: (value: string) => void;
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
}

export default function ContactFormEnhanced({
  formData,
  setFormData,
  newPhone,
  setNewPhone,
  newEmail,
  setNewEmail,
  onAddPhone,
  onRemovePhone,
  onAddEmail,
  onRemoveEmail,
}: ContactFormProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, avatarUrl: base64 });
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert("Failed to read image");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Failed to upload image");
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Profile Image */}
      <div>
        <label className="text-sm font-medium block mb-2">Profile Image</label>
        <div className="flex items-center gap-4">
          {formData.avatarUrl ? (
            <div className="relative">
              <img
                src={formData.avatarUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, avatarUrl: "" })}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="avatar-upload"
              disabled={uploadingImage}
            />
            <label
              htmlFor="avatar-upload"
              className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm"
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Max 5MB. JPG, PNG, or GIF.
            </p>
          </div>
        </div>
      </div>
      {/* Name & Title */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg mt-1"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Title/Role</label>
          <select
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg mt-1"
          >
            <option value="">Select Title</option>
            <option value="CEO">CEO</option>
            <option value="CTO">CTO</option>
            <option value="CFO">CFO</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="Hostess">Hostess</option>
            <option value="Photographer">Photographer</option>
            <option value="Coordinator">Event Coordinator</option>
            <option value="Assistant">Assistant</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Primary Phone & Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Primary Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg mt-1"
            placeholder="+1234567890"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Primary Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg mt-1"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Additional Phones */}
      <div>
        <label className="text-sm font-medium">Additional Phone Numbers</label>
        <div className="space-y-2 mt-1">
          {formData.phones.map((phone, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={phone}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-muted"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemovePhone(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddPhone()}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="+1234567890"
            />
            <Button variant="outline" size="sm" onClick={onAddPhone}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Emails */}
      <div>
        <label className="text-sm font-medium">Additional Email Addresses</label>
        <div className="space-y-2 mt-1">
          {formData.emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={email}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-muted"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveEmail(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddEmail()}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="email@example.com"
            />
            <Button variant="outline" size="sm" onClick={onAddEmail}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="text-sm font-medium">Website</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg mt-1"
          placeholder="https://example.com"
        />
      </div>

      {/* Platform & Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Platform</label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
            className="w-full px-4 py-2 border rounded-lg mt-1"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="signal">Signal</option>
            <option value="multiple">Multiple</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-2 border rounded-lg mt-1"
          >
            <option value="prospect">Prospect</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium mb-2 block">Tags</label>
        <TagAutocomplete
          value={formData.tags}
          onChange={(value) => setFormData({ ...formData, tags: value })}
          placeholder="Type to search or add tags..."
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg mt-1 min-h-[100px]"
          placeholder="Additional notes about this contact..."
        />
      </div>
    </div>
  );
}

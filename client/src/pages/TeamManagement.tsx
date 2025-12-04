import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { 
  getClientByClerkId, 
  getTeamMembers, 
  inviteTeamMember, 
  updateTeamMemberRole,
  removeTeamMember,
  type TeamMember 
} from '@/lib/supabase';
import {
  UserPlus,
  Mail,
  Shield,
  Eye,
  CreditCard,
  Crown,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function TeamManagement() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'billing' | 'viewer'>('viewer');
  const [tenantId, setTenantId] = useState<string>('');

  useEffect(() => {
    loadTeamMembers();
  }, [user]);

  const loadTeamMembers = async () => {
    if (!user) return;

    try {
      const client = await getClientByClerkId(user.id);
      if (!client) {
        toast.error('Client not found');
        return;
      }

      setTenantId(client.tenant_id);
      const members = await getTeamMembers(client.tenant_id);
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !tenantId) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const client = await getClientByClerkId(user!.id);
      if (!client) return;

      await inviteTeamMember({
        client_id: client.id,
        tenant_id: tenantId,
        clerk_user_id: '', // Will be filled when they accept
        email: inviteEmail,
        role: inviteRole,
        status: 'invited',
        invited_by: user!.id,
      });

      toast.success('Invitation sent! 📧');
      setShowInviteModal(false);
      setInviteEmail('');
      loadTeamMembers();
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Failed to send invitation');
    }
  };

  const handleRoleChange = async (memberId: string, newRole: TeamMember['role']) => {
    try {
      await updateTeamMemberRole(memberId, newRole);
      toast.success('Role updated successfully');
      loadTeamMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      await removeTeamMember(memberId);
      toast.success('Team member removed');
      loadTeamMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove team member');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Team Management</h1>
            <p className="text-gray-400">Manage your organization's team members and roles</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInviteModal(true)}
            className="cta-amber px-6 py-3 flex items-center gap-2"
          >
            <UserPlus size={20} />
            Invite Member
          </motion.button>
        </div>

        {/* Team Members List */}
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="luxury-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xl">
                  {member.name?.[0] || member.email[0].toUpperCase()}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">
                      {member.name || member.email}
                    </h3>
                    {member.role === 'owner' && (
                      <Crown size={16} className="text-[#D4AF37]" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{member.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.status === 'active' 
                        ? 'bg-[#10B981]20 text-[#10B981]'
                        : 'bg-[#F59E0B]20 text-[#F59E0B]'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role & Actions */}
              <div className="flex items-center gap-4">
                {member.role === 'owner' ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37]20 border border-[#D4AF37]">
                    <Crown size={16} className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-semibold">Owner</span>
                  </div>
                ) : (
                  <>
                    <RoleDropdown
                      currentRole={member.role}
                      onChange={(newRole) => handleRoleChange(member.id, newRole)}
                    />

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(member.id)}
                      className="p-2 rounded-lg bg-[#DC2626]20 text-[#DC2626] hover:bg-[#DC2626]30 transition-colors"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {teamMembers.length === 0 && (
          <div className="text-center py-16">
            <UserPlus size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No team members yet</h3>
            <p className="text-gray-400 mb-6">Invite your team to collaborate on luxury events</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInviteModal(true)}
              className="cta-amber px-6 py-3"
            >
              Invite Your First Member
            </motion.button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          email={inviteEmail}
          role={inviteRole}
          onEmailChange={setInviteEmail}
          onRoleChange={setInviteRole}
          onInvite={handleInvite}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

function RoleDropdown({ 
  currentRole, 
  onChange 
}: { 
  currentRole: TeamMember['role']; 
  onChange: (role: TeamMember['role']) => void;
}) {
  const roles = [
    { value: 'admin', label: 'Admin', icon: Shield, color: '#8B5CF6' },
    { value: 'billing', label: 'Billing', icon: CreditCard, color: '#10B981' },
    { value: 'viewer', label: 'Viewer', icon: Eye, color: '#F59E0B' },
  ];

  const currentRoleData = roles.find(r => r.value === currentRole);

  return (
    <select
      value={currentRole}
      onChange={(e) => onChange(e.target.value as TeamMember['role'])}
      className="px-4 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-white cursor-pointer hover:border-[#D4AF37] transition-colors"
      style={{ color: currentRoleData?.color }}
    >
      {roles.map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
}

function InviteModal({
  email,
  role,
  onEmailChange,
  onRoleChange,
  onInvite,
  onClose,
}: {
  email: string;
  role: 'admin' | 'billing' | 'viewer';
  onEmailChange: (email: string) => void;
  onRoleChange: (role: 'admin' | 'billing' | 'viewer') => void;
  onInvite: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="luxury-card-gold max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border border-black/30 focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="space-y-2">
              {[
                { value: 'admin', label: 'Admin', desc: 'Manage team and settings', icon: Shield },
                { value: 'billing', label: 'Billing', desc: 'View invoices and payments', icon: CreditCard },
                { value: 'viewer', label: 'Viewer', desc: 'Read-only access', icon: Eye },
              ].map((roleOption) => (
                <label
                  key={roleOption.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    role === roleOption.value
                      ? 'border-black bg-black/20'
                      : 'border-black/20 hover:border-black/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={role === roleOption.value}
                    onChange={(e) => onRoleChange(e.target.value as any)}
                    className="sr-only"
                  />
                  <roleOption.icon size={20} />
                  <div className="flex-1">
                    <div className="font-semibold">{roleOption.label}</div>
                    <div className="text-sm opacity-70">{roleOption.desc}</div>
                  </div>
                  {role === roleOption.value && <Check size={20} />}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInvite}
              className="flex-1 px-6 py-3 rounded-lg bg-black text-[#D4AF37] font-bold hover:bg-black/90 transition-colors"
            >
              Send Invite
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

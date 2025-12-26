import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import caseService, { type Case } from "../../services/caseService";

interface OutletContextType {
  caseData: Case;
  setCaseData: React.Dispatch<React.SetStateAction<Case | null>>;
}

const CaseSettings: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { caseData, setCaseData } = useOutletContext<OutletContextType>();

    const [formState, setFormState] = useState({
        title: "",
        description: "",
        status: "",
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false
    });

    const [saving, setSaving] = useState(false);
    const [teamMembers, setTeamMembers] = useState<any[]>([]); 
    
    // Add Member Modal State
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("Member");
    const [addingMember, setAddingMember] = useState(false);

    useEffect(() => {
        if (caseData) {
            setFormState({
                title: caseData.title || "",
                description: caseData.description || "",
                status: caseData.status || "Open",
            });
            if (caseData.settings?.notifications) {
                setNotifications(caseData.settings.notifications);
            }
            
            // Map real team members
            if (caseData.teamMembers && caseData.teamMembers.length > 0) {
                 const mappedMembers = caseData.teamMembers.map((tm: any) => ({
                     id: tm.userId?._id || tm._id, // Handle populated vs unpopulated
                     userId: tm.userId?._id,
                     name: tm.userId ? `${tm.userId.firstName} ${tm.userId.lastName}` : "Unknown User",
                     role: tm.role || "Member",
                     email: tm.userId?.email,
                     // Use a placeholder if no image available (backend doesn't store user images yet)
                     img: "https://ui-avatars.com/api/?name=" + (tm.userId ? `${tm.userId.firstName}+${tm.userId.lastName}` : "User") + "&background=random"
                 }));
                 setTeamMembers(mappedMembers);
            } else {
                 setTeamMembers([]);
            }
        }
    }, [caseData]);

    const handleGeneralSave = async () => {
        if (!id) return;
        setSaving(true);
        try {
            const updatedCase = await caseService.updateCaseSettings(id, {
                title: formState.title,
                description: formState.description,
                status: formState.status
            });
            setCaseData(updatedCase); 
            alert("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const toggleNotification = async (type: 'email' | 'sms') => {
        if (!id) return;
        const newNotifs = { ...notifications, [type]: !notifications[type] };
        setNotifications(newNotifs); 
        
        try {
            const updatedCase = await caseService.updateCaseSettings(id, {
                notifications: newNotifs
            });
            setCaseData(updatedCase);
        } catch (error) {
            console.error(error);
            alert("Failed to update notification settings");
            setNotifications(notifications); 
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newMemberEmail) return;
        setAddingMember(true);
        try {
            // First validate/check existence (optional, addTeamMember does it too)
            // Call add directly
            await caseService.addTeamMember(id, newMemberEmail, newMemberRole);
            
            // Refresh case data to show new member
            const updatedCase = await caseService.getCaseById(id);
            setCaseData(updatedCase);
            
            setNewMemberEmail("");
            setShowAddMember(false);
            alert("Team member added successfully!");
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                 alert("User not found. Please ensure the email is registered on the portal.");
            } else if (error.response && error.response.status === 400) {
                 alert(error.response.data.message || "Cannot add this user.");
            } else {
                 alert("Failed to add team member.");
            }
        } finally {
            setAddingMember(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!id) return;
        if (confirm("Are you sure you want to remove this team member?")) {
            try {
                await caseService.removeTeamMember(id, userId);
                 // Refresh case data
                 const updatedCase = await caseService.getCaseById(id);
                 setCaseData(updatedCase);
                 alert("Team member removed.");
            } catch (error) {
                console.error(error);
                alert("Failed to remove team member.");
            }
        }
    };

    const handleDeleteCase = async () => {
        if (!id) return;
        if (confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
             try {
                 await caseService.deleteCase(id);
                 alert("Case deleted successfully.");
                 navigate('/portal/cases');
             } catch (error) {
                 console.error(error);
                 alert("Failed to delete case.");
             }
        }
    };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">General Settings</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Case Name
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) => setFormState({...formState, title: e.target.value})}
                className="block w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Case Description
              </label>
              <textarea
                value={formState.description}
                onChange={(e) => setFormState({...formState, description: e.target.value})}
                rows={3}
                className="block w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-1">
                  Status
                </label>
                <span className="text-xs text-slate-500">
                  Current state of the legal matter
                </span>
              </div>
              <select
                value={formState.status}
                onChange={(e) => setFormState({...formState, status: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Paused">Paused</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={handleGeneralSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Email Updates</h4>
                <p className="text-xs text-slate-500">Receive emails about new documents and messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.email}
                  onChange={() => toggleNotification('email')}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {/* SMS */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">SMS Alerts</h4>
                <p className="text-xs text-slate-500">Get text messages for urgent deadlines</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifications.sms}
                    onChange={() => toggleNotification('sms')}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Team Management</h3>
            <button
              className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors"
              onClick={() => setShowAddMember(!showAddMember)}
            >
              {showAddMember ? "Cancel" : "+ Add Member"}
            </button>
          </div>
          
          {/* Add Member Form */}
          {showAddMember && (
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                  <form onSubmit={handleAddMember} className="flex gap-3 items-end">
                      <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            placeholder="colleague@lawfirm.com"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                          />
                      </div>
                      <div className="w-32">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                          <select 
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none bg-white"
                          >
                              <option value="Co-Counsel">Co-Counsel</option>
                              <option value="Paralegal">Paralegal</option>
                              <option value="Associate">Associate</option>
                              <option value="Staff">Staff</option>
                              <option value="Member">Member</option>
                          </select>
                      </div>
                      <button 
                        type="submit"
                        disabled={addingMember}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50"
                      >
                          {addingMember ? "Adding..." : "Add"}
                      </button>
                  </form>
              </div>
          )}

          <div className="divide-y divide-slate-100">
            {teamMembers.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                    No team members added yet.
                </div>
            ) : (
                teamMembers.map((member) => (
                <div
                    key={member.id}
                    className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                    <img
                        src={member.img}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover bg-slate-200"
                    />
                    <div>
                        <p className="text-sm font-bold text-slate-900">
                        {member.name}
                        </p>
                        <div className="flex items-center mt-0.5">
                            <span className="text-xs text-slate-500">{member.role}</span>
                            <span className="text-xs text-slate-400 mx-2">•</span>
                            <span className="text-xs text-slate-400">{member.email}</span>
                        </div>
                    </div>
                    </div>
                    <button
                    className="text-slate-400 hover:text-red-600 text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemoveMember(member.userId)} // userId is the reference ID
                    >
                    Remove
                    </button>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-xl border border-red-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-red-700">Delete Case</h3>
            <p className="text-sm text-red-600/80 mt-1">
              This action cannot be undone. All documents and messages will be
              permanently removed.
            </p>
          </div>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors text-sm whitespace-nowrap"
            onClick={handleDeleteCase}
          >
            Delete Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseSettings;

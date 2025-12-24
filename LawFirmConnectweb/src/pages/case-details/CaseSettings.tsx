import React from "react";
import { useOutletContext } from "react-router-dom";

interface CaseData {
  title: string;
  description: string;
  status: string;
}

const CaseSettings: React.FC = () => {
  // @ts-ignore
  const { caseData } = useOutletContext<{ caseData: CaseData }>();

  const [teamMembers, setTeamMembers] = React.useState([
    {
      id: 1,
      name: "Jane Doe",
      role: "Lead Attorney",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
      id: 2,
      name: "John Smith",
      role: "Paralegal",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
      id: 3,
      name: "Sarah Connor",
      role: "Junior Associate",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100",
    },
  ]);

  const ROLES = [
    "Lead Attorney",
    "Attorney",
    "Co-Counsel",
    "Paralegal",
    "Junior Associate",
    "Legal Secretary",
    "Staff",
  ];

  const handleRoleChange = (memberId: number, newRole: string) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  const handleRemoveMember = (memberId: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
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
                defaultValue={caseData?.title}
                className="block w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Case Description
              </label>
              <textarea
                defaultValue={caseData?.description}
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
                defaultValue={caseData?.status}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                onChange={(e) => alert(`Status changed to: ${e.target.value}`)}
              >
                <option value="Open">Open</option>
                <option value="Pending">Pending Review</option>
                <option value="OnHold">On Hold</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors text-sm">
                Save Changes
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
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Email Updates
                </h4>
                <p className="text-xs text-slate-500">
                  Receive emails about new documents and messages
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">SMS Alerts</h4>
                <p className="text-xs text-slate-500">
                  Get text messages for urgent deadlines
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
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
              onClick={() => alert("Add Member Modal would open here")}
            >
              + Add Member
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {member.name}
                    </p>
                    <div className="flex items-center mt-0.5">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.id, e.target.value)
                        }
                        className="text-xs text-slate-500 bg-transparent border-0 p-0 pr-6 focus:ring-0 cursor-pointer hover:text-blue-600 focus:text-blue-600 outline-none -ml-0.5"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  className="text-slate-400 hover:text-red-600 text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </button>
              </div>
            ))}
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
            onClick={() =>
              alert(
                "Are you sure you want to delete this case? This action is irreversible."
              )
            }
          >
            Delete Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseSettings;

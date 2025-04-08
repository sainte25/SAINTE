import { useQuery } from "@tanstack/react-query";
import { CareTeamMember } from "@shared/schema";

export default function CareTeam() {
  // Fetch care team members
  const { data: careTeam, isLoading } = useQuery<CareTeamMember[]>({
    queryKey: ['/api/care-team'],
  });

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold">Your Care Team</h2>
        <button className="text-sm text-primary-600 hover:text-primary-800 transition-all">View All</button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-4 text-center text-neutral-500">Loading your care team...</div>
        ) : careTeam && careTeam.length > 0 ? (
          careTeam.map((member) => (
            <div key={member.id} className="flex items-center p-3 bg-white rounded-lg border border-neutral-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                <span>{member.teamMemberInitials}</span>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">{member.teamMemberName}</h3>
                <p className="text-sm text-neutral-500">{member.teamMemberRole}</p>
              </div>
              <div className="flex space-x-2">
                {member.contactPhone && (
                  <a 
                    href={`tel:${member.contactPhone}`}
                    className="p-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </a>
                )}
                {member.contactEmail && (
                  <a 
                    href={`mailto:${member.contactEmail}`}
                    className="p-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-neutral-500">No care team members assigned yet.</div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <button className="w-full py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all">
          Message Care Team
        </button>
      </div>
    </div>
  );
}

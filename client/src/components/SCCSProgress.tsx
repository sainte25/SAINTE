import { useQuery } from "@tanstack/react-query";
import { SccsScore } from "@shared/schema";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function SCCSProgress() {
  // Fetch SCCS progress data
  const { data: sccsData, isLoading } = useQuery<SccsScore>({
    queryKey: ['/api/sccs/current'],
  });

  // Calculate circle stroke offset based on score
  const calculateStrokeDashoffset = (score: number) => {
    const maxScore = 1000; // Assuming max score is 1000
    const circumference = 2 * Math.PI * 40; // Circle radius is 40
    const percentage = score / maxScore;
    return circumference - (circumference * percentage);
  };

  // Get tier based on score
  const getTier = (score: number | undefined) => {
    if (!score) return "Bronze";
    
    if (score >= 800) return "Gold";
    if (score >= 600) return "Silver";
    return "Bronze";
  };

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold">Social Capital Credit Score</h2>
        <div className="tooltip">
          <button className="text-neutral-400 hover:text-neutral-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="tooltip-text">Your SCCS score reflects your growth journey. It measures consistency, not perfection.</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="col-span-1 flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-neutral-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
              {!isLoading && sccsData && (
                <circle 
                  className="text-primary-500 progress-ring-circle" 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={calculateStrokeDashoffset(sccsData.score)} 
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">{isLoading ? "..." : sccsData?.score || 0}</span>
              <span className="text-sm text-neutral-500">{getTier(sccsData?.score)} Tier</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-neutral-700">Recent Growth</p>
            <p className="text-primary-600 flex items-center justify-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +28 this week
            </p>
          </div>
        </div>
        
        <div className="col-span-2">
          <h3 className="text-lg font-medium mb-3">Score Breakdown</h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-4 text-center text-neutral-500">Loading score breakdown...</div>
            ) : sccsData ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700">Consistency</span>
                    <span className="text-sm font-medium text-primary-700">{sccsData.consistency}/30</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(sccsData.consistency / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700">Engagement</span>
                    <span className="text-sm font-medium text-primary-700">{sccsData.engagement}/30</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(sccsData.engagement / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700">Milestones</span>
                    <span className="text-sm font-medium text-primary-700">{sccsData.milestones}/30</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(sccsData.milestones / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700">Peer Support</span>
                    <span className="text-sm font-medium text-primary-700">{sccsData.peerSupport}/30</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(sccsData.peerSupport / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-4 text-center text-neutral-500">No score data available.</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <div className="flex items-start">
          <div className="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-primary-800">Growth Insight</h3>
            <div className="mt-1 text-sm text-primary-600">
              <p>Your consistency is excellent. Have you considered sharing your journey with others in the peer support group? This could boost your peer support score.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <Link href="/sccs">
          <a className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm">
            View Full Report & Leaderboard
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
    </div>
  );
}

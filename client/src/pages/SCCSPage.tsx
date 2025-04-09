import React from "react";
import SCCSReport from "@/components/SCCSReport";
import SCCSLeaderboard from "@/components/SCCSLeaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SCCSPage() {
  return (
    <div className="container max-w-6xl mx-auto p-4 pt-8">
      <div className="mb-6">
        <Link href="/">
          <a className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </a>
        </Link>
        <h1 className="text-3xl font-heading font-bold">Social Capital Credit Score</h1>
        <p className="text-gray-500 mt-1">
          View your detailed SCCS report and community leaderboard
        </p>
      </div>

      <Tabs defaultValue="report" className="mb-16">
        <TabsList className="mb-4">
          <TabsTrigger value="report">SCCS Report</TabsTrigger>
          <TabsTrigger value="leaderboard">Community Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <SCCSReport />
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SCCSLeaderboard />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">About the Leaderboard</h3>
                <p className="text-gray-600 mb-4">
                  The SCCS Leaderboard shows how your Social Capital Credit Score compares to others 
                  across the United States. This gamified system is designed to motivate positive 
                  engagement with your community and support network.
                </p>
                
                <h4 className="font-medium text-lg mt-6 mb-2">Tier System</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                    <span className="font-medium">Platinum</span>
                    <span className="text-sm text-gray-500 ml-auto">90-100 points</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-400 mr-2"></div>
                    <span className="font-medium">Gold</span>
                    <span className="text-sm text-gray-500 ml-auto">80-89 points</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                    <span className="font-medium">Silver</span>
                    <span className="text-sm text-gray-500 ml-auto">60-79 points</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-700 mr-2"></div>
                    <span className="font-medium">Bronze</span>
                    <span className="text-sm text-gray-500 ml-auto">0-59 points</span>
                  </div>
                </div>
                
                <h4 className="font-medium text-lg mt-6 mb-2">How to Improve</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Attend community events and workshops</li>
                  <li>Complete your daily steps consistently</li>
                  <li>Engage with your peer support network</li>
                  <li>Achieve personal milestones in your journey</li>
                  <li>Participate in community service opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
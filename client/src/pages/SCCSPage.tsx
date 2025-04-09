import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SCCSReport from "@/components/sccs/SCCSReport";
import SCCSLeaderboard from "@/components/sccs/SCCSLeaderboard";
import Layout from "@/components/Layout";
import { ArrowLeft, Award, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { User } from "@shared/schema";

export default function SCCSPage() {
  const { data: userData } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  const [activeTab, setActiveTab] = useState("report");

  return (
    <Layout userData={userData}>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Social Capital Credit Score</h1>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="report" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                SCCS Report
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Leaderboard
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              {activeTab === "report" ? 
                "View your detailed credit score report and progress" : 
                "See how you compare to others in the community"}
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          <TabsContent value="report" className="mt-0">
            <SCCSReport />
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-0">
            <SCCSLeaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import HomePage from "./HomePage";
import GoalsPage from "./GoalsPage";
import ChatPage from "./ChatPage";
import ResourcesPage from "./ResourcesPage";
import ProfilePage from "./ProfilePage";
import MoodLogPage from "./MoodLogPage";
import CareTeamPage from "./CareTeamPage";

export default function MobileIndex() {
  const [location, setLocation] = useLocation();
  
  // Redirect to home page if accessing the root mobile route
  useEffect(() => {
    if (location === "/mobile") {
      // We're at /mobile, which is the correct index route
    } else if (location === "/mobile/") {
      // Normalize by removing trailing slash
      setLocation("/mobile");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/mobile" component={HomePage} />
      <Route path="/mobile/goals" component={GoalsPage} />
      <Route path="/mobile/chat" component={ChatPage} />
      <Route path="/mobile/care-team" component={CareTeamPage} />
      <Route path="/mobile/resources" component={ResourcesPage} />
      <Route path="/mobile/profile" component={ProfilePage} />
      <Route path="/mobile/mood" component={MoodLogPage} />
      {/* Fallback route - redirect to mobile home */}
      <Route>
        {() => {
          // Only redirect if we're under /mobile/ but not matching any specific route
          if (location.startsWith("/mobile/")) {
            setLocation("/mobile");
          }
          return null;
        }}
      </Route>
    </Switch>
  );
}
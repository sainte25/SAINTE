import { db } from "./db";
import * as schema from "@shared/schema";
import { UserRole } from "@shared/schema";

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Check if we already have a user
    const existingUsers = await db.select().from(schema.users);
    
    if (existingUsers.length > 0) {
      console.log("Database already has users, skipping seed operation");
      return;
    }

    // Create a default user
    const [user] = await db.insert(schema.users).values({
      username: "jsmith",
      password: "password123", // In a real app, this would be hashed
      firstName: "James",
      lastName: "Smith",
      email: "james.smith@example.com",
      phone: "555-123-4567",
      role: "client" as UserRole,
      avatarInitials: "JS",
      tier: "silver",
      organization: null,
      organizationType: null, 
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log(`Created user: ${user.firstName} ${user.lastName} (ID: ${user.id})`);

    // Add SCCS score
    const today = new Date().toISOString().split('T')[0];
    const [sccsScore] = await db.insert(schema.sccsScores).values({
      date: today,
      userId: user.id,
      score: 73,
      level: 2,
      description: "Building consistent social capital through regular participation and engagement.",
      createdAt: new Date()
    }).returning();

    console.log(`Added SCCS score for user: ${sccsScore.score}`);

    // Add daily steps
    const dailyStepsData = [
      {
        userId: user.id,
        title: "Apply for the warehouse position at FlexLogistics",
        description: "Complete online application and upload resume",
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      },
      {
        userId: user.id,
        title: "Attend recovery support group meeting",
        description: "Downtown Community Center at 6:30 PM",
        completed: true,
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      },
      {
        userId: user.id,
        title: "Schedule doctor's appointment for medication review",
        description: "Call Dr. Wilson's office at 555-789-0123",
        completed: false,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        createdAt: new Date()
      }
    ];

    const dailySteps = await db.insert(schema.dailySteps).values(dailyStepsData).returning();
    console.log(`Added ${dailySteps.length} daily steps`);

    // Add mood entries
    const moodData = [
      {
        date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], // 4 days ago
        userId: user.id,
        mood: "good",
        emoji: "😊",
        notes: "Work interview went well today",
        createdAt: new Date(Date.now() - 4 * 86400000)
      },
      {
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], // 3 days ago
        userId: user.id,
        mood: "okay",
        emoji: "😐",
        notes: "Dealing with housing paperwork stress",
        createdAt: new Date(Date.now() - 3 * 86400000)
      },
      {
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // 2 days ago
        userId: user.id,
        mood: "great",
        emoji: "😁",
        notes: "Got approved for the apartment!",
        createdAt: new Date(Date.now() - 2 * 86400000)
      },
      {
        date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // 1 day ago
        userId: user.id,
        mood: "low",
        emoji: "😔",
        notes: "Missing family today",
        createdAt: new Date(Date.now() - 1 * 86400000)
      },
      {
        date: new Date().toISOString().split('T')[0], // Today
        userId: user.id,
        mood: "good",
        emoji: "😊",
        notes: "Starting to feel settled in the new community",
        createdAt: new Date()
      }
    ];

    const moods = await db.insert(schema.moods).values(moodData).returning();
    console.log(`Added ${moods.length} mood entries`);

    // Add upcoming events
    const eventsData = [
      {
        userId: user.id,
        title: "Job Skills Workshop",
        description: "Resume building and interview techniques",
        date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // 2 days from now
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        location: "Community Resource Center, Room 204",
        status: "registered",
        createdAt: new Date()
      },
      {
        userId: user.id,
        title: "Housing Rights Seminar",
        description: "Learn about tenant rights and available housing assistance programs",
        date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], // 5 days from now
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        location: "Public Library, 3rd Floor Meeting Room",
        status: "invited",
        createdAt: new Date()
      },
      {
        userId: user.id,
        title: "Community Health Fair",
        description: "Free health screenings and wellness resources",
        date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // 7 days from now
        startTime: "9:00 AM",
        endTime: "3:00 PM",
        location: "Downtown Park",
        status: "interested",
        createdAt: new Date()
      }
    ];

    const events = await db.insert(schema.events).values(eventsData).returning();
    console.log(`Added ${events.length} upcoming events`);

    // Add care team members
    const careTeamData = [
      {
        userId: user.id,
        teamMemberName: "Sarah Johnson",
        teamMemberRole: "case_manager",
        teamMemberInitials: "SJ",
        contactEmail: "sjohnson@example.org",
        contactPhone: "555-876-5432",
        createdAt: new Date()
      },
      {
        userId: user.id,
        teamMemberName: "Miguel Rodriguez",
        teamMemberRole: "peer_mentor",
        teamMemberInitials: "MR",
        contactEmail: "mrodriguez@example.org",
        contactPhone: "555-234-5678",
        createdAt: new Date()
      },
      {
        userId: user.id,
        teamMemberName: "Dr. Lisa Chen",
        teamMemberRole: "primary_care_provider",
        teamMemberInitials: "LC",
        contactEmail: "lchen@example.org",
        contactPhone: "555-345-6789",
        createdAt: new Date()
      },
      {
        userId: user.id,
        teamMemberName: "David Washington",
        teamMemberRole: "community_health_worker",
        teamMemberInitials: "DW",
        contactEmail: "dwashington@example.org",
        contactPhone: "555-456-7890",
        createdAt: new Date()
      }
    ];

    const careTeam = await db.insert(schema.careTeamMembers).values(careTeamData).returning();
    console.log(`Added ${careTeam.length} care team members`);

    // Add resources
    const resourcesData = [
      {
        title: "Housing First Program Application",
        description: "Apply for stable, permanent housing with supportive services",
        category: "housing",
        url: "https://example.org/housing-first",
        readTime: "15 min",
        isFeatured: true,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      },
      {
        title: "Job Readiness Certificate Program",
        description: "Free 6-week program to build employment skills and earn certification",
        category: "employment",
        url: "https://example.org/job-readiness",
        readTime: "10 min",
        isFeatured: true,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      },
      {
        title: "Community Health Center Locations",
        description: "Find no-cost health services in your neighborhood",
        category: "health",
        url: "https://example.org/health-centers",
        readTime: "5 min",
        isFeatured: false,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      },
      {
        title: "Recovery Support Groups Schedule",
        description: "Weekly meetings for peer recovery support",
        category: "recovery",
        url: "https://example.org/recovery-groups",
        readTime: "5 min",
        isFeatured: false,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      },
      {
        title: "Legal Aid Clinic Hours",
        description: "Free legal assistance for housing, employment, and record expungement",
        category: "legal",
        url: "https://example.org/legal-aid",
        readTime: "8 min",
        isFeatured: true,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      }
    ];

    const resources = await db.insert(schema.resources).values(resourcesData).returning();
    console.log(`Added ${resources.length} resources`);

    // Bookmark some resources for the user
    const userResourcesData = [
      {
        userId: user.id,
        resourceId: resources[0].id,
        createdAt: new Date()
      },
      {
        userId: user.id,
        resourceId: resources[1].id,
        createdAt: new Date()
      }
    ];

    const userResources = await db.insert(schema.userResources).values(userResourcesData).returning();
    console.log(`Added ${userResources.length} bookmarked resources`);

    // Add AI chat messages
    const chatSessionId = "session-" + Date.now();
    const chatMessagesData = [
      {
        userId: user.id,
        chatSessionId: chatSessionId,
        role: "system",
        content: "I'm here to support you on your journey. How are you feeling today?",
        createdAt: new Date(Date.now() - 30 * 60000) // 30 minutes ago
      },
      {
        userId: user.id,
        chatSessionId: chatSessionId,
        role: "user",
        content: "I'm feeling a bit overwhelmed with all the paperwork for my new apartment.",
        createdAt: new Date(Date.now() - 29 * 60000) // 29 minutes ago
      },
      {
        userId: user.id,
        chatSessionId: chatSessionId,
        role: "system",
        content: "That's completely understandable. Moving and paperwork can be stressful. Have you tried breaking it down into smaller tasks? Maybe we can help create a checklist together.",
        createdAt: new Date(Date.now() - 28 * 60000) // 28 minutes ago
      }
    ];

    const chatMessages = await db.insert(schema.chatMessages).values(chatMessagesData).returning();
    console.log(`Added ${chatMessages.length} chat messages`);

    // Add AI insight
    const aiInsightData = {
      userId: user.id,
      insights: "James has been maintaining consistent progress in his recovery journey, with particular strengths in attending support groups and job seeking activities. Recent mood patterns show improvement with occasional stress around housing stability, which is expected given recent transitions.",
      strengthsIdentified: ["Consistent attendance at support groups", "Proactive job seeking", "Building new social connections"],
      suggestedResources: ["Housing stability workshop", "Stress management techniques"],
      createdAt: new Date()
    };

    const aiInsight = await db.insert(schema.aiInsights).values(aiInsightData).returning();
    console.log(`Added AI insight for user`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export { seedDatabase };
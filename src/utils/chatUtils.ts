
// Helper to sleep for ms milliseconds
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Maximum number of retries for overloaded API
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 2000; // 2 seconds

export type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

// Create formatted project context for AI
export const createProjectContext = (project: any) => {
  return project
    ? `
      Project Title: ${project.title}
      Description: ${project.description || "No description provided"}
      Created by: ${project.creator_name || "Unknown creator"}
      Tags: ${project.tag_names?.join(", ") || "No tags"}
    `
    : "No project information available";
};

// Create welcome message
export const getWelcomeMessage = (): Message => ({
  id: "welcome",
  content: "Hello! I'm your GenAI Gallery Guide. Ask me anything about this project or the CU Generative AI Showcase.",
  isUser: false,
});

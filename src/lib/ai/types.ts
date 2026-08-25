export type ToolId = "research" | "email" | "meeting";

export type ResearchDepth = "brief" | "standard" | "detailed";

export type EmailTone =
  | "professional"
  | "friendly"
  | "formal"
  | "casual"
  | "persuasive"
  | "apologetic";

export interface ResearchResult {
  title: string;
  summary: string;
  keyFindings: string[];
  importantPoints: string[];
  conclusion: string;
}

export interface EmailResult {
  subject: string;
  body: string;
}

export interface ActionItem {
  task: string;
  owner: string;
  due: string;
}

export interface MeetingResult {
  summary: string;
  discussionPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  deadlines: string[];
}

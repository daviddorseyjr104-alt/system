export type View =
  | 'dashboard'
  | 'ai'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'planning'
  | 'operations'
  | 'ecommerce'
  | 'retail'
  | 'prompts'
  | 'metrics'
  | 'wins'
  | 'brand'
  | 'settings';

export interface Prompt {
  id: string;
  title: string;
  department: string;
  departmentId: string;
  type: 'workflow' | 'template' | 'appendix';
  description: string;
  prompt: string;
  variables: string[];
  timeEstimate: string;
  timeSaved: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  bgPattern: string;
  description: string;
  useCases: string[];
  workflows: Workflow[];
  prompts: Prompt[];
  guardrails: string[];
}

export interface Workflow {
  title: string;
  steps: string[];
  timeBefore: string;
  timeAfter: string;
}

export interface Metric {
  id: string;
  name: string;
  definition: string;
  target: string;
  current: number;
  targetValue: number;
  unit: string;
  category: 'efficiency' | 'revenue' | 'compliance' | 'engagement';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

export interface QuickWin {
  id: number;
  title: string;
  owner: string;
  output: string;
  timeToShip: string;
  status: 'not-started' | 'in-progress' | 'done' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  week: string;
}

export interface Phase {
  number: number;
  name: string;
  months: string;
  goal: string;
  items: string[];
  status: 'complete' | 'active' | 'upcoming';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  department?: string;
}

export interface BrandVoice {
  whoWeAre: string;
  whoWeServe: string;
  voiceParagraph: string;
  voiceRules: { yes: string; no: string }[];
  bannedWords: string[];
  categoryNuance: Record<string, string>;
  channelNuance: Record<string, string>;
  examples: {
    pdps: string[];
    emails: string[];
    social: string[];
    cs: string[];
  };
}

export interface AppStats {
  promptsRun: number;
  minutesSaved: number;
  pdpsDrafted: number;
  emailsDrafted: number;
  winsCompleted: number;
}

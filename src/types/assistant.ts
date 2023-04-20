export interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar: string;
  getPrompt: (schema: string, selfDefinePrompt?: string) => string;
}

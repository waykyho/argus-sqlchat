import { first, merge } from "lodash-es";
import { Assistant, Id } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SelfPrompt } from "@/types";
import * as customAssistantList from "../../assistants";

export const GeneralBotId = "general-bot";
export const SQLChatBotId = "sql-chat-bot";

export const assistantList: Assistant[] = Object.keys(customAssistantList).map((name) => {
  return {
    ...((customAssistantList as any)[name].default as Assistant),
  };
});

export const getAssistantById = (id: Id) => {
  const assistant = assistantList.find((assistant) => assistant.id === id);
  return assistant || (first(assistantList) as Assistant);
};

export const getPromptGeneratorOfAssistant = (assistant: Assistant) => {
  return assistant.getPrompt;
};

interface AssistantSelfPromptState {
  selfPrompts: SelfPrompt[];
  getPrompt: (id: string) => SelfPrompt | undefined;
  setPrompt: (prompt: SelfPrompt) => void;
}

export const useAssistantSelfPromptStateStore = create<AssistantSelfPromptState>()(
  persist(
    (set, get) => ({
      selfPrompts: [],
      getPrompt: (id: string) => get().selfPrompts.find(p => id === p.assistantId),
      setPrompt: (prompt: SelfPrompt) => {
        const prompts = get().selfPrompts;
        const item = prompts.find(p => prompt.assistantId === p.assistantId);
        if (item) {
          item.prompt = prompt.prompt;
        } else {
          prompts.push(prompt);
        }
        set({
          selfPrompts: prompts
        });
      }
    }),
    {
      name: "selfprompt-storage",
      merge: (persistedState, currentState) => merge(currentState, persistedState),
    }
  )
);
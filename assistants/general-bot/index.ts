export default {
  id: "general-bot",
  name: "General bot",
  description: "A general bot of SQL Chat.",
  avatar: "",
  getPrompt: (schema: string, selfDefinePrompt?: string): string => {
    if (selfDefinePrompt) {
      return selfDefinePrompt
    }
    const basicPrompt = `Please be careful to return only key information, and try not to make it too long.`;
    return basicPrompt;
  },
};

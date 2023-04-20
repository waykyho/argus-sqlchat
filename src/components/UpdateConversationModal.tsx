import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { assistantList, useConversationStore, useAssistantSelfPromptStateStore } from "@/store";
import { Conversation, SelfPrompt } from "@/types";
import TextField from "./kit/TextField";
import TextAreaField from "./kit/TextAreaField";
import Modal from "./kit/Modal";
import Select from "./kit/Select";
// import Icon from "./Icon";
// import BetaBadge from "./BetaBadge";

interface Props {
  conversation: Conversation;
  close: () => void;
}

const UpdateConversationModal = (props: Props) => {
  const { close, conversation } = props;
  const { t } = useTranslation();
  const conversationStore = useConversationStore();
  const assistantSelfPromptStateStore = useAssistantSelfPromptStateStore();
  const [title, setTitle] = useState(conversation.title);
  const [assistantId, setAssistantId] = useState(conversation.assistantId);
  
  const allowSave = title !== "";
  const assistantItems = assistantList.map((assistant) => {
    return {
      value: assistant.id,
      label: assistant.name,
    };
  });
  const currentAssistant = assistantList.find((assistant) => assistant.id === assistantId);
  const [selfPrompt, setSelfPrompt] = useState(assistantSelfPromptStateStore.getPrompt(currentAssistant!.id)?.prompt || '');

  const afterChangeRobot = (id: string) => {
    setAssistantId(id);
    const prompt = assistantSelfPromptStateStore.getPrompt(id)?.prompt || '';
    setSelfPrompt(prompt);
  }

  const handleSaveEdit = () => {
    const formatedTitle = title.trim();
    if (formatedTitle === "") {
      return;
    }

    // 自定义prompt
    if (currentAssistant && selfPrompt !== currentAssistant.selfDefinePrompt) {
      if (selfPrompt && !/\$\{schema\}/.test(selfPrompt)) {
        toast.error('自定义prompt未包含${schema}，请检查！');
        return;
      }
      // 保存起来，放到本地store
      const prompt: SelfPrompt = { assistantId: currentAssistant.id, prompt: selfPrompt } 
      assistantSelfPromptStateStore.setPrompt(prompt)
    }
    conversationStore.updateConversation(conversation.id, {
      title: formatedTitle,
      assistantId: assistantId,
    });
    toast.success("Conversation updated");
    close();
  };

  return (
    <Modal title={t("conversation.update")} onClose={close}>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("conversation.title")}</label>
        <TextField placeholder={t("conversation.conversation-title") || ""} value={title} onChange={(value) => setTitle(value)} />
      </div>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <label className="text-sm font-medium text-gray-700 mb-1 flex flex-row justify-start items-center">
          {t("assistant.self")}
        </label>
        <Select className="w-full" value={assistantId} itemList={assistantItems} onValueChange={(value) => afterChangeRobot(value)} />
        {/* {currentAssistant && (
          <div className="w-full flex flex-col justify-start items-start">
            <p className="block text-sm text-gray-700 mt-2 mx-3">{currentAssistant.description}</p>
          </div>
        )} */}
        {/* <a
          className="mt-1 mx-3 text-sm text-blue-600 underline hover:opacity-80"
          href="https://github.com/sqlchat/sqlchat/tree/main/assistants"
          target="_blank"
        >
          {t("assistant.create-your-bot")} <Icon.FiExternalLink className="inline-block -mt-0.5" />
        </a> */}
      </div>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <label className="text-sm  font-medium text-red-700 mb-1 flex flex-row justify-start items-center">
          您也可以自定义机器人的Prompt(全局)
        </label>
        <TextAreaField rows={8} className="w-full" placeholder={"请输入自定义的机器人Prompt，注意必须包含“${schema}”，这是数据表描述。"} value={selfPrompt} onChange={(value) => setSelfPrompt(value)} />
      </div>
      <div className="w-full flex flex-row justify-end items-center mt-4 space-x-2">
        <button className="btn btn-outline" onClick={close}>
          {t("common.close")}
        </button>
        <button className="btn" disabled={!allowSave} onClick={handleSaveEdit}>
          {t("common.save")}
        </button>
      </div>
    </Modal>
  );
};

export default UpdateConversationModal;

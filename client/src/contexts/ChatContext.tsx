import React, { createContext, useContext, useState, useEffect } from "react";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup: boolean;
  isOnline?: boolean;
  messages: Message[];
  isArchived?: boolean;
}

interface ChatContextType {
  chats: Chat[];
  archivedChats: Chat[];
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  addMessage: (chatId: string, message: Message) => void;
  markChatAsRead: (chatId: string) => void;
  addChat: (chat: Chat) => void;
  archiveChat: (chatId: string) => void;
  unarchiveChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "maksim",
      name: "Максим",
      avatar: "M",
      lastMessage: "Привет! Как дела?",
      time: "09:41",
      unread: 0,
      isGroup: false,
      isOnline: true,
      isArchived: false,
      messages: [
        {
          id: "1",
          text: "Привет! Как дела?",
          sender: "other",
          timestamp: new Date(Date.now() - 3600000),
          read: true,
        },
      ],
    },
    {
      id: "anna",
      name: "Анна",
      avatar: "A",
      lastMessage: "Спасибо за помощь!",
      time: "08:30",
      unread: 0,
      isGroup: false,
      isOnline: false,
      isArchived: false,
      messages: [
        {
          id: "1",
          text: "Спасибо за помощь!",
          sender: "other",
          timestamp: new Date(Date.now() - 7200000),
          read: true,
        },
      ],
    },
    {
      id: "work",
      name: 'Группа "Работа"',
      avatar: "W",
      lastMessage: "Встреча в 15:00",
      time: "09:41",
      unread: 5,
      isGroup: true,
      isOnline: true,
      isArchived: false,
      messages: [
        {
          id: "1",
          text: "Встреча в 15:00",
          sender: "other",
          timestamp: new Date(Date.now() - 3600000),
          read: false,
        },
      ],
    },
    {
      id: "ivan",
      name: "Иван",
      avatar: "I",
      lastMessage: "Отправлю файл позже",
      time: "08:41",
      unread: 1,
      isGroup: false,
      isOnline: false,
      isArchived: false,
      messages: [
        {
          id: "1",
          text: "Отправлю файл позже",
          sender: "other",
          timestamp: new Date(Date.now() - 6000000),
          read: false,
        },
      ],
    },
    {
      id: "friends",
      name: 'Группа "Друзья"',
      avatar: "F",
      lastMessage: "Кто идет в кино?",
      time: "07:41",
      unread: 12,
      isGroup: true,
      isOnline: true,
      isArchived: false,
      messages: [
        {
          id: "1",
          text: "Кто идет в кино?",
          sender: "other",
          timestamp: new Date(Date.now() - 9000000),
          read: false,
        },
      ],
    },
    {
      id: "elena",
      name: "Елена",
      avatar: "E",
      lastMessage: "Была в сети",
      time: "06:00",
      unread: 0,
      isGroup: false,
      isOnline: false,
      isArchived: false,
      messages: [
        {
          id: "1",
          text: "Была в сети",
          sender: "other",
          timestamp: new Date(Date.now() - 86400000),
          read: true,
        },
      ],
    },
  ]);

  const [archivedChats, setArchivedChats] = useState<Chat[]>([]);

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const savedChats = localStorage.getItem("flick_chats");
    const savedArchived = localStorage.getItem("flick_archived_chats");

    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
    if (savedArchived) {
      setArchivedChats(JSON.parse(savedArchived));
    }
  }, []);

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
    );
  };

  const addMessage = (chatId: string, message: Message) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: message.text,
            time: message.timestamp.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        }
        return chat;
      })
    );
  };

  const markChatAsRead = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unread: 0,
            messages: chat.messages.map((msg) => ({
              ...msg,
              read: true,
            })),
          };
        }
        return chat;
      })
    );
  };

  const addChat = (chat: Chat) => {
    setChats((prevChats) => [...prevChats, chat]);
  };

  const archiveChat = (chatId: string) => {
    const chatToArchive = chats.find((c) => c.id === chatId);
    if (chatToArchive) {
      const archivedChat = { ...chatToArchive, isArchived: true };
      setArchivedChats((prev) => [...prev, archivedChat]);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      localStorage.setItem("flick_archived_chats", JSON.stringify([...archivedChats, archivedChat]));
      localStorage.setItem("flick_chats", JSON.stringify(chats.filter((c) => c.id !== chatId)));
    }
  };

  const unarchiveChat = (chatId: string) => {
    const chatToUnarchive = archivedChats.find((c) => c.id === chatId);
    if (chatToUnarchive) {
      const unarchivedChat = { ...chatToUnarchive, isArchived: false };
      setChats((prev) => [...prev, unarchivedChat]);
      setArchivedChats((prev) => prev.filter((c) => c.id !== chatId));
      localStorage.setItem("flick_chats", JSON.stringify([...chats, unarchivedChat]));
      localStorage.setItem("flick_archived_chats", JSON.stringify(archivedChats.filter((c) => c.id !== chatId)));
    }
  };

  const value: ChatContextType = {
    chats,
    archivedChats,
    updateChat,
    addMessage,
    markChatAsRead,
    addChat,
    archiveChat,
    unarchiveChat,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

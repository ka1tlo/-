import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat, Message } from "@/contexts/ChatContext";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getTranslation, Language } from "@/lib/translations";
import {
  Menu,
  Search,
  Plus,
  Phone,
  Video,
  Info,
  Send,
  Smile,
  Paperclip,
  X,
  Users,
  Settings as SettingsIcon,
  Sun,
  Moon,
  User as UserIcon,
  MessageCircle,
  ChevronLeft,
  Archive,
  MoreVertical,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const { chats, archivedChats, addMessage, markChatAsRead, addChat, archiveChat, unarchiveChat } = useChat();
  const { theme, setTheme } = useTheme();
  const {
    currentUser,
    savedContacts,
    language,
    setLanguage,
    createGroup,
    addContact,
    updateCurrentUser,
    logout,
  } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    chats.length > 0 ? chats[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [currentTab, setCurrentTab] = useState<
    "chats" | "contacts" | "profile" | "chat_detail" | "settings" | "archive"
  >("chats");
  const [searchUsername, setSearchUsername] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  
  // Profile state
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newName, setNewName] = useState(currentUser.name);
  const [newPhone, setNewPhone] = useState(currentUser.phone);
  const [newAbout, setNewAbout] = useState(currentUser.about || "");
  const [restrictions, setRestrictions] = useState(
    currentUser.restrictions || {
      allowMessages: true,
      allowCalls: true,
      allowStories: true,
    }
  );

  // Settings state
  const [settingsSection, setSettingsSection] = useState<"general" | "notifications" | "privacy" | "storage">("general");
  const [notificationSound, setNotificationSound] = useState(true);
  const [notificationVibration, setNotificationVibration] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // User profile view state
  const [showUserProfile, setShowUserProfile] = useState<any>(null);

  // Swipe state
  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipedChatId, setSwipedChatId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const stickers = ["😀", "😂", "😍", "🤔", "😎", "🥳", "😢", "😡", "🎉", "🎊", "❤️", "👍", "👏", "🙏", "🤝", "💪"];

  const t = (key: any) => getTranslation(language as Language, key);

  const menuItems = [
    { icon: <Plus className="w-5 h-5" />, label: t("newAccount"), action: "new_account" },
    { icon: <Archive className="w-5 h-5" />, label: t("savedMessages"), action: "saved" },
    { icon: <MessageCircle className="w-5 h-5" />, label: t("myStories"), action: "stories" },
    { icon: <Users className="w-5 h-5" />, label: t("contacts"), action: "contacts" },
    { icon: <Plus className="w-5 h-5" />, label: t("createGroup"), action: "create_group" },
    { icon: <SettingsIcon className="w-5 h-5" />, label: t("settings"), action: "settings" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatId, chats]);

  // Update profile state when currentUser changes
  useEffect(() => {
    setNewUsername(currentUser.username);
    setNewName(currentUser.name);
    setNewPhone(currentUser.phone);
    setNewAbout(currentUser.about || "");
    setRestrictions(currentUser.restrictions || { allowMessages: true, allowCalls: true, allowStories: true });
  }, [currentUser]);

  const selectedChat = currentTab === "archive" 
    ? archivedChats.find((c) => c.id === selectedChatId)
    : chats.find((c) => c.id === selectedChatId);

  const handleMenuAction = (action: string) => {
    if (action === "create_group") {
      setShowCreateGroup(true);
    } else if (action === "contacts") {
      setCurrentTab("contacts");
    } else if (action === "settings") {
      setCurrentTab("settings");
    } else if (action === "archive") {
      setCurrentTab("archive");
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuAnimating(true);
      setTimeout(() => {
        setMenuOpen(false);
        setMenuAnimating(false);
      }, 300);
    } else {
      setMenuOpen(true);
      setMenuAnimating(true);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    markChatAsRead(chatId);
    setSwipedChatId(null);
  };

  const handleClickProfile = () => {
    setCurrentTab("profile");
    setSwipedChatId(null);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChatId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: "user",
        timestamp: new Date(),
        read: true,
      };

      addMessage(selectedChatId, newMessage);
      setMessageText("");

      setTimeout(() => {
        const responses: { [key: string]: string } = {
          maksim: "Спасибо! Всё хорошо!",
          anna: "Пожалуйста! Рада помочь!",
          work: "Принято! Буду там!",
          ivan: "Окей, жду!",
          friends: "Я в деле!",
          elena: "Ответ на твоё сообщение",
        };

        const responseText = responses[selectedChatId] || "Спасибо за сообщение!";

        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: "other",
          timestamp: new Date(),
          read: true,
        };

        addMessage(selectedChatId, replyMessage);
      }, 1000);
    }
  };

  const handleSendSticker = (sticker: string) => {
    setMessageText((prev) => prev + sticker);
  };

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      const newGroupId = `group_${Date.now()}`;
      const newChat = {
        id: newGroupId,
        name: groupName,
        avatar: groupName.charAt(0).toUpperCase(),
        lastMessage: "",
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: 0,
        isGroup: true,
        isOnline: true,
        isArchived: false,
        messages: [],
      };
      addChat(newChat);
      createGroup(groupName, groupName.charAt(0).toUpperCase(), []);
      setGroupName("");
      setShowCreateGroup(false);
    }
  };

  const handleAddContact = () => {
    if (searchUsername.trim()) {
      const success = addContact(searchUsername);
      if (!success) {
        alert(t("userNotFound"));
      }
      setSearchUsername("");
    }
  };

  const handleSaveProfile = () => {
    updateCurrentUser({
      username: newUsername,
      name: newName,
      phone: newPhone,
      about: newAbout,
      restrictions,
    });
    alert("Профиль сохранён!");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: any) => {
    try {
      // Если это строка, пытаемся преобразовать в дату
      if (typeof date === 'string') {
        date = new Date(date);
      }
      // Если это число (timestamp), преобразуем в дату
      if (typeof date === 'number') {
        date = new Date(date);
      }
      // Если это уже Date объект, используем его
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      // Fallback: возвращаем текущее время
      return new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      // Если что-то пошло не так, возвращаем текущее время
      return new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent, chatId: string) => {
    if ('touches' in e) {
      setSwipeStart((e as React.TouchEvent).touches[0].clientX);
    } else {
      setSwipeStart((e as React.MouseEvent).clientX);
    }
  };

  const handleSwipeEnd = (e: React.TouchEvent | React.MouseEvent, chatId: string) => {
    if (!swipeStart) return;
    
    let swipeEnd = 0;
    if ('changedTouches' in e) {
      swipeEnd = (e as React.TouchEvent).changedTouches[0].clientX;
    } else {
      swipeEnd = (e as React.MouseEvent).clientX;
    }
    
    const diff = swipeStart - swipeEnd;

    if (diff > 100) {
      // Swipe left - Immediate action
      if (currentTab === "archive") {
        handleUnarchiveChat(chatId);
      } else {
        handleArchiveChat(chatId);
      }
    }
    setSwipeStart(null);
  };

  const handleArchiveChat = (chatId: string) => {
    archiveChat(chatId);
    setSwipedChatId(null);
    if (selectedChatId === chatId) {
      setSelectedChatId(chats.length > 0 ? chats[0].id : null);
    }
    // Show toast notification
    if (typeof window !== "undefined") {
      const event = new CustomEvent("showToast", { detail: { message: "Чат архивирован", type: "info" } });
      window.dispatchEvent(event);
    }
  };

  const handleUnarchiveChat = (chatId: string) => {
    unarchiveChat(chatId);
    setSwipedChatId(null);
    // Show toast notification
    if (typeof window !== "undefined") {
      const event = new CustomEvent("showToast", { detail: { message: "Чат восстановлен", type: "info" } });
      window.dispatchEvent(event);
    }
  };

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleClickProfile}
                >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser.avatar}
                </div>
                <div>
                  <p className="font-medium text-sm">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{currentUser.username}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
                <div ref={menuRef} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className={`rounded-full transition-transform duration-300 ${
                      menuOpen ? "hamburger-open" : ""
                    }`}
                  >
                    <Menu className="w-4 h-4" />
                  </Button>

                  {menuOpen && (
                    <div
                      className={`absolute top-10 right-0 bg-card border border-border rounded-lg shadow-lg z-50 w-48 overflow-hidden ${
                        menuAnimating ? "menu-open" : ""
                      }`}
                    >
                      {menuItems.map((item, idx) => (
                        <button
                          key={item.action}
                          onClick={() => handleMenuAction(item.action)}
                          className="w-full px-4 py-3 text-left hover:bg-muted text-sm border-b border-border/30 last:border-b-0 transition-all duration-200 hover:translate-x-1 flex items-center gap-3"
                          style={{
                            animation: menuAnimating
                              ? `slideInMenu 0.3s ease-out ${idx * 0.05}s forwards`
                              : "none",
                          }}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("searchChats")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-3 border-b border-border">
            <Button
              variant={currentTab === "chats" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTab("chats")}
              className="rounded-full text-xs"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {t("chats")}
            </Button>
            <Button
              variant={currentTab === "contacts" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTab("contacts")}
              className="rounded-full text-xs"
            >
              <Users className="w-4 h-4 mr-1" />
              {t("contacts")}
            </Button>
            <Button
              variant={currentTab === "archive" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTab("archive")}
              className="rounded-full text-xs"
            >
              <Archive className="w-4 h-4 mr-1" />
              {t("archive")}
            </Button>
          </div>

          {/* Chats/Contacts/Archive List */}
          <div className="flex-1 overflow-y-auto">
            {currentTab === "chats" ? (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  onTouchStart={(e) => handleSwipeStart(e, chat.id)}
                  onTouchEnd={(e) => handleSwipeEnd(e, chat.id)}
                  onMouseDown={(e) => handleSwipeStart(e, chat.id)}
                  onMouseUp={(e) => handleSwipeEnd(e, chat.id)}
                  className={`w-full px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border/30 relative select-none ${
                    selectedChatId === chat.id ? "bg-muted" : ""
                  }`}
                >
                  {swipedChatId === chat.id && (
                    <div className="absolute right-0 top-0 bottom-0 bg-red-500 flex items-center px-4 gap-2 animate-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveChat(chat.id);
                        }}
                        className="text-white text-sm font-medium hover:bg-red-600 px-3 py-1 rounded transition-colors"
                      >
                        Архив
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-muted-foreground ml-2">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : currentTab === "archive" ? (
              archivedChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  onTouchStart={(e) => handleSwipeStart(e, chat.id)}
                  onTouchEnd={(e) => handleSwipeEnd(e, chat.id)}
                  onMouseDown={(e) => handleSwipeStart(e, chat.id)}
                  onMouseUp={(e) => handleSwipeEnd(e, chat.id)}
                  className={`w-full px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border/30 relative select-none ${
                    selectedChatId === chat.id ? "bg-muted" : ""
                  }`}
                >
                  {swipedChatId === chat.id && (
                    <div className="absolute right-0 top-0 bottom-0 bg-green-500 flex items-center px-4 gap-2 animate-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnarchiveChat(chat.id);
                        }}
                        className="text-white text-sm font-medium hover:bg-green-600 px-3 py-1 rounded transition-colors"
                      >
                        Вернуть
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-muted-foreground ml-2">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("searchByUsername")}
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    className="text-sm rounded-full"
                  />
                  <Button
                    onClick={handleAddContact}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 rounded-full"
                  >
                    {t("addContact")}
                  </Button>
                </div>
                {savedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-muted rounded-lg p-3 flex items-center gap-3 border border-border"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{contact.username}
                      </p>
                    </div>
                    {contact.status === "online" && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-background relative">
          {selectedChatId && selectedChat && isMobile && (
            <div className="absolute inset-0 bg-background z-[60] flex flex-col">
              {/* Mobile Chat Header */}
              <div className="bg-card border-b border-border p-4 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedChatId(null)} className="rounded-full">
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setShowUserProfile(selectedChat)}>
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {selectedChat.avatar}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-sm truncate">{selectedChat.name}</h2>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedChat.isOnline ? t("online") : t("offline")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowUserProfile(selectedChat)}>
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {selectedChat.messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                    Начните разговор
                  </div>
                ) : (
                  <>
                    {selectedChat.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.sender === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-muted text-foreground rounded-bl-none"}`}>
                          <p className="break-words">{msg.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Mobile Input */}
              <div className="p-3 bg-card border-t border-border">
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder={t("message")}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="rounded-full h-9 text-sm"
                    />
                  </div>
                  <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-9 w-9 p-0" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentTab === "chats" && selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowUserProfile(selectedChat)}>
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{selectedChat.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.isOnline ? t("online") : t("offline")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-background">
                {selectedChat.messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{selectedChat.avatar}</div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {selectedChat.name}
                      </h3>
                      <p className="text-muted-foreground">
                        Начните разговор
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            msg.sender === "user"
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm break-words">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === "user"
                                ? "text-white/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="bg-card border-t border-border px-6 py-4">
                <div className="flex gap-3 items-end">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder={t("message")}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="rounded-full"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowStickers(!showStickers)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                    size="icon"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>

                {showStickers && (
                  <div className="mt-4 bg-muted rounded-lg p-4 border border-border">
                    <div className="grid grid-cols-8 gap-2">
                      {stickers.map((sticker, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendSticker(sticker)}
                          className="text-2xl hover:scale-125 transition-transform"
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : currentTab === "profile" ? (
            <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-blue-50 to-background dark:from-slate-900 dark:to-background">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-6xl font-bold mx-auto mb-6 shadow-lg ring-4 ring-blue-200 dark:ring-blue-900">
                    {currentUser.avatar}
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">{currentUser.name}</h2>
                  <p className="text-muted-foreground mt-2 text-sm">@{currentUser.username}</p>
                  <p className="text-xs text-muted-foreground mt-1">Пользователь</p>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border shadow-md space-y-4">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">{t("profile")}</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("username")}
                    </label>
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("name")}
                    </label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("phone")}
                    </label>
                    <Input
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("about")}
                    </label>
                    <Input
                      value={newAbout}
                      onChange={(e) => setNewAbout(e.target.value)}
                      className="rounded-lg"
                      placeholder="Расскажите о себе..."
                    />
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <h4 className="font-semibold mb-3">{t("restrictions")}</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={restrictions.allowMessages}
                          onChange={(e) =>
                            setRestrictions({
                              ...restrictions,
                              allowMessages: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{t("allowMessages")}</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={restrictions.allowCalls}
                          onChange={(e) =>
                            setRestrictions({
                              ...restrictions,
                              allowCalls: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{t("allowCalls")}</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={restrictions.allowStories}
                          onChange={(e) =>
                            setRestrictions({
                              ...restrictions,
                              allowStories: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{t("allowStories")}</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg mt-6"
                  >
                    {t("saveChanges")}
                  </Button>
                </div>
              </div>
            </div>
          ) : currentTab === "settings" ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-semibold">{t("settings")}</h2>

                <div className="flex gap-4 border-b border-border pb-4">
                  {[
                    { id: "general", label: "Общие" },
                    { id: "notifications", label: "Уведомления" },
                    { id: "privacy", label: "Конфиденциальность" },
                    { id: "storage", label: "Память" },
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSettingsSection(section.id as any)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        settingsSection === section.id
                          ? "bg-blue-500 text-white"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>

                <div className="bg-card rounded-lg p-6 border border-border space-y-4">
                  {settingsSection === "general" && (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t("language")}
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                        >
                          <option value="ru">🇷🇺 Русский</option>
                          <option value="en">🇬🇧 English</option>
                          <option value="es">🇪🇸 Español</option>
                          <option value="fr">🇫🇷 Français</option>
                          <option value="de">🇩🇪 Deutsch</option>
                          <option value="it">🇮🇹 Italiano</option>
                          <option value="pt">🇵🇹 Português</option>
                          <option value="pl">🇵🇱 Polski</option>
                          <option value="ja">🇯🇵 日本語</option>
                          <option value="ko">🇰🇷 한국어</option>
                          <option value="zh">🇨🇳 中文</option>
                          <option value="ar">🇸🇦 العربية</option>
                          <option value="hi">🇮🇳 हिन्दी</option>
                          <option value="tr">🇹🇷 Türkçe</option>
                          <option value="nl">🇳🇱 Nederlands</option>
                          <option value="sv">🇸🇪 Svenska</option>
                          <option value="no">🇳🇴 Norsk</option>
                          <option value="da">🇩🇰 Dansk</option>
                          <option value="fi">🇫🇮 Suomi</option>
                          <option value="el">🇬🇷 Ελληνικά</option>
                          <option value="he">🇮🇱 עברית</option>
                          <option value="th">🇹🇭 ไทย</option>
                          <option value="vi">🇻🇳 Tiếng Việt</option>
                          <option value="id">🇮🇩 Bahasa Indonesia</option>
                          <option value="uk">🇺🇦 Українська</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t("compactView")}
                        </label>
                        <input
                          type="checkbox"
                          checked={compactView}
                          onChange={(e) => setCompactView(e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t("animations")}
                        </label>
                        <input
                          type="checkbox"
                          checked={animationsEnabled}
                          onChange={(e) => setAnimationsEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="border-t border-border pt-4 mt-4">
                        <h3 className="text-sm font-semibold mb-3">Профиль</h3>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            {t("hidePhone")}
                          </label>
                          <input
                            type="checkbox"
                            checked={currentUser.hidePhone || false}
                            onChange={(e) => {
                              const updated = { ...currentUser, hidePhone: e.target.checked };
                              setCurrentUser(updated);
                              localStorage.setItem('currentUser', JSON.stringify(updated));
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="mt-3">
                          <label className="text-sm font-medium block mb-2">О себе</label>
                          <textarea
                            value={currentUser.bio || ""}
                            onChange={(e) => {
                              const updated = { ...currentUser, bio: e.target.value };
                              setCurrentUser(updated);
                              localStorage.setItem('currentUser', JSON.stringify(updated));
                            }}
                            placeholder="Расскажите о себе..."
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-none h-20"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {settingsSection === "notifications" && (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t("sound")}
                        </label>
                        <input
                          type="checkbox"
                          checked={notificationSound}
                          onChange={(e) => setNotificationSound(e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t("vibration")}
                        </label>
                        <input
                          type="checkbox"
                          checked={notificationVibration}
                          onChange={(e) =>
                            setNotificationVibration(e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                      </div>
                    </>
                  )}

                  {settingsSection === "privacy" && (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t("showStatus")}
                        </label>
                        <input
                          type="checkbox"
                          checked={showOnlineStatus}
                          onChange={(e) => setShowOnlineStatus(e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </>
                  )}

                  {settingsSection === "storage" && (
                    <>
                      <div className="text-sm text-muted-foreground">
                        <p>Использование памяти: ~2.5 MB</p>
                      </div>
                      <Button
                        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        onClick={() => {
                          if (
                            confirm(
                              "Вы уверены? Это удалит все данные приложения."
                            )
                          ) {
                            localStorage.clear();
                            alert("Кеш очищен");
                          }
                        }}
                      >
                        {t("clearCache")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : currentTab === "contacts" ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-semibold">{t("contacts")}</h2>

                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder={t("searchByUsername")}
                      value={searchUsername}
                      onChange={(e) => setSearchUsername(e.target.value)}
                      className="rounded-lg"
                    />
                    <Button
                      onClick={handleAddContact}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                      {t("addContact")}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {savedContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-muted rounded-lg p-4 flex items-center gap-3 border border-border"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {contact.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            @{contact.username}
                          </p>
                        </div>
                        {contact.status === "online" && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : currentTab === "archive" ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">{t("archive")}</h2>

                {archivedChats.length === 0 ? (
                  <div className="text-center py-12">
                    <Archive className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Архив пуст. Свайпните чат влево, чтобы архивировать его.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {archivedChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="bg-card rounded-lg p-4 border border-border flex items-center gap-3 cursor-pointer hover:bg-muted transition-colors relative overflow-hidden group"
                        onTouchStart={(e) => handleSwipeStart(e, chat.id)}
                        onTouchEnd={(e) => handleSwipeEnd(e, chat.id)}
                        onClick={() => {
                          setSelectedChatId(chat.id);
                          setCurrentTab("chats");
                          markChatAsRead(chat.id);
                        }}
                      >
                        {swipedChatId === chat.id && (
                          <div className="absolute right-0 top-0 bottom-0 bg-green-500 flex items-center px-4 animate-in slide-in-from-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnarchiveChat(chat.id);
                              }}
                              className="text-white text-sm font-medium"
                            >
                              Вернуть
                            </button>
                          </div>
                        )}
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {chat.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{chat.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                        {!swipedChatId && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnarchiveChat(chat.id);
                            }}
                          >
                            Вернуть
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-96 border border-border">
              <h3 className="text-lg font-semibold mb-4">{t("createGroup")}</h3>
              <Input
                placeholder="Название группы"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="rounded-lg mb-4"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCreateGroup(false)}
                  variant="ghost"
                  className="flex-1 rounded-lg"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  {t("createGroup")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentTab("profile")}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.avatar}
            </div>
            <div>
              <p className="font-medium text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">
                @{currentUser.username}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
              <div ref={menuRef} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="rounded-full"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                {menuOpen && (
                  <div className="absolute top-10 right-0 bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl z-50 w-56 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-2 space-y-1">
                      {menuItems.map((item) => (
                        <button
                          key={item.action}
                          onClick={() => handleMenuAction(item.action)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 text-sm rounded-xl transition-all flex items-center gap-3 group"
                        >
                          <span className="text-muted-foreground group-hover:text-blue-400 transition-colors">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("searchChats")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {currentTab === "chats" ? (
          <div>
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                onTouchStart={(e) => handleSwipeStart(e, chat.id)}
                onTouchEnd={(e) => handleSwipeEnd(e, chat.id)}
                className="w-full px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border/30 relative"
              >
                {swipedChatId === chat.id && (
                  <div className="absolute right-0 top-0 bottom-0 bg-red-500 flex items-center px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveChat(chat.id);
                      }}
                      className="text-white text-sm font-medium"
                    >
                      Архив
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-muted-foreground ml-2">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : currentTab === "archive" ? (
          <div>
            {archivedChats.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Archive className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Архив пуст</p>
              </div>
            ) : (
              archivedChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  onTouchStart={(e) => handleSwipeStart(e, chat.id)}
                  onTouchEnd={(e) => handleSwipeEnd(e, chat.id)}
                  className="w-full px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border/30 relative"
                >
                  {swipedChatId === chat.id && (
                    <div className="absolute right-0 top-0 bottom-0 bg-green-500 flex items-center px-4 animate-in slide-in-from-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnarchiveChat(chat.id);
                        }}
                        className="text-white text-sm font-medium"
                      >
                        Вернуть
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {chat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : currentTab === "contacts" ? (
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder={t("searchByUsername")}
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="text-sm rounded-lg"
              />
              <Button
                onClick={handleAddContact}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                {t("addContact")}
              </Button>
            </div>
            {savedContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-card rounded-lg p-3 flex items-center gap-3 border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{contact.username}
                  </p>
                </div>
                {contact.status === "online" && (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        ) : currentTab === "profile" ? (
          <div className="p-4 space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-3">
                {currentUser.avatar}
              </div>
              <h2 className="text-xl font-semibold">{currentUser.name}</h2>
              <p className="text-muted-foreground">@{currentUser.username}</p>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border space-y-3">
              <h3 className="font-semibold">{t("profile")}</h3>
              <div>
                <label className="block text-xs font-medium mb-1">
                  {t("username")}
                </label>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  {t("name")}
                </label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  {t("phone")}
                </label>
                <Input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  {t("about")}
                </label>
                <Input
                  value={newAbout}
                  onChange={(e) => setNewAbout(e.target.value)}
                  className="rounded-lg text-sm"
                  placeholder="О себе..."
                />
              </div>

              <div className="border-t border-border pt-3 mt-3">
                <h4 className="font-semibold text-sm mb-2">
                  {t("restrictions")}
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={restrictions.allowMessages}
                      onChange={(e) =>
                        setRestrictions({
                          ...restrictions,
                          allowMessages: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-xs">{t("allowMessages")}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={restrictions.allowCalls}
                      onChange={(e) =>
                        setRestrictions({
                          ...restrictions,
                          allowCalls: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-xs">{t("allowCalls")}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={restrictions.allowStories}
                      onChange={(e) =>
                        setRestrictions({
                          ...restrictions,
                          allowStories: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-xs">{t("allowStories")}</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg mt-4"
              >
                {t("saveChanges")}
              </Button>
            </div>
          </div>
        ) : currentTab === "settings" ? (
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">{t("settings")}</h2>

            <div className="bg-card rounded-lg p-4 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("language")}</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="pt">🇵🇹 Português</option>
                    <option value="pl">🇵🇱 Polski</option>
                    <option value="ja">🇯🇵 日本語</option>
                    <option value="ko">🇰🇷 한국어</option>
                    <option value="zh">🇨🇳 中文</option>
                    <option value="ar">🇸🇦 العربية</option>
                    <option value="hi">🇮🇳 हिन्दी</option>
                    <option value="tr">🇹🇷 Türkçe</option>
                    <option value="nl">🇳🇱 Nederlands</option>
                    <option value="sv">🇸🇪 Svenska</option>
                    <option value="no">🇳🇴 Norsk</option>
                    <option value="da">🇩🇰 Dansk</option>
                    <option value="fi">🇫🇮 Suomi</option>
                    <option value="el">🇬🇷 Ελληνικά</option>
                    <option value="he">🇮🇱 עברית</option>
                    <option value="th">🇹🇭 ไทย</option>
                    <option value="vi">🇻🇳 Tiếng Việt</option>
                    <option value="id">🇮🇩 Bahasa Indonesia</option>
                    <option value="uk">🇺🇦 Українська</option>
                  </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Звук</label>
                <input
                  type="checkbox"
                  checked={notificationSound}
                  onChange={(e) => setNotificationSound(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Вибрация</label>
                <input
                  type="checkbox"
                  checked={notificationVibration}
                  onChange={(e) =>
                    setNotificationVibration(e.target.checked)
                  }
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Показывать статус</label>
                <input
                  type="checkbox"
                  checked={showOnlineStatus}
                  onChange={(e) => setShowOnlineStatus(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-xl"
                  onClick={() => {
                    if (confirm("Вы уверены? Это удалит все данные приложения.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  {t("clearCache")}
                </Button>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2"
                    onClick={() => {
                      if (confirm("Вы действительно хотите выйти?")) {
                        logout();
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                  </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-card border-t border-border flex gap-2 p-2">
        <Button
          variant={currentTab === "chats" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentTab("chats")}
          className="flex-1 rounded-lg"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          {t("chats")}
        </Button>
        <Button
          variant={currentTab === "contacts" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentTab("contacts")}
          className="flex-1 rounded-lg"
        >
          <Users className="w-4 h-4 mr-1" />
          {t("contacts")}
        </Button>
        <Button
          variant={currentTab === "profile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentTab("profile")}
          className="flex-1 rounded-lg"
        >
          <UserIcon className="w-4 h-4 mr-1" />
          {t("profile")}
        </Button>
        <Button
          variant={currentTab === "settings" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentTab("settings")}
          className="flex-1 rounded-lg"
        >
          <SettingsIcon className="w-4 h-4 mr-1" />
          {t("settings")}
        </Button>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-96 border border-border max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t("viewProfile")}</h3>
              <button
                onClick={() => setShowUserProfile(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                  {showUserProfile.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{showUserProfile.name}</h4>
                  <p className="text-sm text-muted-foreground">@{showUserProfile.username}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {showUserProfile.isOnline ? t("online") : t("offline")}
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="space-y-3">
                  {!showUserProfile.hidePhone && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t("phone")}</p>
                      <p className="text-sm">{showUserProfile.phone}</p>
                    </div>
                  )}
                  {showUserProfile.bio && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t("about")}</p>
                      <p className="text-sm">{showUserProfile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => setShowUserProfile(null)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-80 border border-border">
            <h3 className="text-lg font-semibold mb-4">{t("createGroup")}</h3>
            <Input
              placeholder="Название группы"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCreateGroup(false)}
                variant="ghost"
                className="flex-1 rounded-lg"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleCreateGroup}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                {t("createGroup")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

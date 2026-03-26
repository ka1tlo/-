import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  username: string;
  name: string;
  phone: string;
  avatar: string;
  status: "online" | "offline";
  bio?: string;
  about?: string;
  restrictions?: {
    allowMessages: boolean;
    allowCalls: boolean;
    allowStories: boolean;
  };
  blockedUsers?: string[];
  isAuthenticated?: boolean;
  token?: string;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
}

interface UserContextType {
  currentUser: User;
  allUsers: User[];
  groups: Group[];
  contacts: string[];
  savedContacts: User[];
  updateCurrentUser: (updates: Partial<User>) => void;
  addContact: (username: string) => boolean;
  removeContact: (username: string) => void;
  findUserByUsername: (username: string) => User | undefined;
  createGroup: (name: string, avatar: string, members: string[]) => void;
  language: string;
  setLanguage: (lang: string) => void;
  blockUser: (username: string) => void;
  unblockUser: (username: string) => void;
  isAuthenticated: boolean;
  login: (phone: string, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState("ru");

  const [currentUser, setCurrentUser] = useState<User>({
    id: "",
    username: "",
    name: "",
    phone: "",
    avatar: "",
    status: "offline",
    bio: "",
    about: "",
    restrictions: {
      allowMessages: true,
      allowCalls: true,
      allowStories: true,
    },
    blockedUsers: [],
    isAuthenticated: false,
    token: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>([
    {
      id: "user_2",
      username: "maksim_dev",
      name: "Максим",
      phone: "+7 (999) 111-11-11",
      avatar: "M",
      status: "online",
      bio: "Разработчик",
      about: "Full-stack developer",
      restrictions: {
        allowMessages: true,
        allowCalls: true,
        allowStories: true,
      },
      blockedUsers: [],
    },
    {
      id: "user_3",
      username: "anna_smile",
      name: "Анна",
      phone: "+7 (999) 222-22-22",
      avatar: "A",
      status: "offline",
      bio: "Дизайнер",
      about: "UI/UX Designer",
      restrictions: {
        allowMessages: true,
        allowCalls: false,
        allowStories: true,
      },
      blockedUsers: [],
    },
    {
      id: "user_4",
      username: "ivan_work",
      name: "Иван",
      phone: "+7 (999) 333-33-33",
      avatar: "I",
      status: "offline",
      bio: "Менеджер",
      about: "Project Manager",
      restrictions: {
        allowMessages: true,
        allowCalls: true,
        allowStories: false,
      },
      blockedUsers: [],
    },
  ]);

  const [contacts, setContacts] = useState<string[]>([
    "maksim_dev",
    "anna_smile",
    "ivan_work",
  ]);

  const [groups, setGroups] = useState<Group[]>([
    {
      id: "group_1",
      name: 'Группа "Работа"',
      avatar: "W",
      members: ["elena_2024", "maksim_dev", "ivan_work"],
      createdBy: "elena_2024",
      createdAt: new Date(),
    },
    {
      id: "group_2",
      name: 'Группа "Друзья"',
      avatar: "F",
      members: ["elena_2024", "anna_smile", "maksim_dev"],
      createdBy: "anna_smile",
      createdAt: new Date(),
    },
  ]);

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const savedUser = localStorage.getItem("flick_user");
    const savedToken = localStorage.getItem("flick_token");
    const savedLanguage = localStorage.getItem("flick_language");
    const savedContacts = localStorage.getItem("flick_contacts");
    const savedGroups = localStorage.getItem("flick_groups");
    const savedAllUsers = localStorage.getItem("flick_all_users");

    if (savedAllUsers) {
      setAllUsers(JSON.parse(savedAllUsers));
    }

    if (savedUser && savedToken) {
      const user = JSON.parse(savedUser);
      setCurrentUser({ ...user, isAuthenticated: true, token: savedToken });
      setIsAuthenticated(true);
    }
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  const updateCurrentUser = (updates: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem("flick_user", JSON.stringify(updatedUser));
  };

  const addContact = (username: string): boolean => {
    const user = findUserByUsername(username);
    if (!user) {
      return false;
    }
    if (!contacts.includes(username)) {
      const newContacts = [...contacts, username];
      setContacts(newContacts);
      localStorage.setItem("flick_contacts", JSON.stringify(newContacts));
    }
    return true;
  };

  const removeContact = (username: string) => {
    const newContacts = contacts.filter((c) => c !== username);
    setContacts(newContacts);
    localStorage.setItem("flick_contacts", JSON.stringify(newContacts));
  };

  const findUserByUsername = (username: string): User | undefined => {
    return allUsers.find((u) => u.username === username);
  };

  const createGroup = (name: string, avatar: string, members: string[]) => {
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name,
      avatar,
      members,
      createdBy: currentUser.username,
      createdAt: new Date(),
    };
    const newGroups = [...groups, newGroup];
    setGroups(newGroups);
    localStorage.setItem("flick_groups", JSON.stringify(newGroups));
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("flick_language", lang);
  };

  const blockUser = (username: string) => {
    const blockedUsers = currentUser.blockedUsers || [];
    if (!blockedUsers.includes(username)) {
      updateCurrentUser({
        blockedUsers: [...blockedUsers, username],
      });
    }
  };

  const unblockUser = (username: string) => {
    const blockedUsers = currentUser.blockedUsers || [];
    updateCurrentUser({
      blockedUsers: blockedUsers.filter((u) => u !== username),
    });
  };

  const login = (phone: string, token: string) => {
    // Check if user already exists
    const existingUser = allUsers.find(u => u.phone === phone);
    
    if (existingUser) {
      const loggedInUser = { ...existingUser, isAuthenticated: true, token };
      setCurrentUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("flick_user", JSON.stringify(loggedInUser));
      localStorage.setItem("flick_token", token);
    } else {
      // Create new user
      const username = `user_${phone.replace(/\D/g, "").slice(-10)}`;
      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        name: phone,
        phone,
        avatar: phone.charAt(0).toUpperCase(),
        status: "online",
        bio: "",
        about: "",
        restrictions: {
          allowMessages: true,
          allowCalls: true,
          allowStories: true,
        },
        blockedUsers: [],
        isAuthenticated: true,
        token,
      };
      
      const updatedAllUsers = [...allUsers, newUser];
      setAllUsers(updatedAllUsers);
      localStorage.setItem("flick_all_users", JSON.stringify(updatedAllUsers));
      
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("flick_user", JSON.stringify(newUser));
      localStorage.setItem("flick_token", token);
    }
  };

  const logout = () => {
    setCurrentUser({
      id: "",
      username: "",
      name: "",
      phone: "",
      avatar: "",
      status: "offline",
      bio: "",
      about: "",
      restrictions: {
        allowMessages: true,
        allowCalls: true,
        allowStories: true,
      },
      blockedUsers: [],
      isAuthenticated: false,
      token: "",
    });
    setIsAuthenticated(false);
    localStorage.removeItem("flick_user");
    localStorage.removeItem("flick_token");
  };

  const savedContacts = contacts
    .map((username) => findUserByUsername(username))
    .filter((user) => user !== undefined) as User[];

  const value: UserContextType = {
    currentUser,
    allUsers,
    groups,
    contacts,
    savedContacts,
    updateCurrentUser,
    addContact,
    removeContact,
    findUserByUsername,
    createGroup,
    language,
    setLanguage,
    blockUser,
    unblockUser,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

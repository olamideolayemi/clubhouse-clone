import { type Call, StreamVideoClient, type User as StreamUserType } from "@stream-io/video-react-sdk";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "universal-cookie";

interface User {
  username: string;
  name: string;
}

interface UserContextProps {
  user: User | null,
  setUser: (user: User) => void,
  client: StreamVideoClient | undefined;
  setClient: (client: StreamVideoClient) => void;
  call: Call | undefined;
  setCall: (call: Call | undefined) => void;
  isLoadingClient?: boolean;
  setIsLoadingClient?: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = (props: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [call, setCall] = useState<Call>();
  const [client, setClient] = useState<StreamVideoClient>();
  const [isLoadingClient, setIsLoadingClient] = useState<boolean>(true);

  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
    const username = cookies.get("username");
    const name = cookies.get("name");

    if (!token || !username || !name) {
      setIsLoadingClient(false);
      return;
    };

    const user: StreamUserType = {
      id: username,
      name: name,
      image: cookies.get("image") || "",
    };

    const myClient = new StreamVideoClient({
      apiKey: import.meta.env.VITE_STREAM_API_KEY || "",
      user,
      token,
    });

    setClient(myClient);
    setUser({ username, name });
    setIsLoadingClient(false);

    return () => {
      myClient.disconnectUser();
      setClient(undefined);
      setUser(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, client, setClient, call, setCall, isLoadingClient }}>
      {""}
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
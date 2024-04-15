"use client";

import { getUser } from "@/lib/auth/config";
import { ReactNode, createContext, useContext } from "react";

type ContextType = Awaited<ReturnType<typeof getUser>>;

const SessionContext = createContext<ContextType>({
  session: null,
  user: null,
});

const useSession = () => useContext(SessionContext);

function SessionProvider({
  session,
  children,
}: {
  session: ContextType;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export { useSession, SessionProvider };

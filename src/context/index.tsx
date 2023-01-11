import { createContext, Dispatch, SetStateAction } from "react";

type ExexuteIdContextType = {
  executeId: string;
  setExecuteId: Dispatch<SetStateAction<string>>;
};

export const ExexuteIdContext = createContext<ExexuteIdContextType>(
  {} as ExexuteIdContextType
);

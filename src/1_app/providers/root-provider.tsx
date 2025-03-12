"use client";

import { type FC, type ReactNode } from "react";

interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider: FC<RootProviderProps> = ({ children }) => {
  return <>{children}</>;
};

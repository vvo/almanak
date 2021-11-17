import { RefObject, useRef } from "react";

export type HookReturn = {
  name: string;
  flag: boolean;
  someRef: RefObject<HTMLDivElement>;
  handleEvent(): void;
};

export function useCustomHook(): HookReturn {
  const someRef = useRef<HTMLDivElement>(null);

  return {
    name: "Hook",
    flag: true,
    someRef,
    handleEvent() {
      return;
    },
  };
}

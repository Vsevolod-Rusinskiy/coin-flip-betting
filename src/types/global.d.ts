export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on: (eventName: string, handler: (...args: unknown[]) => void) => void
  removeListener: (eventName: string, handler: (...args: unknown[]) => void) => void
  isMetaMask?: boolean
}

interface ChromeMessage {
  action: string
  [key: string]: unknown
}

interface ChromeRuntime {
  sendMessage: (
    extensionId: string,
    message: ChromeMessage,
    callback: (response: { success: boolean; result: boolean }) => void
  ) => void
  lastError?: {
    message?: string
  }
}

interface Chrome {
  runtime?: ChromeRuntime
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
    chrome?: Chrome
  }
  
  const chrome: Chrome | undefined
}

export {} 
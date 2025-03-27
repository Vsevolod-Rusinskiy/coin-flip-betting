interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on: (eventName: string, handler: (...args: any[]) => void) => void
    removeListener: (eventName: string, handler: (...args: any[]) => void) => void
    isMetaMask?: boolean
  }
}

interface Chrome {
  runtime?: {
    sendMessage: (
      extensionId: string,
      message: any,
      callback: (response: any) => void
    ) => void
    lastError?: {
      message?: string
    }
  }
}

declare var chrome: Chrome 
interface EthereumRequest {
  method: string
  params?: unknown[]
}

interface EthereumProvider {
  request: (args: EthereumRequest) => Promise<unknown>
  on: (eventName: string, handler: (params: unknown) => void) => void
  removeListener: (eventName: string, handler: (params: unknown) => void) => void
  isMetaMask?: boolean
}

interface Window {
  ethereum?: EthereumProvider
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

declare const chrome: Chrome 
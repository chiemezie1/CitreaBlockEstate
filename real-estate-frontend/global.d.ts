export {}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: Array<any> | Record<string, any> }) => Promise<any>
    }
  }
}

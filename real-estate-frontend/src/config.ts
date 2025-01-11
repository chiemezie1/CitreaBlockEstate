import { http, createConfig } from 'wagmi'
import { citrea } from './utils/citreaChain'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [citrea],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [citrea.id]: http(),
  },
})


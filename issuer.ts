import { AskarModule } from "@credo-ts/askar"
import {
  Agent,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
} from "@credo-ts/core"
import { HttpInboundTransport, agentDependencies } from "@credo-ts/node"
import { ariesAskar } from "@hyperledger/aries-askar-nodejs"

export const issuer = new Agent({
  config: {
    label: "Issuer Agent",
    walletConfig: {
      id: "issuer-agent-id",
      key: "issuer-agent-key",
    },
    endpoints: ["http://localhost:6006/didcomm"],
    logger: new ConsoleLogger(LogLevel.debug),
  },
  modules: {
    // Storage Module
    askar: new AskarModule({
      ariesAskar,
    }),
  },
  dependencies: agentDependencies,
})

issuer.registerInboundTransport(
  new HttpInboundTransport({
    port: 6006,
    path: "/didcomm",
  })
)
issuer.registerOutboundTransport(new HttpOutboundTransport())

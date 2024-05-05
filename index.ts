import { KeyType, TypedArrayEncoder } from "@credo-ts/core"
import { issuer } from "./issuer"
import { readFile, writeFile } from "node:fs/promises"
import { createC2pa, RemoteSigner, SignInput, ManifestBuilder } from "c2pa-node"

const uploadDir = "./uploaded_assets"
const signedDir = "./signed_assets"

async function app() {
  await issuer.initialize()
  issuer.config.logger.info("Agents initialized!")

  // Create did:key with Bls key type for issuer

  const key = await issuer.wallet.createKey({
    keyType: KeyType.Ed25519,
    seed: TypedArrayEncoder.fromString("00000000000000000000000000issuer"),
  })

  // const {
  //   didState: { did: issuerDid },
  // } = await issuer.dids.create({
  //   method: "key",
  //   options: {
  //     keyType: KeyType.Ed25519,
  //     privateKey: TypedArrayEncoder.fromString(
  //       "00000000000000000000000000issuer"
  //     ),
  //   },
  // })

  // if (!issuerDid) {
  //   throw new Error("Issuer DID not created")
  // }

  function createRemoteSigner(): RemoteSigner {
    return {
      type: "remote",
      async reserveSize() {
        return 64
      },
      async sign({ reserveSize, toBeSigned }: SignInput) {
        const res = await issuer.context.wallet.sign({
          data: toBeSigned,
          key,
        })
        return res
      },
    }
  }

  const buffer = await readFile(`${uploadDir}/frame.png`)
  const asset = { buffer, mimeType: "image/png" }
  const signer = createRemoteSigner()
  const c2pa = createC2pa({
    signer,
  })

  const manifest = new ManifestBuilder({
    claim_generator: "ContentSure",
    format: "image/png",
    title: "Frame image",
    assertions: [],
  })

  const { signedAsset, signedManifest } = await c2pa.sign({
    asset,
    manifest,
  })

  console.log("signedManifest", signedManifest)

  await writeFile(`${signedDir}/frame.png`, signedAsset.buffer)
}

app()

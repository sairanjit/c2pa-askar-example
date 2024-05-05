import { KeyType, TypedArrayEncoder } from "@credo-ts/core"
import { issuer } from "./issuer"
import { readFile, writeFile } from "node:fs/promises"
import { createC2pa, RemoteSigner, SignInput, ManifestBuilder } from "c2pa-node"
import { AskarWallet } from "@credo-ts/askar"
import crypto from "crypto"
const fs = require("fs")

const uploadDir = "./uploaded_assets"
const signedDir = "./signed_assets"

async function app() {
  // await issuer.initialize()
  // issuer.config.logger.info("Agents initialized!")

  // // Create did:key with Bls key type for issuer

  // const key = await issuer.wallet.createKey({
  //   keyType: KeyType.Ed25519,
  //   seed: TypedArrayEncoder.fromString("00000000000000000000000000issuer"),
  // })

  // // const {
  // //   didState: { did: issuerDid },
  // // } = await issuer.dids.create({
  // //   method: "key",
  // //   options: {
  // //     keyType: KeyType.Ed25519,
  // //     privateKey: TypedArrayEncoder.fromString(
  // //       "00000000000000000000000000issuer"
  // //     ),
  // //   },
  // // })

  // // if (!issuerDid) {
  // //   throw new Error("Issuer DID not created")
  // // }

  // function createRemoteSigner(): RemoteSigner {
  //   return {
  //     type: "remote",
  //     async reserveSize() {
  //       return 64
  //     },
  //     async sign({ reserveSize, toBeSigned }: SignInput) {
  //       const res = await issuer.context.wallet.sign({
  //         data: toBeSigned,
  //         key,
  //       })
  //       return res
  //     },
  //   }
  // }

  // const buffer = await readFile(`${uploadDir}/frame.png`)
  // const asset = { buffer, mimeType: "image/png" }
  // const signer = createRemoteSigner()
  // const c2pa = createC2pa({
  //   signer,
  // })

  // const manifest = new ManifestBuilder({
  //   claim_generator: "ContentSure",
  //   format: "image/png",
  //   title: "Frame image",
  //   assertions: [],
  // })

  // const { signedAsset, signedManifest } = await c2pa.sign({
  //   asset,
  //   manifest,
  // })

  // console.log("signedManifest", signedManifest)

  // await writeFile(`${signedDir}/frame.png`, signedAsset.buffer)

  // Generate key pair from seed
  function generateKeyPair(seed) {
    // Using synchronous version for simplicity, consider async version in production
    const hash = crypto.createHash("sha256").update(seed).digest("hex")
    return crypto.generateKeyPairSync("ec", {
      namedCurve: "secp256k1", // Example curve, you can choose from P-256, P-384, P-521, etc.
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    })
    // return crypto.generateKeyPairSync("rsa", {
    //   modulusLength: 2048,
    //   publicKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    //   privateKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //     cipher: "aes-256-cbc",
    //     passphrase: hash,
    //   },
    // })
  }

  // Example seed
  const seed = "00000000000000000000000000issuer"

  // Generate key pair
  const keyPair = generateKeyPair(seed)

  // Save keys to PEM files
  fs.writeFileSync("private_key.pem", keyPair.privateKey)
  fs.writeFileSync("public_key.pem", keyPair.publicKey)
}

app()

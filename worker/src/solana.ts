import { Connection, Keypair,LAMPORTS_PER_SOL,PublicKey,sendAndConfirmTransaction,SystemProgram,Transaction, } from "@solana/web3.js"
import base58 from "bs58"

const connection = new Connection("")
export const sendSolana = async(to: string, amount: string) => {
    const keyPair = Keypair.fromSecretKey(base58.decode((process.env.SOL_PRIVATE_KEY ?? "")))
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: keyPair.publicKey,
            toPubkey: new PublicKey(to),
            lamports:parseFloat(amount) * LAMPORTS_PER_SOL
        })

    )
    await sendAndConfirmTransaction(connection, transferTransaction,[keyPair]);
}
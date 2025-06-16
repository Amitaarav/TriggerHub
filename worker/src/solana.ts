import { Connection, Keypair,LAMPORTS_PER_SOL,PublicKey,sendAndConfirmTransaction,SystemProgram,Transaction, } from "@solana/web3.js"
import base58 from "bs58"

const sol_hook = process.env.SOL_HOOK as string;
const connection = new Connection(sol_hook,"finalized")

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
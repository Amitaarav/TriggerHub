import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import base58 from "bs58";

const solHook = process.env.SOL_HOOK;
const privateKey = process.env.SOL_PRIVATE_KEY;

if (!solHook) throw new Error("Missing SOL_HOOK");
if (!privateKey) throw new Error(" Missing SOL_PRIVATE_KEY");

const connection = new Connection(solHook, "confirmed");

export const sendSolana = async (to: string, amount: string) => {
  const keyPair = Keypair.fromSecretKey(base58.decode(privateKey));

  const lamports = Math.floor(Number(amount) * LAMPORTS_PER_SOL);

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keyPair.publicKey,
      toPubkey: new PublicKey(to),
      lamports,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transferTransaction, [keyPair]);

  console.log(`Transaction successful: https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`);

  return signature;
};

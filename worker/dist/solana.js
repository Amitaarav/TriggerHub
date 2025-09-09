"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSolana = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const solHook = process.env.SOL_HOOK;
const privateKey = process.env.SOL_PRIVATE_KEY;
if (!solHook)
    throw new Error("Missing SOL_HOOK");
if (!privateKey)
    throw new Error(" Missing SOL_PRIVATE_KEY");
const connection = new web3_js_1.Connection(solHook, "confirmed");
const sendSolana = (to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const keyPair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(privateKey));
    const lamports = Math.floor(Number(amount) * web3_js_1.LAMPORTS_PER_SOL);
    const transferTransaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
        fromPubkey: keyPair.publicKey,
        toPubkey: new web3_js_1.PublicKey(to),
        lamports,
    }));
    const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transferTransaction, [keyPair]);
    console.log(`Transaction successful: https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`);
    return signature;
});
exports.sendSolana = sendSolana;

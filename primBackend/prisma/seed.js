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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../src/db");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.prismaClient.availableTriggers.createMany({
            data: {
                id: "webhook",
                name: "Webhook",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.C_OtxO1oMYLuFMSgFOpqEgAAAA%26pid%3DApi%26h%3D160&f=1&ipt=bdd553cbf0533c1f495a79de46561541414ec1ef0283ebf6c8f8213841ab5f98&ipo=images"
            }
        });
        yield db_1.prismaClient.availableActions.createMany({
            data: {
                id: "send-email",
                name: "Send Email",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.bVr0TRhutenHao6b3cIWLQHaFy%26pid%3DApi%26h%3D160&f=1&ipt=aff6ac4cc1f07586ce6d792680ff3680b9de38c8cb42db27d976ed64edbbdac4&ipo=images"
            }
        });
        yield db_1.prismaClient.availableActions.createMany({
            data: {
                id: "send-solana",
                name: "Solana",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.pEB9p5AtMa_JPkWtyiu8LAHaHa%26pid%3DApi&f=1&ipt=685bc1fd3c79df88a26e24f5a310f9ac2f73bd423802bfbf1bce790fd360a4d5&ipo=images"
            }
        });
    });
}

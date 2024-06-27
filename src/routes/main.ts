import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { Router, Request, Response, response } from "express";

const mainRoute = Router();

const mainGET = async (req: Request, res: Response) => {
  try {
    const payload: ActionGetResponse = {
      title: "Buy Be A Coffee",
      icon: "http://solaction.aaraz.me/aaz.png",
      description:
        "You are about to send be some SOL to me keep me motivated toward Web3 development. ",
      label: "1 SOL cheers!",
      links: {
        actions: [
          {
            label: "Cheers !!", // button text
            href: `https://solaction.aaraz.me?amount={amount}`, // this href will have a text input
            parameters: [
              {
                name: "amount", // parameter name in the `href` above
                label: "Amount of SOL To Send", // placeholder of the text input
                required: true,
              },
            ],
          },
        ],
      },
    };
    return res.header(ACTIONS_CORS_HEADERS).json(payload);
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return res.status(500).header(ACTIONS_CORS_HEADERS).send(message);
  }
};

const mainPOST = async (req: Request, res: Response) => {
  const { amount } = req.query;
  const toAddress = "3pt1fCSbikqpErQ1TAffEkeXxqWdok6D38JTBzY1iq1M";
  const { account } = req.body;

  if (account === undefined) {
    return res
      .status(400)
      .header(ACTIONS_CORS_HEADERS)
      .send("Missing account parameter");
  }

  const myaccount = new PublicKey(toAddress);
  const senderaccount = new PublicKey(account);
  const connection = new Connection(clusterApiUrl("mainnet-beta")); // Add your rpc url here for better performance
  const transaction = new Transaction();
  transaction.feePayer = senderaccount;

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: senderaccount,
      toPubkey: myaccount,
      lamports: Number(amount) * LAMPORTS_PER_SOL,
    })
  );
  transaction.feePayer = senderaccount;

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction,
      message: `Send ${amount} SOL to ${myaccount.toBase58()}`,
    },
  });

  return res.header(ACTIONS_CORS_HEADERS).json(payload);
};

mainRoute.get("/", mainGET);
mainRoute.options("/", mainGET);
mainRoute.post("/", mainPOST);

export { mainRoute };

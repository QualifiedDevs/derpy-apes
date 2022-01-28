import axios from "axios";

import { AuthData, authStage } from "@api/authorizePresaleMint";

async function getMintAuth(account: string, stage: authStage) {
  
  let data: AuthData | null = null;

  try {
    console.log("Requesting Whitelist Authorization...");
    const res = await axios.get(`/api/authorizePresaleMint?account=${account}&stage=${stage}`);
    data = res.data;
    console.log("Whitelist Authorized:", data);
  } catch (err) {
    console.error("Whitelist Denied");
  }

  return data;
}

export default getMintAuth;
import axios from "axios";

import type { AuthData } from "@api/authorizePresaleMint";

async function getMintAuth(account: string) {
  
  let data: AuthData | null = null;

  try {
    console.log("Requesting Whitelist Authorization...");
    const res = await axios.get(`/api/authorizePresaleMint?account=${account}`);
    data = res.data;
    console.log("Whitelist Authorized:", data);
  } catch (err) {
    console.error("Whitelist Denied");
  }

  return data;
}

export default getMintAuth;

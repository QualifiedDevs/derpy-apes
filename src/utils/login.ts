import axios from "axios";

const loginAPI = axios.create({
  baseURL: "/login",
});

import formatRes from "@utils/formatRes";

// * LOGIN

export async function login(walletAddress: string, message: string) {
  const [data, err] = await formatRes(
    loginAPI.get("/login", {
      params: {
        walletAddress,
        message,
      },
    })
  );
  if (err) console.error(err);
  return data;
}
import Web3 from "web3";

//? How do I know whether this is mainnet or testnet? Is it determined here?
const web3 = new Web3("ws://remotenode.com:8546");

async function sign(
  privateKey: string,
  contractAddress: string,
  account: string
) {
  const content = web3.utils.soliditySha3(
    { t: "address", v: contractAddress },
    { t: "address", v: account }
  );

  const { messageHash: hash, signature } = await web3.eth.accounts.sign(
    content,
    privateKey
  );

  return { hash, signature };
}

export default sign;

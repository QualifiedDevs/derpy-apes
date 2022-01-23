//@ts-nocheck

const { expect } = require("chai");
// const { ethers } = require("ethers");
// const web3 = require("web3");
const { sign } = require("../utils/sign");
// const Strange = artifacts.require("Strange");
const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const params = require("../config.js");

describe("Gas", function () {
  let contractInstance;
  beforeEach(async () => {
    const Strange = await ethers.getContractFactory("Strange");
    contractInstance = await Strange.deploy(
      "ipfs://cid",
      params.keyHash,
      params.vrfCoordinator,
      params.linkToken,
      params.linkFee,
      params.wallets,
      params.shares,
      params.OSproxy
    );
    signer = "0x8144103086c2D60f67375982cab147B7e68a58FE";

    await contractInstance.setSigner(signer);

    await contractInstance.setPaused(false);
  });

  it("Presale mint", async function () {
    await contractInstance.deployed();

    const [owner, purchaser, acc1, acc2] = await ethers.getSigners();

    await contractInstance.gift([acc2.address]);
    console.log("start by gifting one to init the count and reduce next gas");
    const { hash: h, signature: s } = await sign(
      contractInstance.address,
      purchaser.address
    );
    const { hash: h1, signature: s1 } = await sign(
      contractInstance.address,
      acc1.address
    );

    // console.log("returned", { h, s });

    const tx = await contractInstance
      .connect(purchaser)
      .presalePurchase(1, h, s, {
        value: ethers.utils.parseEther("0.08"),
      });

    const tx1 = await contractInstance
      .connect(acc1)
      .presalePurchase(1, h1, s1, {
        value: ethers.utils.parseEther("0.08"),
      });
    const tx2 = await contractInstance
      .connect(purchaser)
      .presalePurchase(1, h, s, {
        value: ethers.utils.parseEther("0.08"),
      });
    const tx3 = await contractInstance
      .connect(acc1)
      .presalePurchase(1, h1, s1, {
        value: ethers.utils.parseEther("0.08"),
      });

    mined = await tx.wait();
    mined1 = await tx1.wait();
    mined2 = await tx2.wait();
    mined3 = await tx3.wait();

    console.log("transax", {
      a: mined.gasUsed,
      r: mined1.gasUsed,
      s: mined2.gasUsed,
      t: mined3.gasUsed,
    });
    const supply = await contractInstance.totalSupply();
    const maxTokenId = await contractInstance.maxTokenId();

    console.log("token count", supply);
    console.log({ maxTokenId });
  });

  it("Minting Multiple, PUBLIC", async function () {
    await contractInstance.deployed();

    const [acc1, acc2, acc3] = await ethers.getSigners();

    await contractInstance.gift([acc3.address]);
    // await contractInstance.setPaused(false);
    await contractInstance.setPresale(false);
    const tx = await contractInstance
      .connect(acc1)
      .purchase(2, {
        value: ethers.utils.parseEther("0.16"),
      })
      .then((tx) => tx.wait());
    const tx1 = await contractInstance
      .connect(acc2)
      .purchase(4, {
        value: ethers.utils.parseEther("0.32"),
      })
      .then((tx) => tx.wait());

    console.log("Public Multiples", {
      "Purchase 2": tx.gasUsed,
      "Purchase 4": tx1.gasUsed,
    });
  });

  it("Minting Multiple, PRESALE", async function () {
    await contractInstance.deployed();

    const [acc1, acc2, acc3] = await ethers.getSigners();

    await contractInstance.gift([acc3.address]);
    // await contractInstance.setPaused(false);
    const { hash: h1, signature: s1 } = await sign(
      contractInstance.address,
      acc1.address
    );
    const { hash: h2, signature: s2 } = await sign(
      contractInstance.address,
      acc2.address
    );

    const tx = await contractInstance
      .connect(acc1)
      .presalePurchase(2, h1, s1, {
        value: ethers.utils.parseEther("0.16"),
      })
      .then((tx) => tx.wait());
    const tx1 = await contractInstance
      .connect(acc2)
      .presalePurchase(4, h2, s2, {
        value: ethers.utils.parseEther("0.32"),
      })
      .then((tx) => tx.wait());

    console.log("Presale Multiples", {
      "Purchase 2": tx.gasUsed,
      "Purchase 4": tx1.gasUsed,
    });
  });
  // Sorry not sorry this is very long and repetative
  it("public mint", async function () {
    await contractInstance.deployed();

    const [acc1, acc2, acc3, acc4, acc5, acc6] = await ethers.getSigners();

    await contractInstance.gift([acc6.address]);
    // await contractInstance.setPaused(false);
    await contractInstance.setPresale(false);

    const tx = await contractInstance
      .connect(acc1)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx1 = await contractInstance
      .connect(acc1)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx2 = await contractInstance
      .connect(acc1)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx3 = await contractInstance
      .connect(acc1)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx4 = await contractInstance
      .connect(acc2)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx5 = await contractInstance
      .connect(acc3)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx5_2 = await contractInstance
      .connect(acc3)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx6 = await contractInstance
      .connect(acc4)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx7 = await contractInstance
      .connect(acc5)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx8 = await contractInstance
      .connect(acc6)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx9 = await contractInstance
      .connect(acc6)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());
    const tx10 = await contractInstance
      .connect(acc6)
      .purchase(1, {
        value: ethers.utils.parseEther("0.08"),
      })
      .then((tx) => tx.wait());

    console.log("transax", {
      a: tx.gasUsed,
      b: tx1.gasUsed,
      r: tx2.gasUsed,
      s: tx3.gasUsed,
      t: tx4.gasUsed,
      c: tx5.gasUsed,
      x: tx5_2.gasUsed,
      d: tx6.gasUsed,
      q: tx7.gasUsed,
      w: tx8.gasUsed,
      w: tx9.gasUsed,
      w: tx10.gasUsed,
    });
    const z = await contractInstance.tokenURI(0);
    const twelve = await contractInstance.tokenURI(12);
    const supply = await contractInstance.maxTokenId();
    console.log("start", z);
    console.log("end", twelve);
    console.log("token count", supply);
  });

  it("set approval", async () => {
    const [owner, purchaser, acc1, acc2] = await ethers.getSigners();

    await contractInstance.setApprovalForAll(acc1.address, true);
    await contractInstance.setApprovalForAll(acc2.address, true);
    await contractInstance.setApprovalForAll(purchaser.address, true);
  });
});
const hre = require("hardhat");

async function main() {
  console.log("Deploying PolarSci contract...");

  const PolarSci = await hre.ethers.getContractFactory("PolarSci");
  const polarSci = await PolarSci.deploy();
  await polarSci.deployed();

  console.log("PolarSci deployed to:", polarSci.address);
  console.log("Transaction hash:", polarSci.deployTransaction.hash);

  // Wait for 5 block confirmations
  await polarSci.deployTransaction.wait(5);
  console.log("Confirmed 5 blocks");

  // Verify contract
  try {
    await hre.run("verify:verify", {
      address: polarSci.address,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
  } catch (error) {
    console.log("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
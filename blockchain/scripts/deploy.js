const { ethers } = require("hardhat");

/**
 * @title Deployment script for the Certificate contract.
 * @dev This script handles the deployment of the Certificate contract to the blockchain.
 */
async function main() {
  // A Signer in ethers.js is an object that represents an Ethereum account.
  // We get the deployer's account here.
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // The ContractFactory in ethers.js is an abstraction used to deploy new smart contracts.
  const CertificateFactory = await ethers.getContractFactory("Certificate");

  // Deploy the contract.
  const certificateContract = await CertificateFactory.deploy();

  // The `deployed()` method returns a Promise that resolves once the contract is deployed.
  await certificateContract.waitForDeployment();

  console.log(
    "Certificate contract deployed to:",
    await certificateContract.getAddress()
  );
}

/**
 * @dev We recommend this pattern to be able to use async/await everywhere
 * and properly handle errors.
 */
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

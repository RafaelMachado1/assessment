const { ethers } = require("hardhat");
const CertificateABI = require("../artifacts/contracts/Certificate.sol/Certificate.json").abi;

/**
 * @title Verify Last Transaction
 * @dev This script inspects the last transaction in the most recent block
 * to find and parse the 'CertificateIssued' event.
 */
async function main() {
  console.log("Connecting to the blockchain...");

  // Get the latest block number
  const latestBlockNumber = await ethers.provider.getBlockNumber();
  console.log(`Searching in the latest block: #${latestBlockNumber}`);

  // Get the full details of the latest block
  const block = await ethers.provider.getBlock(latestBlockNumber);

  if (!block || block.transactions.length === 0) {
    console.log("Error: No transactions found in the latest block.");
    return;
  }

  // Get the hash of the very last transaction in that block
  const txHash = block.transactions[block.transactions.length - 1];
  console.log(`Analyzing Transaction Hash: ${txHash}`);

  // Get the receipt of the transaction, which contains the logs (events)
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  if (!receipt) {
    console.log("Error: Could not get transaction receipt.");
    return;
  }

  // The ABI is the "map" of the contract. We create an Interface object
  // to help us understand the event data.
  const iface = new ethers.Interface(CertificateABI);
  let eventFound = false;

  // We loop through all the logs in the receipt
  for (const log of receipt.logs) {
    try {
      const parsedLog = iface.parseLog(log);
      // We check if the log name matches the event we are looking for
      if (parsedLog && parsedLog.name === "CertificateIssued") {
        console.log("\n✅ --- Certificate Issued Event Found! ---");
        console.log(`   Certificate ID: ${parsedLog.args.certificateId}`);
        console.log(`   Student Address: ${parsedLog.args.studentAddress}`);
        console.log(`   IPFS Hash (CID): ${parsedLog.args.ipfsHash}`);
        console.log("------------------------------------------\n");
        console.log("Verification successful! The CID was correctly stored on the blockchain.");
        eventFound = true;
        break; // Exit the loop once we find our event
      }
    } catch (error) {
      // This log is not from our Certificate contract, so we safely ignore it
    }
  }

  if (!eventFound) {
    console.log("\n❌ --- Event Not Found ---");
    console.log("Could not find the 'CertificateIssued' event in the last transaction's logs.");
    console.log("This might mean the transaction that was executed was not the one we expected,");
    console.log("or it failed to emit the event.");
    console.log("---------------------------\n");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exitCode = 1;
});

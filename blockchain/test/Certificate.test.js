const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

/**
 * @title Test suite for the Certificate contract
 * @dev We use loadFixture to run a setup function once, snapshot that state,
 * and reset Hardhat Network to that snapshot in every test.
 */
describe("Certificate Contract", function () {
  // Fixture to deploy the contract and get signers
  async function deployCertificateFixture() {
    const [owner, student, otherAccount] = await ethers.getSigners();
    const CertificateFactory = await ethers.getContractFactory("Certificate");
    const certificateContract = await CertificateFactory.deploy();
    return { certificateContract, owner, student, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { certificateContract, owner } = await loadFixture(
        deployCertificateFixture
      );
      expect(await certificateContract.owner()).to.equal(owner.address);
    });
  });

  describe("Certificate Issuance", function () {
    const studentName = "John Doe";
    const courseName = "Blockchain Basics";
    const ipfsHash = "QmXo9Sj...o9sJ"; // Example IPFS hash

    it("Should allow the owner to issue a certificate", async function () {
      const { certificateContract, student } = await loadFixture(
        deployCertificateFixture
      );

      // The transaction should emit the CertificateIssued event
      await expect(
        certificateContract.issueCertificate(
          student.address,
          studentName,
          courseName,
          ipfsHash
        )
      ).to.emit(certificateContract, "CertificateIssued");
    });

    it("Should not allow non-owners to issue a certificate", async function () {
      const { certificateContract, student, otherAccount } = await loadFixture(
        deployCertificateFixture
      );

      // Expect the transaction to be reverted because it's not called by the owner
      await expect(
        certificateContract
          .connect(otherAccount)
          .issueCertificate(student.address, studentName, courseName, ipfsHash)
      ).to.be.revertedWith("Certificate: caller is not the owner");
    });

    it("Should revert if the student address is the zero address", async function () {
      const { certificateContract } = await loadFixture(
        deployCertificateFixture
      );
      const zeroAddress = ethers.ZeroAddress;

      await expect(
        certificateContract.issueCertificate(
          zeroAddress,
          studentName,
          courseName,
          ipfsHash
        )
      ).to.be.revertedWith("Certificate: invalid student address");
    });

    it("Should revert if the IPFS hash is empty", async function () {
      const { certificateContract, student } = await loadFixture(
        deployCertificateFixture
      );

      await expect(
        certificateContract.issueCertificate(
          student.address,
          studentName,
          courseName,
          "" // Empty IPFS hash
        )
      ).to.be.revertedWith("Certificate: IPFS hash cannot be empty");
    });
  });

  describe("Certificate Verification", function () {
    const studentName = "Jane Smith";
    const courseName = "Advanced Solidity";
    const ipfsHash = "QmYt7g...t7gP"; // Another example IPFS hash

    it("Should return the correct details for a valid certificate", async function () {
      const { certificateContract, student } = await loadFixture(
        deployCertificateFixture
      );

      // Issue a certificate and get the transaction receipt to find the event
      const tx = await certificateContract.issueCertificate(
        student.address,
        studentName,
        courseName,
        ipfsHash
      );
      const receipt = await tx.wait();

      // Find the CertificateIssued event in the transaction logs
      const event = receipt.logs.find(
        (e) => e.fragment && e.fragment.name === "CertificateIssued"
      );
      const certificateId = event.args.certificateId;

      // Verify the certificate
      const [isValid, sName, cName, iHash, iDate] =
        await certificateContract.verifyCertificate(certificateId);

      expect(isValid).to.be.true;
      expect(sName).to.equal(studentName);
      expect(cName).to.equal(courseName);
      expect(iHash).to.equal(ipfsHash);
      expect(iDate).to.be.gt(0); // Issue date should be greater than 0
    });

    it("Should return invalid for a non-existent certificate ID", async function () {
      const { certificateContract } = await loadFixture(
        deployCertificateFixture
      );
      const fakeCertificateId = ethers.keccak256(ethers.toUtf8Bytes("fake-id"));

      const [isValid] = await certificateContract.verifyCertificate(
        fakeCertificateId
      );

      expect(isValid).to.be.false;
    });
  });
});

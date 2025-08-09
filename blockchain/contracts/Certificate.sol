// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Certificate
 * @dev A smart contract for issuing and verifying student certificates.
 * Certificates are linked to a student's address and an IPFS hash for metadata.
 */
contract Certificate {
    // The address of the contract owner (e.g., the school administration)
    address public owner;

    // A structure to hold the details of each certificate
    struct CertificateDetails {
        string studentName; // Name of the student
        string courseName;  // Name of the course or achievement
        string ipfsHash;    // IPFS hash of the certificate document
        uint256 issueDate;  // Timestamp when the certificate was issued
    }

    // A mapping from a unique certificate ID to its details
    mapping(bytes32 => CertificateDetails) public certificates;

    // An event that is emitted when a new certificate is issued
    event CertificateIssued(
        bytes32 indexed certificateId,
        address indexed studentAddress,
        string ipfsHash
    );

    // A modifier to restrict certain functions to only be callable by the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Certificate: caller is not the owner");
        _;
    }

    /**
     * @dev Sets the contract owner to the address that deploys it.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Issues a new certificate.
     * @dev Can only be called by the contract owner.
     * @param studentAddress The Ethereum address of the student.
     * @param studentName The name of the student.
     * @param courseName The name of the course.
     * @param ipfsHash The IPFS hash of the certificate metadata.
     * @return certificateId The unique ID of the newly issued certificate.
     */
    function issueCertificate(
        address studentAddress,
        string memory studentName,
        string memory courseName,
        string memory ipfsHash
    ) public onlyOwner returns (bytes32) {
        require(studentAddress != address(0), "Certificate: invalid student address");
        require(bytes(ipfsHash).length > 0, "Certificate: IPFS hash cannot be empty");

        // Generate a unique ID for the certificate
        bytes32 certificateId = keccak256(abi.encodePacked(studentAddress, ipfsHash, block.timestamp));

        // Store the certificate details
        certificates[certificateId] = CertificateDetails({
            studentName: studentName,
            courseName: courseName,
            ipfsHash: ipfsHash,
            issueDate: block.timestamp
        });

        // Emit an event to log the issuance
        emit CertificateIssued(certificateId, studentAddress, ipfsHash);

        return certificateId;
    }

    /**
     * @notice Verifies the authenticity of a certificate.
     * @dev This function is public and can be called by anyone.
     * @param certificateId The ID of the certificate to verify.
     * @return A boolean indicating if the certificate exists, and its details.
     */
    function verifyCertificate(bytes32 certificateId)
        public
        view
        returns (
            bool,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        CertificateDetails storage cert = certificates[certificateId];
        // A certificate is considered valid if its issue date is not zero
        bool isValid = cert.issueDate != 0;

        return (
            isValid,
            cert.studentName,
            cert.courseName,
            cert.ipfsHash,
            cert.issueDate
        );
    }
}

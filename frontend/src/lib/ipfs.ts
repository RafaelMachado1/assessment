const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

if (!PINATA_JWT) {
  console.error("Certifique-se de definir VITE_PINATA_JWT no seu arquivo .env");
}

/**
 * Armazena os metadados de um certificado no IPFS usando o Pinata.
 * @param metadata - Os dados do certificado a serem armazenados.
 * @returns O hash (CID) do conteúdo no IPFS.
 */
export async function storeCertificateMetadata(metadata: Record<string, any>): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("VITE_PINATA_JWT não está definido.");
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `Certificado - ${metadata.studentName || 'Aluno'}`
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro no Pinata: ${errorData.error?.details || response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error("Erro ao armazenar metadados no IPFS:", error);
    throw error;
  }
}

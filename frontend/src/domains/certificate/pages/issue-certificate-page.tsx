import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAccount, useWriteContract } from 'wagmi';
import { PageContentHeader } from '@/components/page-content-header';
import { storeCertificateMetadata } from '@/lib/ipfs';
import { certificateContractConfig } from '@/config/blockchain';

export const IssueCertificatePage = () => {
  const [studentAddress, setStudentAddress] = useState('');
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending: isIssuing, isSuccess, error } = useWriteContract();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const ipfsHash = await storeCertificateMetadata({ studentName, courseName });
      
      if (!ipfsHash) {
        console.error("O hash IPFS retornado está vazio. Abortando a transação.");
        // Você pode adicionar um estado de erro aqui para notificar o usuário na UI
        return;
      }

      writeContract({
        address: certificateContractConfig.address,
        abi: certificateContractConfig.abi,
        functionName: 'issueCertificate',
        args: [studentAddress, studentName, courseName, ipfsHash],
      });
    } catch (e) {
      console.error('Erro ao gerar hash IPFS ou ao chamar o contrato:', e);
    }
  };

  return (
    <Container>
      <PageContentHeader heading="Emitir Novo Certificado" />
      <Card>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Endereço da Carteira do Aluno"
              name="studentAddress"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Nome do Aluno"
              name="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Nome do Curso"
              name="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isIssuing || !connectedAddress}
            >
              {isIssuing ? <CircularProgress size={24} /> : 'Emitir Certificado'}
            </Button>
            {!connectedAddress && (
              <Alert severity="warning">Por favor, conecte sua carteira para emitir um certificado.</Alert>
            )}
            {isSuccess && (
                <Alert severity="success">
                    Certificado emitido com sucesso!
                </Alert>
            )}
            {error && (
                <Alert severity="error">
                    Erro ao emitir certificado: {error.message}
                </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

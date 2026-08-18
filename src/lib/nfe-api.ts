import axios from 'axios';

import { buildCertificateHeaders, loadCertificateConfig } from '@/lib/certificate-storage';
import {
    Ambiente,
    CancelarRequest,
    CartaCorrecaoRequest,
    ConsultaRequest,
    EmitirRequest,
    InutilizarRequest,
    Uf,
} from '@/types/nfe';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5082',
    timeout: 30000,
});

export async function getApiHeaders() {
    const cert = await loadCertificateConfig();
    return buildCertificateHeaders(cert);
}

export async function emitirNfe(payload: EmitirRequest, gerarDanfe: boolean) {
    const headers = await getApiHeaders();

    return api.post('/api/v1/nfe/emitir', payload, {
        params: { gerarDanfe },
        headers,
    });
}

export async function getNfeStatus(correlationId: string) {
    const headers = await getApiHeaders();
    return api.get(`/api/v1/nfe/status/${correlationId}`, { headers });
}

export async function getStatusServico(uf: Uf, ambiente: Ambiente) {
    const headers = await getApiHeaders();
    return api.get('/api/v1/nfe/status-servico', {
        params: { uf, ambiente },
        headers,
    });
}

export async function consultarNfe({ chave, uf, ambiente }: ConsultaRequest) {
    const headers = await getApiHeaders();
    return api.get('/api/v1/nfe/consulta', {
        params: { chave, uf, ambiente },
        headers,
    });
}

export async function cancelarNfe(payload: CancelarRequest) {
    const headers = await getApiHeaders();
    return api.post('/api/v1/nfe/cancelar', payload, { headers });
}

export async function enviarCartaCorrecao(payload: CartaCorrecaoRequest) {
    const headers = await getApiHeaders();
    return api.post('/api/v1/nfe/cce', payload, { headers });
}

export async function inutilizarNfe(payload: InutilizarRequest) {
    const headers = await getApiHeaders();
    return api.post('/api/v1/nfe/inutilizar', payload, { headers });
}

export async function getCertificadoInfo(base64: string, password: string) {
    const headers = {
        'X-Certificado-Base64': base64,
        'X-Certificado-Senha': password,
    };

    return api.post('/api/v1/certificado/info', null, { headers });
}

export default api;

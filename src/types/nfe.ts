export type Ambiente = '1' | '2';

export type Uf =
    | 'AC'
    | 'AL'
    | 'AM'
    | 'AP'
    | 'BA'
    | 'CE'
    | 'DF'
    | 'ES'
    | 'GO'
    | 'MA'
    | 'MG'
    | 'MS'
    | 'MT'
    | 'PA'
    | 'PB'
    | 'PE'
    | 'PI'
    | 'PR'
    | 'RJ'
    | 'RN'
    | 'RO'
    | 'RR'
    | 'RS'
    | 'SC'
    | 'SE'
    | 'SP'
    | 'TO';

export type CertificateConfig = {
    base64: string;
    password: string;
    certPemBase64?: string;
    keyPemBase64?: string;
};

export type ApiResponse<T = unknown> = {
    data?: T;
    status?: number;
    message?: string;
};

export type EmitirRequest = Record<string, unknown>;

export type StatusResponse = {
    correlationId?: string;
    status?: string;
    message?: string;
    [key: string]: unknown;
};

export type ConsultaRequest = {
    chave: string;
    uf: Uf;
    ambiente: Ambiente;
};

export type CancelarRequest = {
    ambiente: Ambiente;
    uf: Uf;
    chaveAcesso: string;
    cnpjEmitente: string;
    protocoloAutorizacao: string;
    justificativa: string;
};

export type CartaCorrecaoRequest = {
    ambiente: Ambiente;
    uf: Uf;
    chaveAcesso: string;
    cnpjEmitente: string;
    correcao: string;
    sequenciaEvento?: number;
};

export type InutilizarRequest = {
    ambiente: Ambiente;
    uf: Uf;
    cnpjEmitente: string;
    ano: string;
    serie: string;
    numeroInicial: number;
    numeroFinal: number;
    justificativa: string;
    modelo?: string;
};

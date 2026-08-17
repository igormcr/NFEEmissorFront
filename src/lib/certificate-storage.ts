import * as SecureStore from 'expo-secure-store';

import { CertificateConfig } from '@/types/nfe';

const CERTIFICATE_KEY = 'nfe.certificate.config.v1';

async function secureGetItem(key: string): Promise<string | null> {
    // Prefer SecureStore when available and has expected API
    // Some runtimes (web) may not expose the same implementation, so fallback to localStorage
    try {
        if (typeof (SecureStore as any).getItemAsync === 'function') {
            return await (SecureStore as any).getItemAsync(key);
        }
    } catch {
        // ignore and fallback
    }

    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
    }

    return null;
}

async function secureSetItem(key: string, value: string): Promise<void> {
    try {
        if (typeof (SecureStore as any).setItemAsync === 'function') {
            await (SecureStore as any).setItemAsync(key, value);
            return;
        }
    } catch {
        // ignore and fallback
    }

    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
    }
}

async function secureDeleteItem(key: string): Promise<void> {
    try {
        if (typeof (SecureStore as any).deleteItemAsync === 'function') {
            await (SecureStore as any).deleteItemAsync(key);
            return;
        }
    } catch {
        // ignore and fallback
    }

    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
    }
}

export async function saveCertificateConfig(config: CertificateConfig): Promise<void> {
    await secureSetItem(CERTIFICATE_KEY, JSON.stringify(config));
}

export async function loadCertificateConfig(): Promise<CertificateConfig | null> {
    const raw = await secureGetItem(CERTIFICATE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as CertificateConfig;
    } catch {
        return null;
    }
}

export async function clearCertificateConfig(): Promise<void> {
    await secureDeleteItem(CERTIFICATE_KEY);
}

export function buildCertificateHeaders(config?: CertificateConfig | null): Record<string, string> {
    const normalized = config ?? null;

    return {
        'X-Certificado-Base64': normalized?.base64 ?? '',
        'X-Certificado-Senha': normalized?.password ?? '',
        'X-Cert-Pem-Base64': normalized?.certPemBase64 ?? '',
        'X-Key-Pem-Base64': normalized?.keyPemBase64 ?? '',
    };
}

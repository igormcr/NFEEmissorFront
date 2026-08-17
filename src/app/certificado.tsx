import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { clearCertificateConfig, loadCertificateConfig, saveCertificateConfig } from '@/lib/certificate-storage';

export default function CertificadoScreen() {
    const [base64, setBase64] = useState('');
    const [password, setPassword] = useState('');
    const [certPemBase64, setCertPemBase64] = useState('');
    const [keyPemBase64, setKeyPemBase64] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;

        loadCertificateConfig().then((config) => {
            if (!active || !config) {
                return;
            }

            setBase64(config.base64 ?? '');
            setPassword(config.password ?? '');
            setCertPemBase64(config.certPemBase64 ?? '');
            setKeyPemBase64(config.keyPemBase64 ?? '');
        });

        return () => {
            active = false;
        };
    }, []);

    const handleSave = async () => {
        if (!base64.trim()) {
            Alert.alert('Campo obrigatório', 'Informe o certificado em Base64.');
            return;
        }

        setLoading(true);

        try {
            await saveCertificateConfig({
                base64: base64.trim(),
                password: password.trim(),
                certPemBase64: certPemBase64.trim(),
                keyPemBase64: keyPemBase64.trim(),
            });

            Alert.alert('Sucesso', 'Configuração do certificado salva com segurança.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Não foi possível salvar o certificado.';
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        await clearCertificateConfig();
        setBase64('');
        setPassword('');
        setCertPemBase64('');
        setKeyPemBase64('');
        Alert.alert('Limpo', 'Dados do certificado removidos.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: 'Certificado' }} />
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText type="title">Certificado</ThemedText>

                <View style={styles.section}>
                    <Text style={styles.label}>X-Certificado-Base64</Text>
                    <TextInput
                        value={base64}
                        onChangeText={setBase64}
                        placeholder="Cole o conteúdo base64 do certificado"
                        multiline
                        style={styles.inputMultiline}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>X-Certificado-Senha</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Senha do certificado"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>X-Cert-Pem-Base64</Text>
                    <TextInput
                        value={certPemBase64}
                        onChangeText={setCertPemBase64}
                        placeholder="Cert PEM em Base64 (opcional)"
                        multiline
                        style={styles.inputMultiline}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>X-Key-Pem-Base64</Text>
                    <TextInput
                        value={keyPemBase64}
                        onChangeText={setKeyPemBase64}
                        placeholder="Key PEM em Base64 (opcional)"
                        multiline
                        style={styles.inputMultiline}
                    />
                </View>

                <View style={styles.actions}>
                    <Pressable onPress={handleSave} style={[styles.primaryButton, loading && styles.disabled]}>
                        <Text style={styles.primaryButtonText}>{loading ? 'Salvando...' : 'Salvar configuração'}</Text>
                    </Pressable>

                    <Pressable onPress={handleClear} style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Limpar</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        padding: 24,
        gap: 18,
    },
    section: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d7dce5',
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#fff',
        color: Colors.light.text,
    },
    inputMultiline: {
        borderWidth: 1,
        borderColor: '#d7dce5',
        borderRadius: 10,
        padding: 12,
        minHeight: 110,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        color: Colors.light.text,
    },
    actions: {
        marginTop: 8,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#0b3d91',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: '#eef3ff',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: Colors.light.text,
        fontWeight: '700',
    },
    disabled: {
        opacity: 0.6,
    },
});

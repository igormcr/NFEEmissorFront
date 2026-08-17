import { Stack } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { emitirNfe } from '@/lib/nfe-api';

const initialPayload = JSON.stringify(
    {
        ambiente: '1',
        uf: 'SP',
        cnpjEmitente: '12345678000199',
        naturezaOperacao: 'Venda de produção do estabelecimento',
        modelo: '55',
        serie: '1',
        numeroNfe: 1,
        dataEmissao: '2026-08-16',
        valorTotal: 100.0,
        destinatario: {
            cnpjCpf: '11122233344',
            nome: 'Cliente Exemplo',
            indicadorIe: '9',
        },
        itens: [
            {
                codigo: '1',
                descricao: 'Produto de teste',
                quantidade: 1,
                valorUnitario: 100.0,
                valorTotal: 100.0,
            },
        ],
    },
    null,
    2,
);

export default function EmitirScreen() {
    const [payloadText, setPayloadText] = useState(initialPayload);
    const [gerarDanfe, setGerarDanfe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleEmitir = async () => {
        setLoading(true);
        try {
            const parsed = JSON.parse(payloadText);
            const response = await emitirNfe(parsed, gerarDanfe);
            setResult(JSON.stringify(response.data ?? response, null, 2));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Não foi possível emitir a NFe.';
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: 'Emitir NFe' }} />
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText type="title">Emitir NFe</ThemedText>

                <View style={styles.row}>
                    <Text style={styles.label}>Gerar DANFE</Text>
                    <Switch value={gerarDanfe} onValueChange={setGerarDanfe} />
                </View>

                <Text style={styles.label}>Payload JSON</Text>
                <TextInput
                    value={payloadText}
                    onChangeText={setPayloadText}
                    multiline
                    style={styles.textArea}
                    textAlignVertical="top"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Pressable onPress={handleEmitir} style={[styles.primaryButton, loading && styles.disabled]}>
                    <Text style={styles.primaryButtonText}>{loading ? 'Enviando...' : 'Emitir NFe'}</Text>
                </Pressable>

                {result ? (
                    <View style={styles.resultBox}>
                        <ThemedText type="smallBold">Resposta</ThemedText>
                        <Text style={styles.resultText}>{result}</Text>
                    </View>
                ) : null}
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    textArea: {
        minHeight: 260,
        borderWidth: 1,
        borderColor: '#d7dce5',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#fff',
        color: Colors.light.text,
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
    disabled: {
        opacity: 0.7,
    },
    resultBox: {
        backgroundColor: '#eef3ff',
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    resultText: {
        fontSize: 12,
        color: Colors.light.text,
    },
});

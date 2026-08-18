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
        ambienteEmissao: '1',
        serie: '1',
        numeroNfe: 1,
        naturezaOperacao: 'Venda de produção do estabelecimento',
        tipoOperacao: '2',
        formatoImpressaoDanfe: '1',
        tipoEmissao: '1',
        finalidadeEmissao: '1',
        consumidorFinal: '0',
        indicadorPresencaComprador: '0',
        emitente: {
            cnpj: '12345678000199',
            razaoSocial: 'Empresa Exemplo LTDA',
            nomeFantasia: 'Empresa Exemplo',
            inscricaoEstadual: '123456789',
            inscricaoMunicipal: '12345678',
            cnaeFiscal: '4751201',
            codigoRegimeTributario: '3',
            endereco: {
                logradouro: 'Rua Exemplo',
                numero: '123',
                complemento: 'Sala 1',
                bairro: 'Centro',
                codigoMunicipio: '3550308',
                nomeMunicipio: 'São Paulo',
                uf: 'SP',
                cep: '01000-000',
                codigoPais: '1058',
                nomePais: 'Brasil',
                telefone: '(11) 99999-9999',
            },
        },
        destinatario: {
            cnpj: '11122233344',
            nomeRazaoSocial: 'Cliente Exemplo',
            inscricaoEstadual: '123456789',
            indicadorIe: '9',
            email: 'cliente@email.com',
            endereco: {
                logradouro: 'Rua do Cliente',
                numero: '456',
                complemento: 'Apto 10',
                bairro: 'Jardim Paulista',
                codigoMunicipio: '3550308',
                nomeMunicipio: 'São Paulo',
                uf: 'SP',
                cep: '01311-000',
                codigoPais: '1058',
                nomePais: 'Brasil',
                telefone: '(11) 98888-8888',
            },
        },
        produtos: [
            {
                codigoProduto: '1',
                codigoEan: '7891234567890',
                descricao: 'Produto de teste',
                ncmSh: '62052000',
                cfop: '5102',
                unidadeComercial: 'UN',
                quantidadeComercial: 1,
                valorUnitarioComercial: 100.0,
                valorBruto: 100.0,
                unidadeTributavel: 'UN',
                quantidadeTributavel: 1,
                valorUnitarioTributavel: 100.0,
                valorFrete: 0,
                valorSeguro: 0,
                valorDesconto: 0,
                valorOutrasDespesas: 0,
                indicadorComposicaoTotal: '1',
                impostos: {
                    icms: {
                        cst: '00',
                        origem: '0',
                        baseCalculo: 100.0,
                        modalidadeBaseCalculo: '3',
                        aliquota: 18.0,
                        valor: 18.0,
                        baseCalculoSt: 0,
                        modalidadeBaseCalculoSt: '4',
                        aliquotaSt: 0,
                        valorSt: 0,
                        mvaAjustado: 0,
                        percentualReducaoBaseCalculo: 0,
                        percentualDiferimento: 0,
                        valorIcmsDiferido: 0,
                        valorIcmsOperacao: 0,
                        valorDesonerado: 0,
                        percentualFcp: 0,
                        valorFcp: 0,
                    },
                    pis: {
                        cst: '01',
                        baseCalculo: 100.0,
                        aliquota: 0.65,
                        valor: 0.65,
                    },
                    cofins: {
                        cst: '01',
                        baseCalculo: 100.0,
                        aliquota: 3.0,
                        valor: 3.0,
                    },
                },
            },
        ],
        transporte: {
            modalidadeFrete: '9',
        },
        pagamentos: [
            {
                meioPagamento: '01',
                valor: 100.0,
            },
        ],
        notasReferenciadas: [],
        informacoesAdicionais: 'Pedido de teste',
        informacoesAdicionaisFisco: '',
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

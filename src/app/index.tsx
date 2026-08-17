import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionCard } from '@/components/section-card';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { loadCertificateConfig } from '@/lib/certificate-storage';

const quickActions = [
  { label: 'Emitir NFe', href: '/emitir' },
  { label: 'Consultar NFe', href: '/consultar' },
  { label: 'Status de processamento', href: '/status' },
  { label: 'Ações NFe', href: '/acoes' },
] as const;

export default function HomeScreen() {
  const [certificateReady, setCertificateReady] = useState(false);

  useEffect(() => {
    let active = true;

    loadCertificateConfig().then((config) => {
      if (active) {
        setCertificateReady(Boolean(config?.base64));
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const background = Colors.light.background;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title">NFe Emissor</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Integração com o backend para emissão, consulta e operações fiscais.
        </ThemedText>

        <SectionCard
          title="Certificado digital"
          subtitle={certificateReady ? 'Certificado carregado e pronto para uso.' : 'Nenhum certificado salvo ainda.'}
          action={
            <Link href="/certificado" asChild>
              <Pressable style={styles.inlineButton}>
                <ThemedText type="linkPrimary">Configurar</ThemedText>
              </Pressable>
            </Link>
          }>
          <View style={styles.rowBetween}>
            <ThemedText type="small">Status</ThemedText>
            <ThemedText type="small" style={styles.statusPill}>
              {certificateReady ? 'Ativo' : 'Pendente'}
            </ThemedText>
          </View>
        </SectionCard>

        <SectionCard title="Ações rápidas" subtitle="Principais operações do fluxo da NFe.">
          <View style={styles.grid}>
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} asChild>
                <Pressable style={styles.actionButton}>
                  <ThemedText type="smallBold">{action.label}</ThemedText>
                </Pressable>
              </Link>
            ))}
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 24,
    gap: 20,
  },
  subtitle: {
    opacity: 0.8,
    marginTop: -8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#cde3ff',
    color: '#0b3d91',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#dfeafc',
    minWidth: 150,
    alignItems: 'center',
  },
  inlineButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});

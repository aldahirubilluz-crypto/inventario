//src/components/pdf/activo-reporte-pdf.tsx
import { ActivoCompleto } from "@/types/almacen";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Roboto",
    fontSize: 9,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  // Header con fondo azul
  headerBanner: {
    backgroundColor: "#1e40af",
    padding: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 300,
    color: "#dbeafe",
  },
  // Contenedor principal
  content: {
    paddingHorizontal: 35,
  },
  // Card de estado
  statusCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeft: 4,
    borderColor: "#3b82f6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timestampText: {
    fontSize: 8,
    color: "#94a3b8",
    fontWeight: 300,
  },
  // Secciones
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: 1.5,
    borderColor: "#e2e8f0",
  },
  sectionIcon: {
    width: 4,
    height: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Grid y filas mejoradas
  grid: {
    flexDirection: "row",
    gap: 20,
  },
  col: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    paddingVertical: 3,
  },
  label: {
    width: 150,
    fontSize: 9,
    color: "#64748b",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  value: {
    flex: 1,
    fontSize: 10,
    fontWeight: 400,
    color: "#0f172a",
    lineHeight: 1.4,
  },
  valueHighlight: {
    fontWeight: 700,
    color: "#1e40af",
  },
  // Separadores visuales
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 3,
  },
  // Footer mejorado
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 35,
    backgroundColor: "#f8fafc",
    borderTop: 1,
    borderColor: "#e2e8f0",
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#64748b",
    fontWeight: 300,
  },
  pageNumber: {
    fontSize: 8,
    color: "#94a3b8",
  },
  // Tabla de información destacada
  infoBox: {
    backgroundColor: "#fef3c7",
    borderLeft: 3,
    borderColor: "#f59e0b",
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  infoBoxText: {
    fontSize: 9,
    color: "#92400e",
    lineHeight: 1.4,
  },
});

interface ActivoReportePDFProps {
  activo: ActivoCompleto;
}

export default function ActivoReportePDF({ activo }: ActivoReportePDFProps) {
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return date;
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? value : `S/ ${num.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
  };

  const isAssigned = !!activo.finalEmployee;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Banner */}
        <View style={styles.headerBanner}>
          <Text style={styles.title}>Ficha de Activo Fijo</Text>
          <Text style={styles.subtitle}>
            Código Patrimonial: {activo.patrimonialCode}
          </Text>
        </View>

        <View style={styles.content}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View>
              <Text style={styles.statusLabel}>Estado Actual</Text>
              <Text
                style={[
                  styles.badge,
                  {
                    backgroundColor: isAssigned ? "#dbeafe" : "#d1fae5",
                    color: isAssigned ? "#1e3a8a" : "#065f46",
                  },
                ]}
              >
                {isAssigned ? "Asignado" : "Disponible"}
              </Text>
            </View>
            <View>
              <Text style={styles.timestampText}>Generado el</Text>
              <Text style={[styles.timestampText, { fontWeight: 500, marginTop: 2 }]}>
                {format(new Date(), "dd/MM/yyyy • HH:mm", { locale: es })}
              </Text>
            </View>
          </View>

          {/* Alerta si está asignado */}
          {isAssigned && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                ⚠ Este activo está actualmente asignado a: {activo.finalEmployee}
              </Text>
            </View>
          )}

          {/* Información Básica */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Información General</Text>
            </View>
            <View style={styles.grid}>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Código Patrimonial</Text>
                  <Text style={[styles.value, styles.valueHighlight]}>
                    {activo.patrimonialCode}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Etiqueta Anterior</Text>
                  <Text style={styles.value}>{activo.oldLabel || "—"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Descripción</Text>
                  <Text style={styles.value}>{activo.description}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Marca</Text>
                  <Text style={styles.value}>{activo.brand}</Text>
                </View>
              </View>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Modelo</Text>
                  <Text style={styles.value}>{activo.model}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>N° de Serie</Text>
                  <Text style={styles.value}>{activo.serialNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Características</Text>
                  <Text style={styles.value}>{activo.features || "—"}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Responsables */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Responsabilidad</Text>
            </View>
            <View style={styles.grid}>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Responsable Principal</Text>
                  <Text style={styles.value}>{activo.responsibleEmployee}</Text>
                </View>
              </View>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Usuario Final</Text>
                  <Text style={styles.value}>
                    {activo.finalEmployee || "Sin asignar"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Datos de Adquisición */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Adquisición</Text>
            </View>
            <View style={styles.grid}>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Orden de Compra</Text>
                  <Text style={styles.value}>{activo.purchaseOrder}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Valor de Compra</Text>
                  <Text style={[styles.value, styles.valueHighlight]}>
                    {formatCurrency(activo.purchaseValue)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Fecha de Compra</Text>
                  <Text style={styles.value}>{formatDate(activo.purchaseDate)}</Text>
                </View>
              </View>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Tipo de Documento</Text>
                  <Text style={styles.value}>{activo.documentType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>N° PECOSA</Text>
                  <Text style={styles.value}>{activo.pecosaNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Fecha de Registro</Text>
                  <Text style={styles.value}>{formatDate(activo.registrationDate)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Especificaciones Técnicas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Especificaciones Técnicas</Text>
            </View>
            <View style={styles.grid}>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Dimensiones</Text>
                  <Text style={styles.value}>{activo.dimensions}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>N° de Chasis</Text>
                  <Text style={styles.value}>{activo.chassisNumber || "—"}</Text>
                </View>
              </View>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>N° de Motor</Text>
                  <Text style={styles.value}>{activo.engineNumber || "—"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Placa</Text>
                  <Text style={styles.value}>{activo.licensePlate || "—"}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Ubicación */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Ubicación y Costos</Text>
            </View>
            <View style={styles.grid}>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Sede</Text>
                  <Text style={styles.value}>{activo.location}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Centro de Costo</Text>
                  <Text style={styles.value}>{activo.costCenter}</Text>
                </View>
              </View>
              <View style={styles.col}>
                <View style={styles.row}>
                  <Text style={styles.label}>Tipo de Ubicación</Text>
                  <Text style={styles.value}>{activo.locationType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Subtipo</Text>
                  <Text style={styles.value}>{activo.locationSubtype}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Sistema de Inventario de Activos Fijos • {new Date().getFullYear()}
            </Text>
            <Text style={styles.pageNumber}>Página 1 de 1</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
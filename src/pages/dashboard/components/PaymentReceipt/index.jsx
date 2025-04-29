// components/BoletaPagoPDF.jsx
import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    headerLeft: {
        width: "33%",
    },
    headerCenter: {
        width: "34%",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    headerRight: {
        width: "33%",
        textAlign: "right",
        fontSize: 12,
    },
    infoSection: {
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottom: 1,
        marginBottom: 5,
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        marginBottom: 2,
    },
    colConcepto: {
        width: "70%",
    },
    colMonto: {
        width: "30%",
        textAlign: "right",
    },
    total: {
        textAlign: "right",
        marginTop: 10,
        fontWeight: "bold",
    },
});

const BoletaPagoPDF = ({ data }) => {
    const numeroOrden = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text>Universidad Mayor de San Simón</Text>
                        <Text>Facultad de Ciencias y Tecnología</Text>
                        <Text>Secretaría Administrativa</Text>
                    </View>

                    <View style={styles.headerCenter}>
                        <Text>ORDEN DE PAGO</Text>
                    </View>

                    <View style={styles.headerRight}>
                        <Text>N° {numeroOrden}</Text>
                    </View>
                </View>

                {/* Información del estudiante */}
                <View style={styles.infoSection}>
                    <View style={styles.row}>
                        <Text>Nombre:</Text>
                        <Text>{data.nombre}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>CI:</Text>
                        <Text>{data.ci}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Fecha:</Text>
                        <Text>{data.fechaPago}</Text>
                    </View>
                </View>

                {/* Detalle del pago */}
                <View>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colConcepto}>Concepto</Text>
                        <Text style={styles.colMonto}>Monto (Bs)</Text>
                    </View>

                    {data.detalles.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.colConcepto}>{item.concepto}</Text>
                            <Text style={styles.colMonto}>{item.monto.toFixed(2)}</Text>
                        </View>
                    ))}

                    <Text style={styles.total}>Total: {data.total.toFixed(2)} Bs</Text>
                </View>
            </Page>
        </Document>
    );
};

export default BoletaPagoPDF;

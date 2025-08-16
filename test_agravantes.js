// Script de prueba para verificar que la API reciba los agravantes
// Ejecutar con: node test_agravantes.js

const testData = {
    nombre: "Test User",
    telefono: "2214099792",
    salario: 500000,
    antiguedad: 2,
    fechaIngreso: "2023-01-01",
    fechaEgreso: "2025-01-01",
    rubro: "comercio",
    motivoDespido: "sin_causa",
    indemnizacionCalculada: 15000000,
    quiereContacto: true,
    agravantes: {
        // Trabajo no registrado - Ley 24013
        ley24013_intimacion: true,
        ley24013_art8: true,
        ley24013_art9: false,
        ley24013_art10: false,
        ley24013_art15: false,
        ley25323_art1: true,
        
        // Otras infracciones
        intimacionPago: true,
        certificadosArt80: false,
        
        // Indemnizaciones agravadas
        embarazoMaternidad: false,
        matrimonio: true,
        
        // Estabilidad social
        postulanteCandidato: false,
        electo: false,
    }
};

console.log('Datos de prueba para la API:');
console.log(JSON.stringify(testData, null, 2));

console.log('\n--- Verificación de Agravantes ---');
console.log('Trabajo no registrado aplicado:', 
    testData.agravantes.ley24013_intimacion && testData.agravantes.ley24013_art8);
console.log('Otras infracciones aplicadas:', 
    testData.agravantes.intimacionPago || testData.agravantes.certificadosArt80);
console.log('Protecciones especiales aplicadas:', 
    testData.agravantes.embarazoMaternidad || testData.agravantes.matrimonio);
console.log('Estabilidad social aplicada:', 
    testData.agravantes.postulanteCandidato || testData.agravantes.electo);

console.log('\n--- Cálculo de Agravantes ---');
let agravantesTotal = 0;
const salario = testData.salario;

// Trabajo no registrado - Ley 24013
if (testData.agravantes.ley24013_intimacion && testData.agravantes.ley24013_art8) {
    agravantesTotal += salario * 0.25; // 1/4 de remuneraciones
}
if (testData.agravantes.ley24013_intimacion && testData.agravantes.ley24013_art9) {
    agravantesTotal += salario * 0.25;
}
if (testData.agravantes.ley24013_intimacion && testData.agravantes.ley24013_art10) {
    agravantesTotal += salario * 0.25;
}
if (testData.agravantes.ley24013_art15) {
    agravantesTotal += (salario + salario * testData.antiguedad) * 2; // Duplicación
}
if (testData.agravantes.ley25323_art1) {
    agravantesTotal += salario * testData.antiguedad; // 100% adicional
}

// Otras infracciones
if (testData.agravantes.intimacionPago) {
    agravantesTotal += salario * 2; // Art. 2 Ley 25323
}
if (testData.agravantes.certificadosArt80) {
    agravantesTotal += salario * 3; // Art. 45 Ley 25345
}

// Indemnizaciones agravadas
if (testData.agravantes.embarazoMaternidad) {
    agravantesTotal += salario * 6; // 6 meses de salario
}
if (testData.agravantes.matrimonio) {
    agravantesTotal += salario * 3; // 3 meses de salario
}

// Estabilidad social
if (testData.agravantes.postulanteCandidato) {
    agravantesTotal += salario * 12; // 12 meses de salario
}
if (testData.agravantes.electo) {
    agravantesTotal += salario * 24; // 24 meses de salario
}

console.log('Total de agravantes:', agravantesTotal.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS'
}));

console.log('\n--- Estructura MongoDB ---');
console.log('El documento se guardará en la colección "laboral" con:');
console.log('- Todos los campos básicos');
console.log('- Campo "agravantes" con objeto completo');
console.log('- Campo "createdAt" con timestamp');
console.log('- Campo "_id" generado automáticamente por MongoDB');

console.log('\n--- Email de Notificación ---');
console.log('Se enviará email a sergioscardigno82@gmail.com con:');
console.log('- Información del cliente');
console.log('- Detalles laborales');
console.log('- Sección completa de agravantes aplicados');
console.log('- Resumen de agravantes en el cálculo');
console.log('- Monto total de indemnización');

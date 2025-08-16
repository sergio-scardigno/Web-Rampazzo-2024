# Ejemplo de Documento MongoDB con Agravantes

## Estructura del Documento en la Colección 'laboral'

```json
{
  "_id": "68a05f0e53f273fe2d8561d5",
  "nombre": "sergio",
  "telefono": "2214099792",
  "salario": 500000,
  "antiguedad": 1,
  "fechaIngreso": "2024-01-16",
  "fechaEgreso": "2025-08-16",
  "rubro": "comercio",
  "motivoDespido": "sin_causa",
  "indemnizacionCalculada": 11821666.666666666,
  "quiereContacto": true,
  "agravantes": {
    "ley24013_intimacion": true,
    "ley24013_art8": true,
    "ley24013_art9": false,
    "ley24013_art10": false,
    "ley24013_art15": false,
    "ley25323_art1": true,
    "intimacionPago": false,
    "certificadosArt80": false,
    "embarazoMaternidad": false,
    "matrimonio": false,
    "postulanteCandidato": false,
    "electo": false
  },
  "createdAt": "2025-08-16T10:35:56.864+00:00"
}
```

## Campos de Agravantes Explicados

### Trabajo No Registrado - Ley 24.013
- **ley24013_intimacion**: `true` - Se realizó intimación previa y notificación AFIP
- **ley24013_art8**: `true` - No se registró la relación laboral
- **ley24013_art9**: `false` - No se consignó fecha de ingreso posterior
- **ley24013_art10**: `false` - No se consignó salario menor al real
- **ley24013_art15**: `false` - No hubo despido dentro de 2 años de intimación
- **ley25323_art1**: `true` - Se aplica incremento del 100% en indemnización por antigüedad

### Otras Infracciones
- **intimacionPago**: `false` - No se intimó al pago de indemnizaciones
- **certificadosArt80**: `false` - No hubo falta de entrega de certificados

### Indemnizaciones Agravadas
- **embarazoMaternidad**: `false` - No aplica protección por embarazo/maternidad
- **matrimonio**: `false` - No aplica protección por matrimonio

### Estabilidad Social
- **postulanteCandidato**: `false` - No es postulante o candidato
- **electo**: `false` - No es electo

## Consultas MongoDB Útiles

### Buscar casos con trabajo no registrado
```javascript
db.laboral.find({
  "agravantes.ley24013_intimacion": true,
  "agravantes.ley24013_art8": true
})
```

### Buscar casos con protecciones especiales
```javascript
db.laboral.find({
  $or: [
    {"agravantes.embarazoMaternidad": true},
    {"agravantes.matrimonio": true}
  ]
})
```

### Contar casos por tipo de agravante
```javascript
db.laboral.aggregate([
  {
    $group: {
      _id: null,
      totalTrabajoNoRegistrado: {
        $sum: {
          $cond: [
            {
              $and: [
                {"$agravantes.ley24013_intimacion": true},
                {"$agravantes.ley24013_art8": true}
              ]
            },
            1,
            0
          ]
        }
      },
      totalProtecciones: {
        $sum: {
          $cond: [
            {
              $or: [
                {"$agravantes.embarazoMaternidad": true},
                {"$agravantes.matrimonio": true}
              ]
            },
            1,
            0
          ]
        }
      }
    }
  }
])
```

### Buscar casos con múltiples agravantes
```javascript
db.laboral.find({
  $expr: {
    $gt: [
      {
        $size: {
          $filter: {
            input: {"$objectToArray": "$agravantes"},
            cond: {"$eq": ["$$this.v", true]}
          }
        }
      },
      2
    ]
  }
})
```

## Notas Importantes

1. **Validación**: Todos los campos de agravantes son booleanos
2. **Dependencias**: Algunos agravantes requieren que otros estén activos (ej: Ley 24.013 requiere intimación previa)
3. **Cálculo**: Los agravantes se aplican en el frontend antes de enviar los datos
4. **Auditoría**: El campo `createdAt` registra cuándo se creó la consulta
5. **Email**: Los agravantes se incluyen en el email de notificación para el estudio

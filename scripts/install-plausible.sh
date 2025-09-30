#!/bin/bash

# Script de instalación de Plausible Analytics
# Ejecutar en tu VPS con: bash install-plausible.sh

echo "🚀 Instalando Plausible Analytics..."

# Crear directorio
mkdir -p /opt/plausible
cd /opt/plausible

# Crear archivo docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  plausible_db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: plausible
      POSTGRES_USER: plausible
      POSTGRES_DB: plausible
    volumes:
      - plausible_db:/var/lib/postgresql/data
    restart: unless-stopped

  plausible_events_db:
    image: clickhouse/clickhouse-server:21.6.3-alpine
    volumes:
      - plausible_events_db:/var/lib/clickhouse
    restart: unless-stopped

  plausible:
    image: plausible/analytics:latest
    command: sh -c "sleep 10 && /entrypoint.sh db createdb && /entrypoint.sh db migrate && /entrypoint.sh run"
    ports:
      - "8000:8000"
    environment:
      BASE_URL: "https://analytics.tudominio.com"
      SECRET_KEY_BASE: "REPLACE_WITH_SECRET_KEY"
      DATABASE_URL: "postgres://plausible:plausible@plausible_db:5432/plausible"
      CLICKHOUSE_DATABASE_URL: "http://plausible_events_db:8123/plausible_events_db"
    depends_on:
      - plausible_db
      - plausible_events_db
    restart: unless-stopped

volumes:
  plausible_db:
  plausible_events_db:
EOF

# Generar secret key
SECRET_KEY=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
sed -i "s/REPLACE_WITH_SECRET_KEY/$SECRET_KEY/g" docker-compose.yml

echo "📝 Configuración creada. Edita docker-compose.yml para cambiar:"
echo "   - BASE_URL: https://analytics.tudominio.com"
echo "   - Puerto: 8000 (cambiar si es necesario)"

# Crear script de inicio
cat > start-plausible.sh << 'EOF'
#!/bin/bash
cd /opt/plausible
docker-compose up -d
echo "✅ Plausible Analytics iniciado en puerto 8000"
echo "🌐 Accede a: http://tu-servidor:8000"
EOF

chmod +x start-plausible.sh

# Crear script de parada
cat > stop-plausible.sh << 'EOF'
#!/bin/bash
cd /opt/plausible
docker-compose down
echo "⏹️ Plausible Analytics detenido"
EOF

chmod +x stop-plausible.sh

echo "✅ Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita docker-compose.yml con tu dominio"
echo "2. Ejecuta: ./start-plausible.sh"
echo "3. Accede a: http://tu-servidor:8000"
echo "4. Crea tu cuenta de administrador"
echo "5. Agrega tu sitio web"
echo "6. Copia el script de tracking a tu sitio"

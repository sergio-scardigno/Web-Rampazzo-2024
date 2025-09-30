#!/bin/bash

# Script de instalación de Umami Analytics
# Ejecutar en tu VPS con: bash install-umami.sh

echo "🚀 Instalando Umami Analytics..."

# Crear directorio
mkdir -p /opt/umami
cd /opt/umami

# Crear archivo docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:umami_password@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: REPLACE_WITH_SECRET_KEY
      HASH_SALT: REPLACE_WITH_HASH_SALT
    depends_on:
      - db
    restart: always

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami_password
    volumes:
      - umami-db:/var/lib/postgresql/data
    restart: always

volumes:
  umami-db:
EOF

# Generar secret keys
APP_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
HASH_SALT=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

sed -i "s/REPLACE_WITH_SECRET_KEY/$APP_SECRET/g" docker-compose.yml
sed -i "s/REPLACE_WITH_HASH_SALT/$HASH_SALT/g" docker-compose.yml

echo "📝 Configuración creada. Edita docker-compose.yml para cambiar:"
echo "   - Puerto: 3000 (cambiar si es necesario)"
echo "   - Contraseñas de base de datos"

# Crear script de inicio
cat > start-umami.sh << 'EOF'
#!/bin/bash
cd /opt/umami
docker-compose up -d
echo "✅ Umami Analytics iniciado en puerto 3000"
echo "🌐 Accede a: http://tu-servidor:3000"
echo "👤 Usuario por defecto: admin"
echo "🔑 Contraseña por defecto: umami"
EOF

chmod +x start-umami.sh

# Crear script de parada
cat > stop-umami.sh << 'EOF'
#!/bin/bash
cd /opt/umami
docker-compose down
echo "⏹️ Umami Analytics detenido"
EOF

chmod +x stop-umami.sh

echo "✅ Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecuta: ./start-umami.sh"
echo "2. Accede a: http://tu-servidor:3000"
echo "3. Login: admin / umami"
echo "4. Cambia la contraseña por defecto"
echo "5. Agrega tu sitio web"
echo "6. Copia el script de tracking a tu sitio"

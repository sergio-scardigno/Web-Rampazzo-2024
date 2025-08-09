/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/laboral/trabajo-negro',
        destination: '/servicios/trabajo-negro',
        permanent: true,
      },
      {
        source: '/laboral/enfermedades-laborales',
        destination: '/servicios/enfermedades-laborales',
        permanent: true,
      },
      {
        source: '/laboral/despido',
        destination: '/servicios/despidos',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

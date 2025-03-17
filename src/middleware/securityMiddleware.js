import helmet from 'helmet'

export default function securityMiddleware () {
  return helmet({
    contentSecurityPolicy: false, // Deshabilita CSP por si hay problemas con APIs externas
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Permitir carga de recursos externos
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Política de Referencias
    frameguard: { action: 'deny' }, // Evita Clickjacking
    xssFilter: true, // Protección contra ataques XSS
    hidePoweredBy: true, // Oculta el header "X-Powered-By"
    ieNoOpen: true, // Evita descargas peligrosas en Internet Explorer
    noSniff: true, // Evita ataques de MIME sniffing
  })
}

/**
 * Utilidades para tracking de visitantes y fuentes de origen
 */

export interface TrackingData {
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    userAgent?: string;
    timestamp: string;
    pageUrl?: string;
    sessionId?: string;
    source?: string;
    // Información adicional
    deviceType?: string;
    browser?: string;
    os?: string;
    screenResolution?: string;
    language?: string;
    timezone?: string;
    country?: string;
    city?: string;
    isMobile?: boolean;
    isTablet?: boolean;
    isDesktop?: boolean;
    // Información de la página
    pageTitle?: string;
    pagePath?: string;
    // Información de navegación
    previousPage?: string;
    visitCount?: number;
    timeOnSite?: number;
}

/**
 * Extrae parámetros UTM de la URL
 */
export function extractUTMParams(url: string): Partial<TrackingData> {
    try {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        
        return {
            utm_source: params.get('utm_source') || undefined,
            utm_medium: params.get('utm_medium') || undefined,
            utm_campaign: params.get('utm_campaign') || undefined,
            utm_term: params.get('utm_term') || undefined,
            utm_content: params.get('utm_content') || undefined,
        };
    } catch (error) {
        console.warn('Error parsing URL for UTM params:', error);
        return {};
    }
}

/**
 * Detecta la fuente de origen basada en el referrer
 */
export function detectSource(referrer?: string): string {
    if (!referrer) return 'direct';
    
    try {
        const url = new URL(referrer);
        const hostname = url.hostname.toLowerCase();
        
        // Redes sociales
        if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
            return 'facebook';
        }
        if (hostname.includes('instagram.com')) {
            return 'instagram';
        }
        if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
            return 'twitter';
        }
        if (hostname.includes('linkedin.com')) {
            return 'linkedin';
        }
        if (hostname.includes('youtube.com')) {
            return 'youtube';
        }
        if (hostname.includes('tiktok.com')) {
            return 'tiktok';
        }
        if (hostname.includes('whatsapp.com') || hostname.includes('wa.me')) {
            return 'whatsapp';
        }
        if (hostname.includes('telegram.org')) {
            return 'telegram';
        }
        
        // Motores de búsqueda
        if (hostname.includes('google.com') || hostname.includes('google.') || hostname.includes('googleadservices.com')) {
            return 'google';
        }
        if (hostname.includes('bing.com')) {
            return 'bing';
        }
        if (hostname.includes('yahoo.com')) {
            return 'yahoo';
        }
        if (hostname.includes('duckduckgo.com')) {
            return 'duckduckgo';
        }
        
        // Desarrollo local
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return 'localhost';
        }
        
        // Otros sitios web
        return 'external';
    } catch (error) {
        console.warn('Error parsing referrer:', error);
        return 'unknown';
    }
}

/**
 * Genera un ID de sesión único
 */
export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Detecta el tipo de dispositivo basado en el User-Agent
 */
export function detectDeviceType(userAgent?: string): { deviceType: string; isMobile: boolean; isTablet: boolean; isDesktop: boolean } {
    if (!userAgent) {
        return { deviceType: 'unknown', isMobile: false, isTablet: false, isDesktop: true };
    }

    const ua = userAgent.toLowerCase();
    
    // Detectar móviles
    const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
    const isMobile = mobileRegex.test(ua);
    
    // Detectar tablets
    const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
    const isTablet = tabletRegex.test(ua);
    
    // Detectar desktop
    const isDesktop = !isMobile && !isTablet;
    
    let deviceType = 'desktop';
    if (isMobile) deviceType = 'mobile';
    else if (isTablet) deviceType = 'tablet';
    
    return { deviceType, isMobile, isTablet, isDesktop };
}

/**
 * Detecta el navegador basado en el User-Agent
 */
export function detectBrowser(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
    if (ua.includes('msie') || ua.includes('trident')) return 'Internet Explorer';
    
    return 'unknown';
}

/**
 * Detecta el sistema operativo basado en el User-Agent
 */
export function detectOS(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac os')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    
    return 'unknown';
}

/**
 * Obtiene información de la pantalla
 */
export function getScreenInfo(): { screenResolution?: string; language?: string; timezone?: string } {
    if (typeof window === 'undefined') {
        return {};
    }

    return {
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language || navigator.languages?.[0],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}

/**
 * Obtiene información geográfica aproximada basada en la zona horaria
 */
export function getGeographicInfo(timezone?: string): { country?: string; city?: string } {
    if (!timezone) return {};
    
    // Mapeo básico de zonas horarias a países/ciudades
    const timezoneMap: { [key: string]: { country: string; city: string } } = {
        'America/Argentina/Buenos_Aires': { country: 'Argentina', city: 'Buenos Aires' },
        'America/Argentina/Cordoba': { country: 'Argentina', city: 'Córdoba' },
        'America/Argentina/Mendoza': { country: 'Argentina', city: 'Mendoza' },
        'America/Argentina/Rosario': { country: 'Argentina', city: 'Rosario' },
        'America/New_York': { country: 'Estados Unidos', city: 'Nueva York' },
        'America/Los_Angeles': { country: 'Estados Unidos', city: 'Los Ángeles' },
        'Europe/Madrid': { country: 'España', city: 'Madrid' },
        'Europe/London': { country: 'Reino Unido', city: 'Londres' },
        'America/Mexico_City': { country: 'México', city: 'Ciudad de México' },
        'America/Sao_Paulo': { country: 'Brasil', city: 'São Paulo' },
    };
    
    return timezoneMap[timezone] || { country: 'Desconocido', city: 'Desconocido' };
}

/**
 * Obtiene información de navegación
 */
export function getNavigationInfo(): { pageTitle?: string; pagePath?: string; previousPage?: string; visitCount?: number } {
    if (typeof window === 'undefined') {
        return {};
    }

    // Obtener página anterior del sessionStorage
    const previousPage = sessionStorage.getItem('previous_page') || undefined;
    
    // Guardar página actual para la próxima navegación
    sessionStorage.setItem('previous_page', window.location.pathname);
    
    // Contar visitas en esta sesión
    const visitCount = parseInt(sessionStorage.getItem('visit_count') || '0') + 1;
    sessionStorage.setItem('visit_count', visitCount.toString());
    
    return {
        pageTitle: document.title,
        pagePath: window.location.pathname,
        previousPage,
        visitCount,
    };
}

/**
 * Obtiene información de tracking del lado del cliente
 */
export function getClientTrackingData(): TrackingData {
    if (typeof window === 'undefined') {
        return {
            timestamp: new Date().toISOString(),
        };
    }

    // Extraer UTM params de la URL actual
    const utmParams = extractUTMParams(window.location.href);
    
    // Detectar fuente basada en referrer
    const source = detectSource(document.referrer);
    
    // Obtener o generar session ID
    let sessionId = sessionStorage.getItem('tracking_session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('tracking_session_id', sessionId);
    }

    // Información del dispositivo y navegador
    const deviceInfo = detectDeviceType(navigator.userAgent);
    const browser = detectBrowser(navigator.userAgent);
    const os = detectOS(navigator.userAgent);
    
    // Información de pantalla y ubicación
    const screenInfo = getScreenInfo();
    const geoInfo = getGeographicInfo(screenInfo.timezone);
    
    // Información de navegación
    const navInfo = getNavigationInfo();

    return {
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        sessionId,
        source: source as any,
        ...utmParams,
        // Información adicional
        deviceType: deviceInfo.deviceType,
        browser,
        os,
        screenResolution: screenInfo.screenResolution,
        language: screenInfo.language,
        timezone: screenInfo.timezone,
        country: geoInfo.country,
        city: geoInfo.city,
        isMobile: deviceInfo.isMobile,
        isTablet: deviceInfo.isTablet,
        isDesktop: deviceInfo.isDesktop,
        // Información de la página
        pageTitle: navInfo.pageTitle,
        pagePath: navInfo.pagePath,
        previousPage: navInfo.previousPage,
        visitCount: navInfo.visitCount,
    };
}

/**
 * Formatea la información de tracking para mostrar en emails
 */
export function formatTrackingInfo(tracking: TrackingData): string {
    const parts: string[] = [];
    
    // Fuente principal
    if (tracking.utm_source) {
        parts.push(`Fuente: ${tracking.utm_source}`);
    } else if (tracking.referrer) {
        const source = detectSource(tracking.referrer);
        parts.push(`Fuente: ${source}`);
    } else {
        parts.push('Fuente: Acceso directo');
    }
    
    // Medio
    if (tracking.utm_medium) {
        parts.push(`Medio: ${tracking.utm_medium}`);
    }
    
    // Campaña
    if (tracking.utm_campaign) {
        parts.push(`Campaña: ${tracking.utm_campaign}`);
    }
    
    // Referrer completo (si no hay UTM)
    if (!tracking.utm_source && tracking.referrer) {
        try {
            const url = new URL(tracking.referrer);
            parts.push(`Sitio: ${url.hostname}`);
        } catch (error) {
            parts.push(`Referrer: ${tracking.referrer}`);
        }
    }
    
    // Término de búsqueda
    if (tracking.utm_term) {
        parts.push(`Término: ${tracking.utm_term}`);
    }
    
    // Contenido
    if (tracking.utm_content) {
        parts.push(`Contenido: ${tracking.utm_content}`);
    }
    
    return parts.join(' | ');
}

/**
 * Formatea información detallada de tracking para mostrar en emails
 */
export function formatDetailedTrackingInfo(tracking: TrackingData): string {
    const sections: string[] = [];
    
    // Sección de fuente de tráfico
    const trafficInfo = formatTrackingInfo(tracking);
    sections.push(`🌐 Fuente de tráfico: ${trafficInfo}`);
    
    // Sección de dispositivo
    const deviceInfo = [];
    if (tracking.deviceType) deviceInfo.push(tracking.deviceType);
    if (tracking.browser) deviceInfo.push(tracking.browser);
    if (tracking.os) deviceInfo.push(tracking.os);
    if (tracking.screenResolution) deviceInfo.push(tracking.screenResolution);
    
    if (deviceInfo.length > 0) {
        sections.push(`📱 Dispositivo: ${deviceInfo.join(' | ')}`);
    }
    
    // Sección de ubicación
    const locationInfo = [];
    if (tracking.country) locationInfo.push(tracking.country);
    if (tracking.city) locationInfo.push(tracking.city);
    if (tracking.timezone) locationInfo.push(tracking.timezone);
    if (tracking.language) locationInfo.push(tracking.language);
    
    if (locationInfo.length > 0) {
        sections.push(`📍 Ubicación: ${locationInfo.join(' | ')}`);
    }
    
    // Sección de navegación
    const navInfo = [];
    if (tracking.pageTitle) navInfo.push(`Página: ${tracking.pageTitle}`);
    if (tracking.previousPage) navInfo.push(`Anterior: ${tracking.previousPage}`);
    if (tracking.visitCount && tracking.visitCount > 1) navInfo.push(`Visitas: ${tracking.visitCount}`);
    
    if (navInfo.length > 0) {
        sections.push(`🧭 Navegación: ${navInfo.join(' | ')}`);
    }
    
    return sections.join('\n');
}

/**
 * Obtiene información de tracking del lado del servidor
 */
export function getServerTrackingData(request: Request): TrackingData {
    const headers = request.headers;
    const url = new URL(request.url);
    
    // Extraer UTM params
    const utmParams = extractUTMParams(request.url);
    
    // Obtener referrer del header
    const referrer = headers.get('referer') || headers.get('referrer') || undefined;
    
    // Detectar fuente
    const source = detectSource(referrer);
    
    return {
        referrer,
        userAgent: headers.get('user-agent') || undefined,
        timestamp: new Date().toISOString(),
        pageUrl: request.url,
        source: source as any,
        ...utmParams,
    };
}

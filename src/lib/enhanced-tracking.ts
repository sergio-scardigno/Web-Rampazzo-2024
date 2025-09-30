/**
 * Sistema de tracking mejorado con APIs externas
 */

import { TrackingData } from './tracking';

export interface EnhancedTrackingData extends TrackingData {
    // Información geográfica mejorada
    ipAddress?: string;
    countryCode?: string;
    countryName?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    isp?: string;
    
    // Información de dispositivo mejorada
    deviceBrand?: string;
    deviceModel?: string;
    browserVersion?: string;
    osVersion?: string;
    
    // Información de red
    connectionType?: string;
    connectionSpeed?: string;
    
    // Información de privacidad
    isVpn?: boolean;
    isProxy?: boolean;
    isTor?: boolean;
}

/**
 * Obtiene la IP del cliente (solo en servidor)
 */
export async function getClientIP(request: Request): Promise<string | undefined> {
    const headers = request.headers;
    
    // Intentar obtener IP de diferentes headers
    const ipHeaders = [
        'x-forwarded-for',
        'x-real-ip',
        'x-client-ip',
        'cf-connecting-ip', // Cloudflare
        'x-cluster-client-ip',
        'x-forwarded',
        'forwarded-for',
        'forwarded'
    ];
    
    for (const header of ipHeaders) {
        const value = headers.get(header);
        if (value) {
            // x-forwarded-for puede tener múltiples IPs, tomar la primera
            return value.split(',')[0].trim();
        }
    }
    
    return undefined;
}

/**
 * Obtiene información geográfica usando ipapi.co (gratuito)
 */
export async function getGeographicInfo(ip: string): Promise<Partial<EnhancedTrackingData>> {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        
        return {
            ipAddress: ip,
            countryCode: data.country_code,
            countryName: data.country_name,
            region: data.region,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
            isp: data.org,
        };
    } catch (error) {
        console.warn('Error obteniendo información geográfica:', error);
        return { ipAddress: ip };
    }
}

/**
 * Obtiene información geográfica usando ip-api.com (gratuito, más rápido)
 */
export async function getGeographicInfoFast(ip: string): Promise<Partial<EnhancedTrackingData>> {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query`);
        const data = await response.json();
        
        if (data.status === 'success') {
            return {
                ipAddress: data.query,
                countryCode: data.countryCode,
                countryName: data.country,
                region: data.regionName,
                city: data.city,
                latitude: data.lat,
                longitude: data.lon,
                timezone: data.timezone,
                isp: data.isp,
            };
        }
    } catch (error) {
        console.warn('Error obteniendo información geográfica rápida:', error);
    }
    
    return { ipAddress: ip };
}

/**
 * Detecta si la IP es de un proxy/VPN/Tor
 */
export async function detectPrivacyInfo(ip: string): Promise<Partial<EnhancedTrackingData>> {
    try {
        // Usar múltiples servicios para detectar proxies
        const [proxyCheck, vpnCheck] = await Promise.allSettled([
            fetch(`https://proxycheck.io/v2/${ip}?key=free&vpn=1&asn=1`),
            fetch(`https://ipqualityscore.com/api/json/ip/${ip}?strictness=0&allow_public_access_points=true&fast=true&lighter_penalties=true&mobile=true`)
        ]);
        
        const privacyInfo: Partial<EnhancedTrackingData> = {};
        
        if (proxyCheck.status === 'fulfilled') {
            const proxyData = await proxyCheck.value.json();
            if (proxyData.status === 'ok') {
                privacyInfo.isProxy = proxyData[ip]?.proxy === 'yes';
                privacyInfo.isVpn = proxyData[ip]?.type === 'VPN';
            }
        }
        
        if (vpnCheck.status === 'fulfilled') {
            const vpnData = await vpnCheck.value.json();
            if (vpnData.success) {
                privacyInfo.isVpn = vpnData.vpn || false;
                privacyInfo.isProxy = vpnData.proxy || false;
                privacyInfo.isTor = vpnData.tor || false;
            }
        }
        
        return privacyInfo;
    } catch (error) {
        console.warn('Error detectando información de privacidad:', error);
        return {};
    }
}

/**
 * Obtiene información mejorada del dispositivo desde el User-Agent
 */
export function getEnhancedDeviceInfo(userAgent?: string): Partial<EnhancedTrackingData> {
    if (!userAgent) return {};
    
    const ua = userAgent.toLowerCase();
    
    // Detectar marca y modelo del dispositivo
    let deviceBrand = 'Unknown';
    let deviceModel = 'Unknown';
    
    if (ua.includes('iphone')) {
        deviceBrand = 'Apple';
        deviceModel = 'iPhone';
    } else if (ua.includes('ipad')) {
        deviceBrand = 'Apple';
        deviceModel = 'iPad';
    } else if (ua.includes('android')) {
        deviceBrand = 'Google';
        deviceModel = 'Android';
    } else if (ua.includes('windows')) {
        deviceBrand = 'Microsoft';
        deviceModel = 'Windows PC';
    } else if (ua.includes('mac os')) {
        deviceBrand = 'Apple';
        deviceModel = 'Mac';
    }
    
    // Detectar versión del navegador
    let browserVersion = 'Unknown';
    const chromeMatch = ua.match(/chrome\/(\d+)/);
    if (chromeMatch) browserVersion = `Chrome ${chromeMatch[1]}`;
    
    const firefoxMatch = ua.match(/firefox\/(\d+)/);
    if (firefoxMatch) browserVersion = `Firefox ${firefoxMatch[1]}`;
    
    const safariMatch = ua.match(/version\/(\d+)/);
    if (safariMatch && ua.includes('safari')) browserVersion = `Safari ${safariMatch[1]}`;
    
    // Detectar versión del OS
    let osVersion = 'Unknown';
    const windowsMatch = ua.match(/windows nt (\d+\.\d+)/);
    if (windowsMatch) osVersion = `Windows ${windowsMatch[1]}`;
    
    const macMatch = ua.match(/mac os x (\d+[._]\d+)/);
    if (macMatch) osVersion = `macOS ${macMatch[1].replace('_', '.')}`;
    
    const androidMatch = ua.match(/android (\d+\.\d+)/);
    if (androidMatch) osVersion = `Android ${androidMatch[1]}`;
    
    return {
        deviceBrand,
        deviceModel,
        browserVersion,
        osVersion,
    };
}

/**
 * Obtiene información de tracking mejorada del servidor
 */
export async function getEnhancedServerTrackingData(request: Request): Promise<EnhancedTrackingData> {
    const baseTracking = {
        userAgent: request.headers.get('user-agent') || undefined,
        timestamp: new Date().toISOString(),
        pageUrl: request.url,
    };
    
    // Obtener IP del cliente
    const ip = await getClientIP(request);
    if (!ip) {
        return baseTracking as EnhancedTrackingData;
    }
    
    // Obtener información geográfica (usar la API más rápida)
    const geoInfo = await getGeographicInfoFast(ip);
    
    // Obtener información de privacidad (opcional, puede ser lento)
    const privacyInfo = await detectPrivacyInfo(ip);
    
    // Obtener información mejorada del dispositivo
    const deviceInfo = getEnhancedDeviceInfo(baseTracking.userAgent);
    
    return {
        ...baseTracking,
        ...geoInfo,
        ...privacyInfo,
        ...deviceInfo,
    } as EnhancedTrackingData;
}

/**
 * Formatea información de tracking mejorada para emails
 */
export function formatEnhancedTrackingInfo(tracking: EnhancedTrackingData): string {
    const sections: string[] = [];
    
    // Sección de fuente de tráfico (básica)
    let trafficInfo = tracking.utm_source ? 
        `Fuente: ${tracking.utm_source}` : 
        tracking.referrer ? 
            `Fuente: ${tracking.referrer}` : 
            'Fuente: Acceso directo';
    
    if (tracking.utm_medium) trafficInfo += ` | Medio: ${tracking.utm_medium}`;
    if (tracking.utm_campaign) trafficInfo += ` | Campaña: ${tracking.utm_campaign}`;
    if (tracking.utm_term) trafficInfo += ` | Término: ${tracking.utm_term}`;
    
    sections.push(`🌐 Fuente de tráfico: ${trafficInfo}`);
    
    // Sección de ubicación mejorada
    const locationInfo = [];
    if (tracking.countryName) locationInfo.push(tracking.countryName);
    if (tracking.region) locationInfo.push(tracking.region);
    if (tracking.city) locationInfo.push(tracking.city);
    if (tracking.timezone) locationInfo.push(tracking.timezone);
    if (tracking.isp) locationInfo.push(`ISP: ${tracking.isp}`);
    
    if (locationInfo.length > 0) {
        sections.push(`📍 Ubicación: ${locationInfo.join(' | ')}`);
    }
    
    // Sección de dispositivo mejorada
    const deviceInfo = [];
    if (tracking.deviceBrand && tracking.deviceModel) {
        deviceInfo.push(`${tracking.deviceBrand} ${tracking.deviceModel}`);
    }
    if (tracking.browserVersion) deviceInfo.push(tracking.browserVersion);
    if (tracking.osVersion) deviceInfo.push(tracking.osVersion);
    if (tracking.screenResolution) deviceInfo.push(tracking.screenResolution);
    
    if (deviceInfo.length > 0) {
        sections.push(`📱 Dispositivo: ${deviceInfo.join(' | ')}`);
    }
    
    // Sección de privacidad (si es relevante)
    const privacyInfo = [];
    if (tracking.isVpn) privacyInfo.push('VPN');
    if (tracking.isProxy) privacyInfo.push('Proxy');
    if (tracking.isTor) privacyInfo.push('Tor');
    
    if (privacyInfo.length > 0) {
        sections.push(`🔒 Privacidad: ${privacyInfo.join(' | ')}`);
    }
    
    // Información técnica
    if (tracking.ipAddress) {
        sections.push(`🔍 IP: ${tracking.ipAddress}`);
    }
    
    return sections.join('\n');
}

const DIRECT_BASE = process.env.NEXT_PUBLIC_CALC_API_BASE || 'https://scardigno-calculadora-rampazzo.ndorzn.easypanel.host:8001';
const USE_PROXY = (process.env.NEXT_PUBLIC_CALC_API_USE_PROXY || '0') === '1';

export type AgravantesPayload = {
	ley24013_intimacion?: boolean;
	ley24013_art8?: boolean;
	ley24013_art9?: boolean;
	ley24013_art10?: boolean;
	ley24013_art15?: boolean;
	ley25323_art1?: boolean;
	intimacionPago?: boolean;
	certificadosArt80?: boolean;
	embarazoMaternidad?: boolean;
	matrimonio?: boolean;
	postulanteCandidato?: boolean;
	electo?: boolean;
};

export type IndemnizacionRequestPayload = {
	salario: number;
	fechaIngreso: string; // YYYY-MM-DD
	fechaEgreso: string; // YYYY-MM-DD
	preaviso: boolean;
	agravantes?: AgravantesPayload;
};

export async function calcularIndemnizacion(payload: IndemnizacionRequestPayload) {
	if (USE_PROXY) {
		const resp = await fetch(`/api/calc/indemnizacion`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			cache: 'no-store',
		});
		if (!resp.ok) {
			let detail = '';
			try { detail = await resp.text(); } catch {}
			throw new Error(`Error cálculo vía proxy (${resp.status}): ${detail}`);
		}
		return resp.json();
	}

	const resp = await fetch(`${DIRECT_BASE}/calculate/indemnizacion`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
		cache: 'no-store',
	});
	if (!resp.ok) {
		let detail = '';
		try { detail = await resp.text(); } catch {}
		throw new Error(`Error cálculo (${resp.status}): ${detail}`);
	}
	return resp.json();
}

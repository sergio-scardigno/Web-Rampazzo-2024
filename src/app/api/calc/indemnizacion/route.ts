import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const CALC_API_BASE = process.env.CALC_API_BASE || process.env.NEXT_PUBLIC_CALC_API_BASE;
	if (!CALC_API_BASE) {
		return Response.json({ error: 'CALC_API_BASE no configurado' }, { status: 500 });
	}

	try {
		const payload = await req.json();
		const resp = await fetch(`${CALC_API_BASE}/calculate/indemnizacion`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			// No enviar cookies del proyecto a un host externo
			credentials: 'omit',
			cache: 'no-store',
		});

		const text = await resp.text();
		const contentType = resp.headers.get('content-type') || '';
		const data = contentType.includes('application/json') ? JSON.parse(text) : text;

		if (!resp.ok) {
			return Response.json({ error: 'Upstream error', detail: data }, { status: resp.status });
		}

		return Response.json(data);
	} catch (e: any) {
		return Response.json({ error: 'Proxy error', detail: e?.message || String(e) }, { status: 500 });
	}
}

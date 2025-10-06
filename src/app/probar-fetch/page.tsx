"use client";

import { useState } from "react";
import { calcularIndemnizacion } from "@/lib/calcApi";

export default function ProbarFetchPage() {
	const [data, setData] = useState<any>(null);
	const [err, setErr] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onProbar() {
		setLoading(true);
		setErr(null);
		setData(null);
		try {
			const res = await calcularIndemnizacion({
				salario: 450000,
				fechaIngreso: "2023-01-10",
				fechaEgreso: "2024-08-18",
				preaviso: false,
				agravantes: { certificadosArt80: true },
			});
			setData(res);
		} catch (e: any) {
			setErr(e?.message || "Error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container mx-auto px-4 max-w-2xl py-12">
			<h1 className="text-2xl font-bold mb-4">Probar fetch a API Python</h1>
			<p className="text-sm text-gray-600 mb-4">
				Base: {process.env.NEXT_PUBLIC_CALC_API_BASE || "(default prod host)"}
			</p>
			<button
				onClick={onProbar}
				disabled={loading}
				className="px-4 py-2 rounded border bg-white disabled:opacity-60"
			>
				{loading ? "Calculando..." : "Probar fetch"}
			</button>
			{err && (
				<pre className="mt-4 text-red-600 text-sm whitespace-pre-wrap">{err}</pre>
			)}
			{data && (
				<pre className="mt-4 text-xs bg-gray-50 p-3 rounded border overflow-auto">
					{JSON.stringify(data, null, 2)}
				</pre>
			)}
		</div>
	);
}

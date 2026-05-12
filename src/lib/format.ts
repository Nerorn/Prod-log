const BRL = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export function formatBRL(cents: number) {
	return BRL.format(cents / 100);
}

export function parseBRLInput(value: string): number {
	const digits = value.replace(/\D/g, "");
	return digits ? Number.parseInt(digits, 10) : 0;
}

/**
 * Funções utilitárias gerais
 */

export function el(id) {
    return document.getElementById(id);
}

export function show(id, text) {
    el(id).innerText = text;
}

export async function jsonResponse(res) {
    return res.json().catch(() => ({}));
}

export function formatCurrency(value) {
    const num = Number(value) || 0;
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
    }).format(num);
}

export function formatCPF(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    event.target.value = value;
}

export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Chamadas à API do servidor
 */

import { jsonResponse } from './utils.js';

const API_BASE = '';

export async function createAccount(cpf, name) {
    const res = await fetch(`${API_BASE}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, name })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function deposit(cpf, description, amount) {
    const res = await fetch(`${API_BASE}/deposit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            cpf
        },
        body: JSON.stringify({ description, amount })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function withdraw(cpf, description, amount) {
    const res = await fetch(`${API_BASE}/withdraw`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            cpf
        },
        body: JSON.stringify({ amount, description })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function getBalance(cpf) {
    const res = await fetch(`${API_BASE}/balance`, { headers: { cpf } });
    if (res.ok) {
        return await jsonResponse(res);
    }
    throw new Error('Erro ao buscar saldo');
}

export async function getStatement(cpf) {
    const res = await fetch(`${API_BASE}/statement`, { headers: { cpf } });
    if (res.ok) {
        return await jsonResponse(res);
    }
    throw new Error('Erro ao buscar extrato');
}

export async function updateAccountName(cpf, newName) {
    const res = await fetch(`${API_BASE}/account`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            cpf
        },
        body: JSON.stringify({ name: newName })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function deleteAccount(cpf) {
    const res = await fetch(`${API_BASE}/account`, {
        method: 'DELETE',
        headers: { cpf }
    });
    return { status: res.status, data: await jsonResponse(res) };
}

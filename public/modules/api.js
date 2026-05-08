/**
 * Chamadas à API do servidor
 */

import { jsonResponse } from './utils.js';

const API_BASE = '/api';

export async function createAccount(cpf, name) {
    const res = await fetch(`${API_BASE}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, name })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function getAccountByCpf(cpf) {
    const res = await fetch(`${API_BASE}/accounts/cpf/${cpf}`);
    return { status: res.status, data: await jsonResponse(res) };
}

export async function deposit(accountId, description, amount) {
    const res = await fetch(`${API_BASE}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, description, amount })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function withdraw(accountId, description, amount) {
    const res = await fetch(`${API_BASE}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, amount, description })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function getBalance(accountId) {
    const res = await fetch(`${API_BASE}/balance/${accountId}`);
    if (res.ok) {
        const data = await jsonResponse(res);
        return data.balance;
    }
    throw new Error('Erro ao buscar saldo');
}

export async function getStatement(accountId) {
    const res = await fetch(`${API_BASE}/statement/${accountId}`);
    if (res.ok) {
        return await jsonResponse(res);
    }
    throw new Error('Erro ao buscar extrato');
}

export async function updateAccountName(accountId, newName) {
    const res = await fetch(`${API_BASE}/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
    });
    return { status: res.status, data: await jsonResponse(res) };
}

export async function deleteAccount(accountId) {
    const res = await fetch(`${API_BASE}/accounts/${accountId}`, {
        method: 'DELETE'
    });
    return { status: res.status, data: await jsonResponse(res) };
}

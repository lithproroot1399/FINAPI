const state = { cpf: null };

function el(id){ return document.getElementById(id); }
function show(id, text){ el(id).innerText = text; }
function jsonResponse(res){ return res.json().catch(() => ({})); }

function formatCurrency(value){
    const num = Number(value) || 0;
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(num);
}

async function createAccount(){
    const cpf = el('create-cpf').value.trim();
    const name = el('create-name').value.trim();
    if(!cpf || !name) return show('create-result','Preencha CPF e Nome');

    const res = await fetch('/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, name })
    });
    if(res.status === 201){
        show('create-result','Conta criada com sucesso');
        el('create-cpf').value = '';
        el('create-name').value = '';
    } else {
        const data = await jsonResponse(res);
        show('create-result', data.error || 'Erro');
    }
}

function setActiveCpf(){
    const cpf = el('active-cpf').value.trim();
    if(!cpf) return;
    state.cpf = cpf;
    el('current-cpf').innerText = cpf;
    show('op-result','Conta selecionada: ' + cpf);
}

async function deposit(){
    if(!state.cpf) return show('op-result','Selecione uma conta');
    const description = el('deposit-description').value.trim();
    const amount = parseFloat(el('deposit-amount').value);
    if(!amount || amount <= 0) return show('op-result','Valor inválido');

    const res = await fetch('/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cpf: state.cpf },
        body: JSON.stringify({ description, amount })
    });
    if(res.status === 201){
        show('op-result','Depósito realizado: ' + formatCurrency(amount));
        el('deposit-description').value = '';
        el('deposit-amount').value = '';
    } else {
        const d = await jsonResponse(res);
        show('op-result', d.error || 'Erro');
    }
}

async function withdraw(){
    if(!state.cpf) return show('op-result','Selecione uma conta');
    const description = el('withdraw-description').value.trim();
    const amount = parseFloat(el('withdraw-amount').value);
    if(!amount || amount <= 0) return show('op-result','Valor inválido');

    const res = await fetch('/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cpf: state.cpf },
        body: JSON.stringify({ amount, description })
    });
    if(res.status === 201){
        show('op-result','Saque realizado: ' + formatCurrency(amount));
        el('withdraw-amount').value = '';
    } else {
        const d = await jsonResponse(res);
        show('op-result', d.error || 'Erro');
    }
}

async function getBalance(){
    if(!state.cpf) return show('op-result','Selecione uma conta');
    const res = await fetch('/balance', { headers: { cpf: state.cpf } });
    if(res.ok){
        const d = await jsonResponse(res);
        const bal = Number(d) || 0;
        show('op-result','Saldo: ' + formatCurrency(bal));
    } else {
        const d = await jsonResponse(res);
        show('op-result', d.error || 'Erro');
    }
}

async function getStatement(){
    if(!state.cpf) return show('op-result','Selecione uma conta');
    const res = await fetch('/statement', { headers: { cpf: state.cpf } });
    if(res.ok){
        const data = await jsonResponse(res);
        renderStatement(data || []);
    } else {
        const d = await jsonResponse(res);
        show('op-result', d.error || 'Erro');
    }
}

function renderStatement(items){
    const container = el('statement');
    if(!items.length){ container.innerHTML = '<i>Sem lançamentos</i>'; return; }
    const rows = items.map(i => {
        const amt = Number(i.amount) || 0;
        const sign = i.type === 'credit' ? '+' : '-';
        return `
        <div class="stmt-row ${i.type}">
            <div class="stmt-desc">${i.description || ''}</div>
            <div class="stmt-date">${new Date(i.create_ad).toLocaleString()}</div>
            <div class="stmt-amount">${sign} ${formatCurrency(Math.abs(amt))}</div>
        </div>
    `}).join('');
    // calcular total (credit - debit)
    const total = items.reduce((acc, it) => {
        const amt = Number(it.amount) || 0;
        return it.type === 'credit' ? acc + amt : acc - amt;
    }, 0);

    const totalRow = `
        <div class="stmt-row stmt-total">
            <div class="stmt-desc">Total</div>
            <div class="stmt-date"></div>
            <div class="stmt-amount">${total >= 0 ? '+' : '-'} ${formatCurrency(Math.abs(total))}</div>
        </div>
    `;

    container.innerHTML = rows + totalRow;
}

async function updateAccount(){
    if(!state.cpf) return show('manage-result','Selecione uma conta');
    const name = el('update-name').value.trim();
    if(!name) return show('manage-result','Informe um nome');
    const res = await fetch('/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', cpf: state.cpf },
        body: JSON.stringify({ name })
    });
    if(res.status === 201){
        show('manage-result','Nome atualizado');
        el('update-name').value = '';
    } else {
        const d = await jsonResponse(res);
        show('manage-result', d.error || 'Erro');
    }
}

async function deleteAccount(){
    if(!state.cpf) return show('manage-result','Selecione uma conta');
    if(!confirm('Confirma exclusão da conta ' + state.cpf + '?')) return;
    const res = await fetch('/account', { method: 'DELETE', headers: { cpf: state.cpf } });
    if(res.ok){
        show('manage-result','Conta deletada');
        state.cpf = null;
        el('current-cpf').innerText = 'nenhuma';
        el('statement').innerHTML = '';
    } else {
        const d = await jsonResponse(res);
        show('manage-result', d.error || 'Erro');
    }
}

// Event bindings
window.addEventListener('DOMContentLoaded', () => {
    el('btn-create').addEventListener('click', createAccount);
    el('btn-set-cpf').addEventListener('click', setActiveCpf);
    el('btn-deposit').addEventListener('click', deposit);
    el('btn-withdraw').addEventListener('click', withdraw);
    el('btn-balance').addEventListener('click', getBalance);
    el('btn-statement').addEventListener('click', getStatement);
    el('btn-update').addEventListener('click', updateAccount);
    el('btn-delete').addEventListener('click', deleteAccount);
});

export class Observer {
    atualizar(pedido) {
        throw new Error("Implemente atualizar(pedido).");
    }
}

export class EmailObserver extends Observer {
    atualizar(pedido) {
        console.log(`[EmailObserver] E-mail enviado — Pedido #${pedido.id} status: "${pedido.status}"`);
    }
}

export class EstoqueObserver extends Observer {
    atualizar(pedido) {
        console.log(`[EstoqueObserver] Baixa de estoque — Pedido #${pedido.id} (${pedido.status})`);
    }
}

export class LogObserver extends Observer {
    atualizar(pedido) {
        const ts = new Date().toISOString();
        console.log(`[LogObserver] [${ts}] Pedido #${pedido.id} → "${pedido.status}"`);
    }
}
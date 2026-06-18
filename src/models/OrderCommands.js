export class Comando {
    executar() { throw new Error("Implemente executar()."); }
    desfazer() { throw new Error("Implemente desfazer()."); }
}

export class CancelarPedidoComando extends Comando {
    constructor(pedido) {
        super();
        this.pedido         = pedido;
        this.statusAnterior = null;
    }

    executar() {
        this.statusAnterior = this.pedido.status;
        this.pedido.setStatus("CANCELADO");
        console.log(`[Comando] Pedido #${this.pedido.id} cancelado.`);
    }

    desfazer() {
        if (this.statusAnterior === null) return;
        this.pedido.setStatus(this.statusAnterior);
        console.log(`[Comando] Cancelamento desfeito — Pedido #${this.pedido.id} voltou para "${this.statusAnterior}".`);
    }
}

export class AtualizarEnderecoComando extends Comando {
    constructor(pedido, novoEndereco) {
        super();
        this.pedido           = pedido;
        this.novoEndereco     = novoEndereco;
        this.enderecoAnterior = null;
    }

    executar() {
        this.enderecoAnterior = this.pedido.address;
        this.pedido.address   = this.novoEndereco;
        console.log(`[Comando] Endereço do pedido #${this.pedido.id} atualizado para "${this.novoEndereco}".`);
    }

    desfazer() {
        if (this.enderecoAnterior === null) return;
        this.pedido.address = this.enderecoAnterior;
        console.log(`[Comando] Endereço restaurado para "${this.enderecoAnterior}".`);
    }
}

export class GerenciadorComandos {
    constructor() {
        this.historico = [];
    }

    executar(comando) {
        comando.executar();
        this.historico.push(comando);
    }

    desfazerUltimo() {
        if (this.historico.length === 0) {
            console.log("[Gerenciador] Histórico vazio.");
            return;
        }
        this.historico.pop().desfazer();
    }
}
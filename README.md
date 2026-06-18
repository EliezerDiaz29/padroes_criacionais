# padroes_criacionais
Implementação e estudo dos padrões de projeto criacionais, estruturais e comportamentais (GoF) aplicados em um backend de e-commerce com Node.js e Express.

---

# Padrões Criacionais + Estruturais + Comportamentais E-commerce Backend

## Alunos

- Eliezer Velásquez
- Pablo Ricardo Paul

## Sobre o projeto

Backend de um sistema de e-commerce desenvolvido com Node.js e Express, aplicando nove padrões de projeto do GoF distribuídos em três grupos:

| Grupo           | Padrões implementados                  |
|-----------------|----------------------------------------|
| Criacionais     | Singleton, Factory Method, Builder     |
| Estruturais     | Adapter, Decorator, Facade             |
| Comportamentais | Strategy, Observer, Command            |

---

## Atividade 03 Padrões Criacionais

### Tarefa 01: Singleton
**Arquivo:** `src/config/DatabaseConnection.js`

A classe `DatabaseConnection` garante que apenas uma instância de conexão com o banco de dados seja criada durante toda a execução do sistema. O campo estático `conexionUnica` armazena a instância e o método `getInstance()` a retorna sempre que solicitada, criando-a apenas na primeira chamada.

**Por que faz sentido usar Singleton aqui?**

Sem o Singleton, cada parte do sistema poderia criar sua própria conexão com o banco, resultando em múltiplas conexões desnecessárias que consomem memória e recursos. O Singleton resolve isso garantindo uma única instância compartilhada por toda a aplicação, centralizando o acesso ao banco e facilitando o controle do ciclo de vida da conexão.

---

### Tarefa 02: Factory Method
**Arquivo:** `src/factories/PaymentFactory.js`

A classe `PaymentFactory` é responsável por criar os objetos de pagamento corretos (PIX, Boleto, Cartão de Crédito ou Gateway Legado) a partir de um tipo recebido como string. A interface `Payments` define o contrato com o método `proceso(valor)` que todas as implementações devem cumprir.

**O que acontece quando precisarmos adicionar uma nova forma de pagamento?**

A solução facilita muito isso. Para adicionar, por exemplo, Criptomoeda, basta criar uma nova classe `CryptoPayment` que estenda `Payments` e adicionar um novo `if` na factory. O restante do sistema não precisa ser alterado porque o Controller e o Builder nunca conhecem as classes concretas eles apenas recebem um objeto que segue o contrato da interface.

---

### Tarefa 03: Builder
**Arquivo:** `src/builders/OrderBuilder.js`

A classe `OrderBuilder` constrói o objeto `Order` de forma fluente, combinando produtos, endereço e método de pagamento antes de criar o pedido. Todas as validações são centralizadas no `build()`:
- O pedido deve conter ao menos um produto
- O endereço não pode estar vazio
- O método de pagamento deve ser selecionado
- Não são permitidos produtos duplicados (ignorando maiúsculas e minúsculas)

**Por que Builder é mais adequado do que um construtor com muitos parâmetros?**

Um construtor com muitos parâmetros é difícil de ler e manter. Compare:

```javascript
// Sem Builder — difícil de entender
new Order(["Notebook", "Mouse"], "Rua XV", pagamento, 1);

// Com Builder — claro e legível
new OrderBuilder()
    .addProduct("Notebook")
    .addProduct("Mouse")
    .setAddress("Rua XV de Novembro, 123")
    .setPaymentMethodType("PIX")
    .build();
```

Além disso, o Builder centraliza todas as validações em `build()`, garantindo que o objeto só seja criado quando todos os dados estiverem corretos. Com um construtor simples, essas validações ficariam espalhadas pelo código.

---

## Atividade 04: Padrões Estruturais e Comportamentais

### Tarefa 04: Adapter
**Arquivo:** `src/models/GatewayAdapter.js`

`GatewayLegado` simula uma API de terceiros que expõe o método `efetuarCobranca(quantia, moeda)`, incompatível com o contrato `proceso(valor)` usado pelo restante do sistema. Como não é permitido alterar o gateway, `GatewayAdapter` implementa `Payments` e traduz internamente a chamada. O sistema inteiro controller, builder, factory continua chamando apenas `proceso(valor)` sem saber que existe um legado por baixo. Para usar, basta passar `"GATEWAY_LEGADO"` como tipo de pagamento ao criar um pedido.

**Sem o Adapter, o que você teria que fazer para integrar o gateway legado?**

Sem o Adapter, seria necessário modificar o controller, o builder e qualquer outro ponto do sistema que processa pagamentos para chamar diretamente `efetuarCobranca(quantia, moeda)`. Isso espalharia o acoplamento com a API externa por todo o código. Se o gateway mudasse sua assinatura, múltiplos arquivos precisariam ser alterados.

**Como o Adapter preserva o princípio Open/Closed?**

O sistema está fechado para modificação: nenhuma classe existente foi alterada para integrar o gateway. Está aberto para extensão: criamos `GatewayAdapter` como uma classe nova que se encaixa no contrato já existente. Se amanhã surgir um segundo gateway legado com interface diferente, basta criar um segundo adapter o restante do sistema não muda.

---

### Tarefa 05: Decorator
**Arquivos:** `src/models/PaymentDecorators.js`

`PaymentDecorator` é a classe base que envolve qualquer objeto `Payments` e delega a chamada. `LogDecorator` registra o valor e o método antes e depois de processar. `DescontoDecorator` recebe um percentual e reduz o valor antes de repassar. Os decorators são combináveis em qualquer ordem via endpoint `POST /orders/:id/pagar`, passando `desconto` e `log` no body.

Exemplo de cadeia: `LogDecorator → DescontoDecorator → PixPayment`. Cada camada faz sua parte e delega para a próxima.

**Como você adicionaria novos comportamentos (ex: enviar SMS) sem tocar nas classes existentes?**

Basta criar `SmsDecorator extends PaymentDecorator` com a lógica de SMS no método `proceso()`, chamando `super.proceso(valor)` ao final. Nenhuma classe existente precisa ser modificada.

**Compare essa abordagem com herança simples.**

Com herança, cada combinação de comportamentos exigiria uma subclasse própria: `PixComLog`, `PixComDesconto`, `PixComLogEDesconto`, `BoletoComLog`... Para N meios de pagamento e M comportamentos extras, seriam necessárias N×M subclasses. Com Decorator, cada comportamento é uma classe independente e combináveis livremente em runtime, sem explosão combinatória.

---

### Tarefa 06: Facade
**Arquivo:** `src/controllers/CheckoutController.js`

O fluxo de finalização envolve quatro subsistemas: `EstoqueService`, `PagamentoService`, `CarrinhoService` e `EmailService`. O `CheckoutController` atua como a própria fachada: expõe um único endpoint `POST /orders/:id/checkout` e orquestra internamente todos os subsistemas. Nenhum outro controller conhece esses serviços diretamente.

**O que aconteceria com o controller se a Facade não existisse e um subsistema mudasse sua API?**

Sem a Facade, o `OrderController` precisaria importar e chamar cada subsistema diretamente. Se `EstoqueService` mudasse o nome do método `verificar()` para `checarDisponibilidade()`, o controller precisaria ser alterado. Com múltiplos controllers fazendo o mesmo, a mudança se propagaria por todo o sistema.

**Como a Facade protege o código cliente de mudanças internas?**

A Facade é o único ponto de contato com os subsistemas. Se um serviço interno mudar sua API, apenas o `CheckoutController` precisa ser atualizado. O restante do sistema continua chamando `finalizar(pedido, valor)` sem saber o que acontece por dentro.

---

### Tarefa 07: Strategy
**Arquivos:** `src/models/Carrinho.js` · `src/controllers/CarrinhoController.js`

A interface `EstrategiaFrete` define o contrato `calcular(peso)`. Três estratégias implementadas: `FreteCorreios` (R$5 fixo + R$1,50/kg), `FreteJadlog` (R$8 fixo + R$1,00/kg) e `FreteRetirada` (gratuito). A classe `Carrinho` recebe a estratégia via construtor e pode trocá-la com `setFrete()`. O endpoint `POST /carrinho/calcular` demonstra a troca em runtime passando `"frete": "CORREIOS"`, `"JADLOG"` ou `"RETIRADA"` no body.

**Como você adicionaria uma nova transportadora (ex: DHL) sem modificar a classe Carrinho?**

Basta criar `FreteDHL extends EstrategiaFrete` com o método `calcular(peso)` implementado, e registrá-la no `CarrinhoController`. A classe `Carrinho` não precisa ser tocada ela só conhece a interface, não as implementações concretas.

**Que princípio SOLID o Strategy ajuda a respeitar?**

O princípio **Open/Closed**: `Carrinho` está fechado para modificação e aberto para extensão. Também respeita o **Single Responsibility**: cada estratégia tem uma única responsabilidade, que é calcular o frete da sua transportadora.

---

### Tarefa 08: Observer
**Arquivos:** `src/models/OrderObservers.js` · `src/models/Order.js`

`Order` implementa o papel de Subject: mantém uma lista de observers e chama `notificar()` automaticamente em `setStatus()`. Três observers registrados ao criar cada pedido: `EmailObserver` (notifica o cliente), `EstoqueObserver` (realiza a baixa) e `LogObserver` (auditoria com timestamp). Qualquer mudança de status seja ao confirmar via checkout, ao cancelar via command ou em qualquer outro fluxo — dispara todos os observers automaticamente.

**O que muda no código quando você precisa adicionar um novo observer (ex: SMS)?**

Apenas uma linha no `OrderController.create()`:
```javascript
order.registrarObserver(new SmsObserver());
```
A classe `Order` não muda. Os observers existentes não mudam. É necessário apenas criar `SmsObserver extends Observer` com o método `atualizar(pedido)`.

**Compare com uma implementação sem o padrão, onde Pedido chamaria cada serviço diretamente.**

Sem o Observer, `Order` precisaria importar e chamar `EmailService`, `EstoqueService` e `LogService` diretamente dentro de `setStatus()`. Cada novo serviço de notificação exigiria alterar a classe `Order`, criando forte acoplamento entre o modelo de domínio e os serviços de infraestrutura. O modelo deixaria de ser responsável apenas pelos dados do pedido e passaria a conhecer detalhes de envio de e-mail, estoque e logging.

---

### Tarefa 09: Command
**Arquivo:** `src/models/OrderCommands.js`

Cada ação é encapsulada como um objeto com `executar()` e `desfazer()`. `CancelarPedidoComando` salva o status anterior em `executar()` e o restaura em `desfazer()`. `AtualizarEnderecoComando` faz o mesmo com o endereço (bônus). `GerenciadorComandos` mantém o histórico e expõe `desfazerUltimo()`. Os endpoints disponíveis são `POST /orders/:id/cancelar`, `POST /orders/:id/endereco` e `POST /orders/desfazer`.

**Que vantagens o Command traz além do undo?**

- **Auditabilidade**: o histórico de comandos registra exatamente o que foi executado e quando
- **Fila de tarefas**: comandos podem ser enfileirados e executados de forma assíncrona ou agendada
- **Replay**: é possível re-executar uma sequência de ações para reconstruir um estado
- **Transações**: um conjunto de comandos pode ser revertido em caso de falha em qualquer etapa

**Como você usaria esse padrão para implementar uma fila de tarefas assíncronas?**

`GerenciadorComandos` poderia receber comandos em uma fila e processá-los em background com `setInterval` ou uma biblioteca de filas. Cada comando encapsula tudo que precisa para executar de forma independente sem depender de estado externo no momento da execução o que o torna naturalmente serializável e adequado para processamento assíncrono.

---

## Estrutura do projeto

src/

├── builders/        Builder: montagem fluente de Order com validações

├── config/          Singleton: única conexão com o banco

├── controllers/

│   ├── OrderControllers.js    CRUD + Decorator + Observer + Command

│   ├── CheckoutController.js  Facade: finalização de pedido

│   └── CarrinhoController.js  Strategy: cálculo de frete

├── factories/       Factory Method: criação de métodos de pagamento

├── interfaces/      Contrato base Payments

├── models/

│   ├── Order.js               Entidade principal (Subject do Observer)

│   ├── PixPayment.js

│   ├── BoletoPayment.js

│   ├── CreditCardPayment.js

│   ├── GatewayAdapter.js      Adapter: compatibiliza gateway legado

│   ├── PaymentDecorators.js   Decorator: Log e Desconto combináveis

│   ├── Carrinho.js            Strategy: frete intercambiável

│   ├── OrderObservers.js      Observer: Email, Estoque, Log

│   └── OrderCommands.js       Command: ações com undo e histórico

├── repositories/    Persistência em memória

└── routes/          Endpoints da API

---

## Endpoints

| Método | Rota                      | Padrão   | Descrição                          |
|--------|---------------------------|----------|------------------------------------|
| POST   | /orders                   | Builder  | Criar pedido                       |
| GET    | /orders                   | —        | Listar todos os pedidos            |
| GET    | /orders/:id               | —        | Buscar pedido por ID               |
| PUT    | /orders/:id               | Builder  | Atualizar pedido                   |
| DELETE | /orders/:id               | —        | Remover pedido                     |
| POST   | /orders/:id/pagar         | Decorator| Processar pagamento com log/desconto|
| POST   | /orders/:id/checkout      | Facade   | Finalizar pedido completo          |
| POST   | /orders/:id/cancelar      | Command  | Cancelar pedido                    |
| POST   | /orders/:id/endereco      | Command  | Atualizar endereço (bônus)         |
| POST   | /orders/desfazer          | Command  | Desfazer última ação               |
| POST   | /carrinho/calcular        | Strategy | Calcular frete por transportadora  |

---

## Como rodar

**Requisitos:** Node.js v18 ou superior

```bash
npm install
node --watch app.js
```

---

## Exemplos de requisição

**POST /orders**
```json
{
    "products": ["Notebook", "Mouse"],
    "address": "Rua XV de Novembro, 123",
    "paymentMethod": { "type": "PIX" }
}
```
Tipos disponíveis: `PIX`, `BOLETO`, `CARTÃO`, `GATEWAY_LEGADO`

**POST /orders/1/pagar**
```json
{ "valor": 200.00, "desconto": 10, "log": true }
```

**POST /orders/1/checkout**
```json
{ "valor": 350.00 }
```

**POST /carrinho/calcular**
```json
{
    "itens": [
        { "nome": "Notebook", "peso": 2.5, "preco": 3500 },
        { "nome": "Mouse",    "peso": 0.3, "preco": 80   }
    ],
    "frete": "CORREIOS"
}
```
Transportadoras disponíveis: `CORREIOS`, `JADLOG`, `RETIRADA`

**POST /orders/1/cancelar** sem body

**POST /orders/desfazer** sem body

**POST /orders/1/endereco**
```json
{ "address": "Av. Paulista, 1000" }
```

---

## Reflexão: O que seria diferente sem os padrões?

**Sem Singleton:** múltiplas conexões com o banco seriam criadas, consumindo recursos desnecessários e dificultando o controle do ciclo de vida da conexão.

**Sem Factory Method:** o Controller precisaria conhecer todas as classes concretas de pagamento e usar `if/else` espalhados pelo código, dificultando a adição de novos métodos.

**Sem Builder:** o pedido seria criado com um construtor de muitos parâmetros, sem validações centralizadas e difícil de manter conforme o sistema crescesse.

**Sem Adapter:** o sistema precisaria ser modificado em múltiplos pontos para integrar o gateway legado, acoplando código interno a uma API externa e violando o Open/Closed.

**Sem Decorator:** cada combinação de comportamentos extras (log, desconto, SMS) exigiria uma subclasse nova por meio de pagamento, criando uma explosão de classes inviável de manter.

**Sem Facade:** o controller conheceria todos os subsistemas de checkout diretamente. Qualquer mudança interna em um subsistema se propagaria pelo código cliente.

**Sem Strategy:** a lógica de cada transportadora ficaria dentro de `Carrinho` com `if/else`, tornando impossível adicionar novas sem alterar a classe.

**Sem Observer:** `Order` chamaria diretamente cada serviço de notificação, acoplando o modelo de domínio a serviços de infraestrutura e dificultando a adição de novos observers.

**Sem Command:** não haveria como desfazer ações, auditar o histórico ou enfileirar operações. O cancelamento seria uma simples mutação de estado sem possibilidade de reversão.

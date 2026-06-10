# padroes_criacionais
Implementação e estudo dos padrões de projeto criacionais (Singleton, Factory Method, Builder) aplicando conceitos de Programação Orientada a Objetos.


# Padrões Criacionais — E-commerce Backend

## Alunos

- Eliezer Velásquez
- Pablo Ricardo Paul

## Sobre o projeto

Backend de um sistema de e-commerce desenvolvido com Node.js e Express, 
aplicando os três padrões criacionais do GoF: Singleton, Factory Method e Builder.

O sistema permite gerenciar pedidos com um CRUD completo via API REST,
combinando métodos de pagamento e endereços de entrega.

## Padrões aplicados

### Tarefa 01 — Singleton
**Arquivo:** `src/config/DatabaseConnection.js`

A classe `DatabaseConnection` garante que apenas uma instância de conexão 
com o banco de dados seja criada durante toda a execução do sistema.

**Por que faz sentido usar Singleton aqui?**

Sem o Singleton, cada parte do sistema poderia criar sua própria conexão 
com o banco, resultando em múltiplas conexões desnecessárias que consomem 
memória e recursos. O Singleton resolve isso garantindo uma única instância 
compartilhada por toda a aplicação, centraliza o acesso ao banco e facilita 
o controle do ciclo de vida da conexão.

### Tarefa 02 — Factory Method
**Arquivo:** `src/factories/PaymentFactory.js`

A classe `PaymentFactory` é responsável por criar os objetos de pagamento 
corretos, PIX, Boleto ou Tarjeta de Crédito a partir de um tipo recibido.

A interface `Payments` define el contrato con el método `proceso(valor)` 
que todas las implementaciones deben cumplir.

**O que acontece quando precisarmos adicionar uma nova forma de pagamento?**

Sim, a solução facilita isso. Para adicionar, por exemplo, Criptomoeda, 
basta criar uma nova classe `CryptoPayment` que implemente `Payments` e 
adicionar um novo `if` na factory. O restante do sistema não precisa ser 
alterado porque o Controller e o Builder nunca conhecem as classes concretas 
eles apenas recebem um objeto que segue o contrato da interface.

### Tarefa 03 — Builder
**Arquivo:** `src/builders/OrderBuilder.js`

A classe `OrderBuilder` constrói o objeto `Order` de forma fluente, 
combinando produtos, endereço e método de pagamento antes de criar o pedido.

Validações aplicadas no `build()`:
- O pedido deve conter ao menos um produto
- O endereço não pode estar vazio
- O método de pagamento deve ser selecionado
- Não são permitidos produtos duplicados (ignorando maiúsculas e minúsculas)

**Por que Builder é mais adequado do que um construtor com muitos parâmetros?**

Um construtor com muitos parâmetros é difícil de ler e manter. Por exemplo:

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

Além disso, o Builder centraliza todas as validações em `build()`, 
garantindo que o objeto só seja criado quando todos os dados estiverem 
corretos.

## Decisões arquiteturais

O projeto segue uma estrutura inspirada em MVC para separar responsabilidades:

| Camada | Responsabilidade |
|---|---|
| `config/` | Singleton — conexão com o banco |
| `interfaces/` | Contrato base para pagamentos |
| `models/` | Entidades do domínio |
| `factories/` | Factory Method — criação de pagamentos |
| `builders/` | Builder — montagem de pedidos |
| `repositories/` | Persistência em memória |
| `controllers/` | Coordena o fluxo da aplicação |
| `routes/` | Define os endpoints da API |

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | /orders | Criar pedido |
| GET | /orders | Listar todos os pedidos |
| GET | /orders/:id | Buscar pedido por ID |
| PUT | /orders/:id | Atualizar pedido |
| DELETE | /orders/:id | Eliminar pedido |

---

## Como rodar

**Requisitos:**
- Node.js v18 ou superior

**Instalação:**
```bash
npm install
```

**Executar:**
```bash
node --watch app.js
```

**Exemplo de requisição POST:**
```json
{
    "products": ["Notebook", "Mouse"],
    "address": "Rua XV de Novembro, 123",
    "paymentMethod": {
        "type": "PIX"
    }
}
```

Tipos de pagamento disponíveis: `PIX`, `BOLETO`, `CARTÃO`

---

## Reflexão — O que seria diferente sem os padrões?

**Sem Singleton:** múltiplas conexões com o banco seriam criadas, 
consumindo recursos desnecessários.

**Sem Factory Method:** o Controller precisaria conhecer todas as classes 
concretas de pagamento e usar `if/else` espalhados pelo código, dificultando 
a adição de novos métodos.

**Sem Builder:** o pedido seria criado com um construtor de muitos parâmetros, 
sem validações centralizadas e difícil de manter conforme o sistema crescesse.
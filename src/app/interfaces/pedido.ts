export interface Pedido {
    cod?: string; //codigo do pedido
    id?: string //saber
    
    produtoNome?: {}; //lista de nomes do pedido
    produtoPreco?: {}; //lista dos precos dos pedidos
    produtoQuantidade?: {}; //lista de quantidades por produto
    produtoPicture?: {};
    ValorTotal?: number; //preco da soma dos produtos*quantidade

    fornecedor?: string;
    fornecedorId?: string;
    clienteId?: string;
    clienteName?:string;
    clienteEndereco?: string;
    proximoAque?: string;
    clienteTelefone?: number;
    formaPagamento?: string;
    dataEhorario?:number;
    descricaoEobservacoes?: string;
    status?: string;
    empresaPicture?:string;
    contatorEmpresa?:number;

    movitoCancelamento?:string;
}
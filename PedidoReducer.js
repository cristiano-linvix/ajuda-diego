// TYPES
import * as TYPES from "~/redux/types";

const INITIAL_STATE = {
  numero: null,
  tipo: "Pedido",

  cliente: {
    codigo: "000000",
    nome: "Consumidor"
  },

  // PRODUTOS
  produtos: [],

  // DADOS DO PEDIDO
  vendedor: "",
  observacoes: "",
  local_entrega: "",

  // VALORES TOTAIS
  valor_total_produtos: 0.0,
  valor_total_descontos: 0.0,
  valor_total_pedido: 0.0,

  data_hora: "",

  situacao: "SALVO",
  faturado: false,

  util: {
    refreshList: Date.now(),
    saveSuccess: false
  }
};

export default (state = INITIAL_STATE, action) => {
  /**
   * Atualiza o escopo geral do pedido aberto.
   */
  if (action.type == TYPES.PEDIDOS_ATUALIZA_ESCOPO_PEDIDO) {
    return {
      ...state,
      ...action.payload
    };
  }

  /**
   * Adiciona um produto no pedido aberto.
   */
  if (action.type == TYPES.PEDIDOS_PRODUTOS_ADICIONAR) {
    let produtos = [...state.produtos, action.payload];

    let totais = CalculaValoresTotaisPedido(produtos);

    return {
      ...state,
      produtos: produtos,
      util: {
        refreshList: Date.now()
      },
      ...totais
    };
  }

  /**
   * Atualiza um produto no pedido aberto.
   */
  if (action.type == TYPES.PEDIDOS_PRODUTOS_ATUALIZAR) {
    let produtos = state.produtos;

    // localizo o index do produto na array
    var index = produtos
      .map(function(produto) {
        return produto.key;
      })
      .indexOf(action.payload.key);

    // passo para array o produto atualizado
    produtos[index] = action.payload;

    // calcula os totais
    let totais = CalculaValoresTotaisPedido(produtos);

    return {
      ...state,
      produtos: produtos,
      util: {
        refreshList: Date.now()
      },
      ...totais
    };
  }

  /**
   * Remove um produto do pedido aberto.
   */
  if (action.type == TYPES.PEDIDOS_PRODUTOS_REMOVER) {
    let produtos = state.produtos;

    // localizo o index do produto na array
    var index = produtos
      .map(function(produto) {
        return produto.key;
      })
      .indexOf(action.payload.key);

    // remove o item da array
    produtos.splice(index, 1);

    // recria o índice da tabela
    for (var i = 0; i < produtos.length; i++) {
      produtos[i].item = i + 1;
    }

    // calcula os totais
    let totais = CalculaValoresTotaisPedido(produtos);

    return {
      ...state,
      produtos: produtos,
      util: {
        refreshList: Date.now()
      },
      ...totais
    };
  }

  /**
   * Funcão que finaliza o pedido e volta o estado inicial da aplicação.
   */
  if (action.type == TYPES.PEDIDOS_FINALIZAR_PEDIDO) {
    return {
      ...INITIAL_STATE
    };
  }

  // Calcula o valor total do pedido
  let totais = CalculaValoresTotaisPedido(state.produtos);

  return {
    ...state,
    ...totais
  };
};

/**
 * Função que calcula os totais do pedido.
 */
CalculaValoresTotaisPedido = produtos => {
  let valor_total_pedido = 0.0;
  let valor_total_produtos = 0.0;
  let valor_total_descontos = 0.0;

  for (var i = 0; i < produtos.length; i++) {
    valor_total_produtos += parseFloat(
      (produtos[i].valor_unitario + produtos[i].valor_desconto_unitario) * produtos[i].qtd
    );

    valor_total_descontos += parseFloat(produtos[i].valor_desconto_total);
  }

  valor_total_pedido = valor_total_produtos - valor_total_descontos;

  // RETORNA OS TOTAIS
  return { valor_total_pedido, valor_total_produtos, valor_total_descontos };
};

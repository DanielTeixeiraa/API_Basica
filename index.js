const express = require("express");
const http = require("http");
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Middleware
app.use(express.json());

// Simular um banco de dados
let eventos = [];
let ingressos = [];
let usuarios = [];
let compras = [];

// Modelo de Evento
class Evento {
  constructor(id, nome, data, localizacao, ingressosDisponiveis) {
    this.id = id;
    this.nome = nome;
    this.data = data;
    this.localizacao = localizacao;
    this.ingressosDisponiveis = ingressosDisponiveis;
  }
}

// Modelo de Ingresso
class Ingresso {
  constructor(id, eventoId, preco) {
    this.id = id;
    this.eventoId = eventoId;
    this.preco = preco;
  }
}

// Modelo de Usuário
class Usuario {
  constructor(id, nome, email) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}

// Modelo de Compra
class Compra {
  constructor(id, usuarioId, ingressoId, dataCompra) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.ingressoId = ingressoId;
    this.dataCompra = dataCompra;
  }
}

// Criar Evento
app.post('/eventos', (req, res) => {
    const { nome, data, localizacao, ingressosDisponiveis } = req.body;
    if (!nome || !data || !localizacao || ingressosDisponiveis === undefined) {
      res.status(400).send('Campos obrigatórios não podem estar vazios.');
      return;
    }
    const novoEvento = new Evento(eventos.length + 1, nome, data, localizacao, ingressosDisponiveis);
    eventos.push(novoEvento);
    res.status(201).json(novoEvento);
  });

// Ler (Listar todos os eventos)
app.get('/eventos', (req, res) => {
  res.json(eventos);
});

// Atualizar um evento pelo ID
app.put('/eventos/:id', (req, res) => {
    const eventoId = parseInt(req.params.id);
    const updatedEvento = req.body;
  
    const eventoExistente = eventos.find((evento) => evento.id === eventoId);
  
    if (!eventoExistente) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
  
    eventoExistente.nome = updatedEvento.nome || eventoExistente.nome;
    eventoExistente.data = updatedEvento.data || eventoExistente.data;
    eventoExistente.localizacao = updatedEvento.localizacao || eventoExistente.localizacao;
    eventoExistente.ingressosDisponiveis = updatedEvento.ingressosDisponiveis || eventoExistente.ingressosDisponiveis;
  
    res.status(200).json(eventoExistente);
  });

// Excluir um evento pelo ID
app.delete('/eventos/:id', (req, res) => {
    const eventoId = parseInt(req.params.id);
    const eventoIndex = eventos.findIndex((evento) => evento.id === eventoId);
  
    if (eventoIndex === -1) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
  
    const deletedEvento = eventos.splice(eventoIndex, 1)[0];
    res.status(200).json(deletedEvento);
  });
  
  

// Ler (Obter um evento específico por ID)
app.get('/eventos/:id', (req, res) => {
  const eventoId = parseInt(req.params.id);
  const evento = eventos.find((evento) => evento.id === eventoId);
  if (!evento) {
    res.status(404).send('Evento não encontrado');
  } else {
    res.json(evento);
  }
});

// Criar Ingresso
app.post('/ingressos', (req, res) => {
    const { eventoId, preco } = req.body;
    if (!eventoId || preco === undefined) {
      res.status(400).send('Campos obrigatórios não podem estar vazios.');
      return;
    }
    const novoIngresso = new Ingresso(ingressos.length + 1, eventoId, preco);
    ingressos.push(novoIngresso);
    res.status(201).json(novoIngresso);
  });

// Atualizar um ingresso pelo ID
app.put('/ingressos/:id', (req, res) => {
  const ingressoId = parseInt(req.params.id);
  const updatedIngresso = req.body;

  const ingressoExistente = ingressos.find((ingresso) => ingresso.id === ingressoId);

  if (!ingressoExistente) {
    return res.status(404).json({ error: 'Ingresso não encontrado' });
  }

  ingressoExistente.eventoId = updatedIngresso.eventoId || ingressoExistente.eventoId;
  ingressoExistente.preco = updatedIngresso.preco || ingressoExistente.preco;

  res.status(200).json(ingressoExistente);
});

  

// Excluir um ingresso pelo ID
app.delete('/ingressos/:id', (req, res) => {
    const ingressoId = parseInt(req.params.id);
    const ingressoIndex = ingressos.findIndex((ingresso) => ingresso.id === ingressoId);
  
    if (ingressoIndex === -1) {
      return res.status(404).json({ error: 'Ingresso não encontrado' });
    }
  
    const deletedIngresso = ingressos.splice(ingressoIndex, 1)[0];
    res.status(200).json(deletedIngresso);
  });
  

// Ler (Listar todos os ingressos de um evento específico)
app.get('/ingressos/evento/:eventoId', (req, res) => {
    const eventoId = parseInt(req.params.eventoId);
    const ingressosDoEvento = ingressos.filter(ingresso => ingresso.eventoId == eventoId);
    res.status(200).json(ingressosDoEvento);
  });

// Criar Usuário
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) {
      res.status(400).send('Campos obrigatórios não podem estar vazios.');
      return;
    }
    const novoUsuario = new Usuario(usuarios.length + 1, nome, email);
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
  });

// Excluir um usuário pelo ID
app.delete('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const usuarioIndex = usuarios.findIndex((usuario) => usuario.id === usuarioId);
  
    if (usuarioIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  
    const deletedUsuario = usuarios.splice(usuarioIndex, 1)[0];
    res.status(200).json(deletedUsuario);
  });

// Atualizar um usuário pelo ID
app.put('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const updatedUsuario = req.body;
  
    const usuarioExistente = usuarios.find((usuario) => usuario.id === usuarioId);
  
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  
    usuarioExistente.nome = updatedUsuario.nome || usuarioExistente.nome;
    usuarioExistente.email = updatedUsuario.email || usuarioExistente.email;
  
    res.status(200).json(usuarioExistente);
  });
  

// Ler (Listar todos os usuários)
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// Criar Compra
app.post('/compras', (req, res) => {
    const { usuarioId, ingressoId } = req.body;
    if (!usuarioId || !ingressoId) {
      res.status(400).send('Campos obrigatórios não podem estar vazios.');
      return;
    }
    const dataCompra = new Date();
    const novaCompra = new Compra(compras.length + 1, usuarioId, ingressoId, dataCompra);
    compras.push(novaCompra);
    res.status(201).json(novaCompra);
  });

// Atualizar uma compra pelo ID
app.put('/compras/:id', (req, res) => {
    const compraId = parseInt(req.params.id);
    const updatedCompra = req.body;
  
    const compraExistente = compras.find((compra) => compra.id === compraId);
  
    if (!compraExistente) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
  
    compraExistente.usuarioId = updatedCompra.usuarioId || compraExistente.usuarioId;
    compraExistente.ingressoId = updatedCompra.ingressoId || compraExistente.ingressoId;
  
    res.status(200).json(compraExistente);
  });
  

// Excluir uma compra pelo ID
app.delete('/compras/:id', (req, res) => {
    const compraId = parseInt(req.params.id);
    const compraIndex = compras.findIndex((compra) => compra.id === compraId);
  
    if (compraIndex === -1) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
  
    const deletedCompra = compras.splice(compraIndex, 1)[0];
    res.status(200).json(deletedCompra);
  });
  

// Ler (Listar todas as compras de um usuário específico)
app.get('/compras/usuario/:usuarioId', (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId);
  const comprasUsuario = compras.filter((compra) => compra.usuarioId == usuarioId);
  res.status(200).json(comprasUsuario);
});

// Iniciar o servidor
server.listen(port, "0.0.0.0", () => {
  console.log("Servidor iniciado");
});

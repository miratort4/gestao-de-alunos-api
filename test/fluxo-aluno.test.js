import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAdmin, loginAluno } from './helpers/auth.js';
import { readFileSync } from 'fs';
const dados = JSON.parse(readFileSync(new URL('./data/dados.json', import.meta.url), 'utf-8'));


describe('Fluxo completo do aluno (E2E)', () => {
  let tokenAdmin;
  let tokenAluno;
  let alunoId;
  const emailUnico = `aluno.teste.${Date.now()}@example.com`;

  it('1. Deve logar como administrador', async () => {
    tokenAdmin = await loginAdmin(dados.admin);
    expect(tokenAdmin).to.be.a('string').and.not.empty;
  });

  it('2. Deve cadastrar um novo aluno como administrador', async () => {
    const resposta = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nome: dados.novoAluno.nome,
        email: emailUnico,
        matricula: dados.novoAluno.matricula + Date.now().toString().slice(-3),
        senha: dados.novoAluno.senha,
      });

    expect(resposta.status).to.be.oneOf([200, 201]);
    expect(resposta.body).to.have.property('_id').or.to.have.property('id');
    alunoId = resposta.body._id || resposta.body.id;
    expect(alunoId).to.be.a('string').and.not.empty;
  });

  it('3. Deve logar como o aluno recém-cadastrado', async () => {
    tokenAluno = await loginAluno({
      email: emailUnico,
      senha: dados.novoAluno.senha,
    });

    expect(tokenAluno).to.be.a('string').and.not.empty;
  });

  it('4. Deve registrar a entrega de um trabalho como aluno', async () => {
    const resposta = await request(app)
      .post(`/api/alunos/${alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${tokenAluno}`)
      .send({
        disciplinaId: dados.disciplina.id,
        titulo: dados.trabalho.titulo,
      });

    expect(resposta.status).to.be.oneOf([200, 201]);
    expect(resposta.body).to.have.property('titulo', dados.trabalho.titulo);
  });
});


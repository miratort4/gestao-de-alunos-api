import request from 'supertest';
import app from '../../src/app.js';
import 'dotenv/config';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@escola.com';
const ADMIN_SENHA = process.env.ADMIN_SENHA || 'admin123';

/**
 * Faz login como administrador e retorna o token JWT.
 * @param {Object} credenciais - { email, senha } (opcional, usa .env como padrão)
 * @returns {Promise<string>} Token JWT
 */

export async function loginAdmin(credenciais = null) {
  const email = credenciais?.email || ADMIN_EMAIL;
  const senha = credenciais?.senha || ADMIN_SENHA;

  const resposta = await request(app)
    .post('/api/auth/login')
    .send({ email, senha });

  if (resposta.status !== 200) {
    throw new Error(
      `Falha no login do admin: status ${resposta.status} - ${JSON.stringify(resposta.body)}`
    );
  }

  return resposta.body.token;
}

/**
 * Faz login como aluno e retorna o token JWT.
 * @param {Object} credenciais - { email, senha }
 * @returns {Promise<string>} Token JWT
 */

export async function loginAluno(credenciais) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({ email: credenciais.email, senha: credenciais.senha });

  if (resposta.status !== 200) {
    throw new Error(
      `Falha no login do aluno: status ${resposta.status} - ${JSON.stringify(resposta.body)}`
    );
  }

  return resposta.body.token;
}

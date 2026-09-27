import mongoose from 'mongoose';

// Roda UMA VEZ antes de todos os testes
export const mochaHooks = {
  afterAll(done) {
    mongoose.connection.close().then(() => done()).catch(done);
  },
};

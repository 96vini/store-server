import config from '@/config';
import email from '@/infra/email';
import { ActivateAccountTokens } from '@/models/activate-account-token';

const createAndSendActivationEmail = async (user) => {
  const tokenObject = await create(user);
  await sendEmailToUser(user, tokenObject.id);
};

const create = async (user) => {
  const activateAccountToken = await ActivateAccountTokens.create({
    user_id: user._id,
    expires_at: new Date(Date.now() + 15 * 60 * 1000)
  });

  return activateAccountToken;
};

const sendEmailToUser = async (user, tokenId) => {
  const activationPageEndpoint = getActivationPageEndpoint(tokenId);

  await email.send({
    from: {
      name: 'Bloob',
      address: 'contato@bloob.com.br'
    },
    to: user.email,
    subject: 'Ative seu cadastro no Bloob',
    text: `${user.username}, clique no link abaixo para ativar seu cadastro no Bloob:

${activationPageEndpoint}

Caso você não tenha feito esta requisição, ignore esse email.

Atenciosamente,
Equipe Bloob
Rua Antônio da Veiga, 495, Blumenau, SC, 89012-500`
  });
};

const getActivationApiEndpoint = () => {
  return `${config.appURL}/api/v1/activation`;
};

const getActivationPageEndpoint = (tokenId) => {
  return tokenId
    ? `${config.appURL}/cadastro/ativar/${tokenId}`
    : `${config.appURL}/cadastro/ativar`;
};

export default Object.freeze({
  create,
  createAndSendActivationEmail,
  getActivationApiEndpoint,
  getActivationPageEndpoint
});

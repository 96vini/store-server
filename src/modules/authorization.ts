import { ValidationError } from '@/modules/errors';

const availableFeatures = new Set([
  // USER
  'create:user',
  'read:user',
  'read:user:self',
  'update:user',

  // MIGRATION
  'read:migration',
  'create:migration',

  // ACTIVATION_TOKEN
  'read:activation_token',

  // RECOVERY_TOKEN
  'read:recovery_token',

  // EMAIL_CONFIRMATION_TOKEN
  'read:email_confirmation_token',

  // SESSION
  'create:session',
  'create:session:google',
  'read:session',

  // MODERATION
  'read:user:list',
  'read:votes:others',
  'update:content:others',
  'ban:user',
  'create:recovery_token:username'
]);

const can = (user, feature, resource?) => {
  validateUser(user);
  validateFeature(feature);

  if (!user.features.includes(feature)) return false;

  if (!resource) return true;

  return false;
};

const filterInput = (user, feature, input) => {
  validateUser(user);
  validateFeature(feature);
  validateInput(input);

  let filteredInputValues = {};

  if (feature === 'create:session' && can(user, feature)) {
    filteredInputValues = {
      email: input.email,
      password: input.password
    };
  }

  if (feature === 'create:user' && can(user, feature)) {
    filteredInputValues = {
      name: input.name,
      username: input.username,
      email: input.email,
      password: input.password
    };
  }

  if (feature === 'create:post' && can(user, feature)) {
    filteredInputValues = {
      content: input.content,
      location: input.location
    };
  }

  if (feature === 'read:activation_token' && can(user, feature)) {
    filteredInputValues = {
      tokenId: input.token_id
    };
  }

  return JSON.parse(JSON.stringify(filteredInputValues));
};

const filterOutput = (user, feature, output) => {
  validateUser(user);
  validateFeature(feature);
  validateOutput(output);

  let filteredOutputValues = {};

  if (feature === 'read:user') {
    filteredOutputValues = {
      id: output.id,
      email: output.email,
      username: output.username,
      created_at: output.created_at,
      updated_at: output.updated_at
    };
  }

  if (feature === 'create:session' && can(user, feature)) {
    if (user.id && output.user_id && user.id === output.user_id) {
      filteredOutputValues = {
        id: output.id,
        token: output.token,
        expires_at: output.expires_at,
        created_at: output.created_at,
        updated_at: output.updated_at
      };
    }
  }

  if (feature === 'read:post') {
    filteredOutputValues = {
      id: output.id,
      user_id: output.user_id,
      content: output.content,
      created_at: output.created_at,
      updated_at: output.updated_at
    };
  }

  if (feature === 'read:activation_token') {
    filteredOutputValues = {
      id: output.id,
      used: output.used,
      expires_at: output.expires_at,
      created_at: output.created_at,
      updated_at: output.updated_at
    };
  }

  // Force the clean up of "undefined" values
  return JSON.parse(JSON.stringify(filteredOutputValues));
};

const validateUser = (user) => {
  if (!user) {
    throw new ValidationError({
      message: `Nenhum "user" foi especificado para a ação de autorização.`,
      action: `Contate o suporte informado o campo "errorId".`
    });
  }

  if (!user.features || !Array.isArray(user.features)) {
    throw new ValidationError({
      message: `"user" não possui "features" ou não é um array.`,
      action: `Contate o suporte informado o campo "errorId".`
    });
  }
};

const validateFeature = (feature) => {
  if (!feature) {
    throw new ValidationError({
      message: `Nenhuma "feature" foi especificada para a ação de autorização.`,
      action: `Contate o suporte informado o campo "errorId".`
    });
  }

  if (!availableFeatures.has(feature)) {
    throw new ValidationError({
      message: `A feature utilizada não está disponível na lista de features existentes.`,
      action: `Contate o suporte informado o campo "errorId".`,
      context: {
        feature: feature
      }
    });
  }
};

const validateInput = (input) => {
  if (!input) {
    throw new ValidationError({
      message: `Nenhum "input" foi especificado para a ação de filtro.`,
      action: `Contate o suporte informado o campo "errorId".`
    });
  }
};

const validateOutput = (output) => {
  if (!output) {
    throw new ValidationError({
      message: `Nenhum "output" foi especificado para a ação de filtro.`,
      action: `Contate o suporte informado o campo "errorId".`
    });
  }
};

export default Object.freeze({
  can,
  filterOutput,
  filterInput
});

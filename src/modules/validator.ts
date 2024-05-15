import Joi from 'joi';
import { ValidationError } from './errors';

export default function validator(object, keys) {
  try {
    object = JSON.parse(JSON.stringify(object));
  } catch (error) {
    throw new ValidationError({
      message: 'Não foi possível interpretar o valor enviado.',
      action: 'Verifique se o valor enviado é um JSON válido.',
      errorLocationCode: 'MODULE:VALIDATOR:ERROR_PARSING_JSON',
      stack: new Error().stack,
      key: 'object'
    });
  }

  let finalSchema = Joi.object().required().min(1).messages({
    'object.base': `Body enviado deve ser do tipo Object.`,
    'object.min': `Objeto enviado deve ter no mínimo uma chave.`
  });

  for (const key of Object.keys(keys)) {
    console.log(key);
    const keyValidationFunction = schemas[key];
    console.log({ keyValidationFunction });
    finalSchema = finalSchema.concat(keyValidationFunction());
  }

  const { error, value } = finalSchema.validate(object, {
    stripUnknown: true,
    context: {
      required: keys
    }
  });

  if (error) {
    throw new ValidationError({
      message: error.details[0].message,
      key:
        error.details[0].context.key ||
        error.details[0].context.type ||
        'object',
      errorLocationCode: 'MODULE:VALIDATOR:FINAL_SCHEMA',
      stack: new Error().stack,
      type: error.details[0].type
    });
  }

  return value;
}

const schemas = {
  id: function () {
    return Joi.object({
      id: Joi.string()
        .allow(null)
        .trim()
        .guid({ version: 'uuidv4' })
        .when('$required.id', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"id" é um campo obrigatório.`,
          'string.empty': `"id" não pode estar em branco.`,
          'string.base': `"id" deve ser do tipo String.`,
          'string.guid': `"id" deve possuir um token UUID na versão 4.`
        })
    });
  },
  first_name: function () {
    return Joi.object({
      first_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .trim()
        .invalid(null)
        .when('$required.first_name', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"first_name" é um campo obrigatório.`,
          'string.empty': `"first_name" não pode estar em branco.`,
          'string.base': `"first_name" deve ser do tipo String.`,
          'string.alphanum': `"first_name" deve conter apenas caracteres alfanuméricos.`,
          'string.min': `"first_name" deve conter no mínimo {#limit} caracteres.`,
          'string.max': `"first_name" deve conter no máximo {#limit} caracteres.`,
          'any.invalid': `"first_name" possui o valor inválido "null".`,
        })
    });
  },
  last_name: function () {
    return Joi.object({
      last_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .trim()
        .invalid(null)
        .when('$required.last_name', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"lastName" é um campo obrigatório.`,
          'string.empty': `"lastName" não pode estar em branco.`,
          'string.base': `"lastName" deve ser do tipo String.`,
          'string.alphanum': `"lastName" deve conter apenas caracteres alfanuméricos.`,
          'string.min': `"lastName" deve conter no mínimo {#limit} caracteres.`,
          'string.max': `"lastName" deve conter no máximo {#limit} caracteres.`,
          'any.invalid': `"lastName" possui o valor inválido "null".`,
          'username.reserved': `Este nome de usuário não está disponível para uso.`
        })
    });
  },
  username: function () {
    return Joi.object({
      username: Joi.string()
        .max(254)
        .lowercase()
        .trim()
        .invalid(null)
        .when('$required.username', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"username" é um campo obrigatório.`,
          'string.empty': `"username" não pode estar em branco.`,
          'string.base': `"username" deve ser do tipo String.`,
          'any.invalid': `"username" possui o valor inválido "null".`
        })
    });
  },
  phone: function () {
    return Joi.object({
      phone: Joi.string()
        .max(254)
        .lowercase()
        .trim()
        .invalid(null)
        .when('$required.phone', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"phone" é um campo obrigatório.`,
          'string.empty': `"phone" não pode estar em branco.`,
          'string.base': `"phone" deve ser do tipo String.`,
          'any.invalid': `"phone" possui o valor inválido "null".`
        })
    });
  },
  password: function () {
    return Joi.object({
      // Why 72 in max length? https://security.stackexchange.com/a/39851
      password: Joi.string()
        .min(8)
        .max(72)
        .trim()
        .invalid(null)
        .when('$required.password', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"password" é um campo obrigatório.`,
          'string.empty': `"password" não pode estar em branco.`,
          'string.base': `"password" deve ser do tipo String.`,
          'string.min': `"password" deve conter no mínimo {#limit} caracteres.`,
          'string.max': `"password" deve conter no máximo {#limit} caracteres.`,
          'any.invalid': `"password" possui o valor inválido "null".`
        })
    });
  },
  address: function () {
    return Joi.object({
      street: Joi.string().trim().optional().messages({
        'string.empty': `"street" cannot be null.`,
        'string.base': `"street" must be type of String.`,
      }),
      number: Joi.string().trim().optional().messages({
        'string.empty': `"number cannot be null"`,
        'string.base': `"number must be type of String."`,
      }),
      district: Joi.string().trim().optional().messages({
        'string.empty': `"district" cannot be null`,
        'string.base': `"district" must be type of String`,
      }),
      city: Joi.string().trim().optional().messages({
        'string.empty': `"city" não pode estar em branco.`,
        'string.base': `"city" deve ser do tipo String.`,
      }),
      state: Joi.string().trim().optional().messages({
        'string.empty': `"state" não pode estar em branco.`,
        'string.base': `"state" deve ser do tipo String.`,
      }),
      zip_code: Joi.string().trim().optional().messages({
        'string.empty': `"zip_code" não pode estar em branco.`,
        'string.base': `"zip_code" deve ser do tipo String.`,
      }),
    });
  },
  token_id: function () {
    return Joi.object({
      token_id: Joi.string()
        .trim()
        .guid({ version: 'uuidv4' })
        .when('$required.token_id', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"token_id" é um campo obrigatório.`,
          'string.empty': `"token_id" não pode estar em branco.`,
          'string.base': `"token_id" deve ser do tipo String.`,
          'string.guid': `"token_id" deve possuir um token UUID na versão 4.`
        })
    });
  },

  session_id: function () {
    return Joi.object({
      session_id: Joi.string()
        .length(96)
        .alphanum()
        .when('$required.session_id', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"session_id" é um campo obrigatório.`,
          'string.empty': `"session_id" não pode estar em branco.`,
          'string.base': `"session_id" deve ser do tipo String.`,
          'string.length': `"session_id" deve possuir {#limit} caracteres.`,
          'string.alphanum': `"session_id" deve conter apenas caracteres alfanuméricos.`
        })
    });
  },
  status: function () {
    return Joi.object({
      status: Joi.string()
        .trim()
        .valid('draft', 'published', 'deleted')
        .invalid(null)
        .when('$required.status', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"status" é um campo obrigatório.`,
          'string.empty': `"status" não pode estar em branco.`,
          'string.base': `"status" deve ser do tipo String.`,
          'string.min': `"status" deve conter no mínimo {#limit} caracteres.`,
          'string.max': `"status" deve conter no máximo {#limit} caracteres.`,
          'any.invalid': `"status" possui o valor inválido "null".`,
          'any.only': `"status" deve possuir um dos seguintes valores: "draft", "published" ou "deleted".`
        })
    });
  },
  created_at: function () {
    return Joi.object({
      created_at: Joi.date()
        .when('$required.created_at', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"created_at" é um campo obrigatório.`,
          'string.empty': `"created_at" não pode estar em branco.`,
          'string.base': `"created_at" deve ser do tipo Date.`
        })
    });
  },
  updated_at: function () {
    return Joi.object({
      updated_at: Joi.date()
        .when('$required.updated_at', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"updated_at" é um campo obrigatório.`,
          'string.empty': `"updated_at" não pode estar em branco.`,
          'string.base': `"updated_at" deve ser do tipo Date.`
        })
    });
  },
  published_at: function () {
    return Joi.object({
      published_at: Joi.date()
        .allow(null)
        .when('$required.published_at', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"published_at" é um campo obrigatório.`,
          'string.empty': `"published_at" não pode estar em branco.`,
          'string.base': `"published_at" deve ser do tipo Date.`
        })
    });
  },
  deleted_at: function () {
    return Joi.object({
      deleted_at: Joi.date()
        .allow(null)
        .when('$required.deleted_at', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"deleted_at" é um campo obrigatório.`,
          'string.empty': `"deleted_at" não pode estar em branco.`,
          'string.base': `"deleted_at" deve ser do tipo Date.`
        })
    });
  },
  expires_at: function () {
    return Joi.object({
      expires_at: Joi.date()
        .allow(null)
        .when('$required.expires_at', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"expires_at" é um campo obrigatório.`,
          'string.empty': `"expires_at" não pode estar em branco.`,
          'string.base': `"expires_at" deve ser do tipo Date.`
        })
    });
  },
  ban_type: function () {
    return Joi.object({
      ban_type: Joi.string()
        .trim()
        .valid('nuke')
        .invalid(null)
        .when('$required.ban_type', {
          is: 'required',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
        .messages({
          'any.required': `"ban_type" é um campo obrigatório.`,
          'string.empty': `"ban_type" não pode estar em branco.`,
          'string.base': `"ban_type" deve ser do tipo String.`,
          'any.invalid': `"ban_type" possui o valor inválido "null".`,
          'any.only': `"ban_type" deve possuir um dos seguintes valores: "nuke".`
        })
    });
  },
  event: function () {
    return Joi.object({
      type: Joi.string()
        .valid(
          'create:user',
          'ban:user',
          'create:content:text_root',
          'create:content:text_child',
          'update:content:text_root',
          'update:content:text_child',
          'update:content:tabcoins',
          'firewall:block_users',
          'firewall:block_contents:text_root',
          'firewall:block_contents:text_child',
          'reward:user:tabcoins',
          'system:update:tabcoins'
        )
        .messages({
          'any.required': `"type" é um campo obrigatório.`,
          'string.empty': `"type" não pode estar em branco.`,
          'string.base': `"type" deve ser do tipo String.`,
          'any.only': `"type" não possui um valor válido.`
        }),
      originatorUserId: Joi.string().optional().messages({
        'string.empty': `"originatorId" não pode estar em branco.`,
        'string.base': `"originatorId" deve ser do tipo String.`,
        'string.guid': `"originatorId" deve possuir um token UUID na versão 4.`
      }),
      originatorIp: Joi.string()
        .ip({
          version: ['ipv4', 'ipv6']
        })
        .optional()
        .messages({
          'string.empty': `"originatorIp" não pode estar em branco.`,
          'string.base': `"originatorIp" deve ser do tipo String.`,
          'string.ip': `"originatorIp" deve possuir um IP válido`
        }),
      metadata: Joi.when('type', [
        {
          is: 'create:user',
          then: Joi.object({
            id: Joi.string().required()
          })
        }
      ])
    });
  }
};

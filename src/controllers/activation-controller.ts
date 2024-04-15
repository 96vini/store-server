import { FastifyRequestWithLocals } from '@/middlewares/injectRequestMetadata';
import authorization from '@/modules/authorization';
import ActivationService from '@/services/activation-service';
import { FastifyReply } from 'fastify';

export default class UserController {
  readonly activationService: ActivationService;

  constructor(activationService: ActivationService) {
    this.activationService = activationService;
  }

  async activate(req: FastifyRequestWithLocals, reply: FastifyReply) {
    const userTryingToActivate = req.locals.user;
    const insecureInputValues = req.body;

    //TODO: validate input values with the new validation strategy
    const secureInputValues = authorization.filterInput(
      userTryingToActivate,
      'read:activation_token',
      insecureInputValues
    );

    const tokenObject = await this.activationService.activateUserUsingTokenId(
      secureInputValues.tokenId
    );

    const authorizedValuesToReturn = authorization.filterOutput(
      userTryingToActivate,
      'read:activation_token',
      tokenObject
    );

    return reply.status(200).send(authorizedValuesToReturn);
  }
}

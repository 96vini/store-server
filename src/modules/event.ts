import validator from './validator';
import { Event } from '@/models/event';

async function create(object) {
  object = validateObject(object);

  const newEvent = new Event({
    type: object.type,
    originatorUserId: object.originatorUserId,
    originatorIp: object.originatorIp,
    metadata: object.metadata
  });

  const savedEvent = await newEvent.save();

  return savedEvent;
}

function validateObject(object) {
  const cleanObject = validator(object, {
    event: 'required'
  });

  return cleanObject;
}

export default Object.freeze({
  create
});

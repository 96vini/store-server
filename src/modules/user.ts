const createAnonymous = () => {
  return {
    features: ['read:activation_token', 'create:session', 'create:user']
  };
};

export default Object.freeze({
  createAnonymous
});

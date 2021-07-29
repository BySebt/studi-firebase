export const isEmail = (email) => {
  const emailRegEx = /\S+@\S+\.\S+/;
  return !!email.match(emailRegEx);
};

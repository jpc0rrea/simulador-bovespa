const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let errors = {};

  // Conferindo se o usuário escreveu algo no e-mail, senha e confirmação de senha
  if (isEmpty(data.email)) {
    errors.email = "Campo 'e-mail' não pode estar vazio";
  } else if (!isEmail(data.email)) {
    errors.email = "E-mail inválido";
  }

  if (isEmpty(data.password)) {
    errors.password = "Campo 'senha' não pode estar vazio";
  }

  if (isEmpty(data.name)) {
    errors.name = "Campo 'nome' não pode estar vazio";
  }

  if (isEmpty(data.lastName)) {
    errors.lastName = "Campo 'lastNome' não pode estar vazio";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Senhas devem ser iguais.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Campo 'e-mail' não pode estar vazio";
  if (isEmpty(data.password))
    errors.password = "Campo 'senha' não pode estar vazio";
  if (!isEmail(data.email)) {
    errors.email = "E-mail inválido";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

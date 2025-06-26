let globalNavigate = null;

export const setNavigate = (nav) => {
  if (globalNavigate === null) globalNavigate = nav;
};

export const navigate = (...args) => {
  if (globalNavigate) globalNavigate(...args);
};

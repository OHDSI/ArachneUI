type Vocabulary = {
  label: string;
  value: number | string;
};

type User = {
  id: number;
  name: string;
};

type License = {
  user: User;
  vocabularies: Array<Vocabulary>;
};

export {
  License,
  Vocabulary,
  User,
};

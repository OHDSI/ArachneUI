type VocabularyOption = {
  label: string;
  value: number | string;
};

type Vocabulary = {
  id: number;
  name: string;
  licenseId: number;
};

type User = {
  id: number;
  name: string;
};

type License = {
  user: User;
  vocabularies: Array<VocabularyOption>;
  pendingCount: number;
};

export {
  License,
  VocabularyOption,
  User,
  Vocabulary,
};

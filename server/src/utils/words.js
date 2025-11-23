export const WORDS = {
  easy: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
    "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
    "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
    "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me"
  ],
  medium: [
    "program", "syntax", "compile", "execute", "variable", "function", "object",
    "string", "number", "boolean", "array", "method", "class", "import",
    "export", "module", "package", "server", "client", "browser", "database",
    "query", "request", "response", "header", "status", "error", "debug",
    "deploy", "build", "render", "component", "state", "props", "hook"
  ],
  hard: [
    "asynchronous", "synchronous", "polymorphism", "inheritance", "encapsulation",
    "abstraction", "middleware", "authentication", "authorization", "cryptography",
    "virtualization", "containerization", "orchestration", "microservices",
    "architecture", "infrastructure", "scalability", "availability", "reliability",
    "maintainability", "extensibility", "interoperability", "compatibility",
    "implementation", "specification", "documentation", "configuration", "optimization"
  ]
};

export const getRandomWords = (difficulty, count = 50) => {
  const wordList = WORDS[difficulty] || WORDS.easy;
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    result.push(wordList[randomIndex]);
  }
  return result.join(" ");
};

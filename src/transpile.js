const babelOptions = {
  presets: [ "react", ["es2015", { "modules": false }]]
}

export default function preprocess(str) {
  const { code, ast } = Babel.transform(str, babelOptions);

  return code;
}
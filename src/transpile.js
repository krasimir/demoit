const OPTIONS = {
  presets: [
    'react',
    ['es2015',
      { 'modules': false }
    ]
  ],
  plugins: [
    'transform-es2015-modules-commonjs'
  ]
};

export default function preprocess(str) {
  const { code } = Babel.transform(str, OPTIONS);

  return code;
}
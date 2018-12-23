const OPTIONS = {
  presets: [
    'react',
    ['es2015',
      { 'modules': false }
    ],
    'es2016',
    'es2017',
    'stage-0',
    'stage-1',
    'stage-2',
    'stage-3'
  ],
  plugins: [
    'transform-es2015-modules-commonjs'
  ]
};

export default function preprocess(str) {
  const { code } = Babel.transform(str, OPTIONS);

  return code;
}
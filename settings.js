function settings() {
    return {
      editor: {
        theme: 'material', // dark: material, light: neat
        fontSize: '20px',
        lineHeight: '28px'
      },
      output: {
        backgroundColor: '#c7e2e5',
        fontSize: '16px',
        lineHeight: '22px'
      },
      resources: [
        './resources/babel-6.26.0.js',
        './resources/babel-polyfill@6.26.0.js',
        './resources/react-16.7.0-alpha.0.js'
      ],
      demos: [
        {
          frames: [
            { name: 'initial', path: './demos/01/init.js' }
          ]
        }
      ],
      transform(code) {
        console.log(Babel.transform(code, { presets: ["react", "es2015"] }).code);
      }
    }
}
function settings() {
    return {
      editor: {
        theme: 'material', // dark: material, light: neat
        fontSize: '20px',
        lineHeight: '28px',
        changeDebounceTime: 800
      },
      output: {
        backgroundColor: '#c7e2e5',
        fontSize: '16px',
        lineHeight: '22px'
      },
      resources: [
        './resources/babel-6.26.0.js',
        './resources/babel-polyfill@6.26.0.js',
        './resources/react-16.7.0-alpha.0.js',
        './resources/react-dom.16.7.0-alpha.0.js'
      ],
      demos: [
        {
          frames: [
            { name: 'FaCC 01', path: './demos/01/init.js' },
            { name: 'FaCC 02', path: './demos/01/second.js' }
          ],
          transform: babelToReact
        },
        {
          frames: [
            { name: 'A', path: './demos/01/second.js' }
          ],
          transform: babelToConsole
        }
      ]
    }
}
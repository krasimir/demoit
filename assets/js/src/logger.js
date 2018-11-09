export default function logger() {
  (function(){
      const originalError = console.error;
      const originalLog = console.log;
      const originalWarning = console.warn;
      const originalInfo = console.info;

      console.error = function (error) {
        // console.log('Ops, error');
        originalError.apply(console, arguments);
      };
  })();
}
import transpile from './transpile';

export default function executeCode(code) {
  try {
    (new Function(transpile(code)))();
  } catch (error) {
    console.error(error);
  }
}

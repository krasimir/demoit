import { addStyleString, el } from './utils';

export const createOutput = function(settings) {
  addStyleString(`
    .output {
      background-color: ${ settings.output.backgroundColor };
      font-size: ${ settings.output.fontSize };
      line-height: ${ settings.output.lineHeight };
    }
  `);

  return el('.output');
}
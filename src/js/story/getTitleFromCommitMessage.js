import { truncate } from '../utils';
import cleanUpMarkdown from '../utils/cleanUpMarkdown';

export default function getTitleFromCommitMessage(text) {
  return cleanUpMarkdown(truncate(text.split('\n').shift(), 36));
};

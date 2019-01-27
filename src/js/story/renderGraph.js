/* eslint-disable no-use-before-define, max-len */

import { connectCommits, empty as emptySVGGraph } from '../utils/svg';
import el from '../utils/element';
import { DEBUG } from '../constants';

const SVG_X = 4;
const SVG_INITIAL_Y = 25;

export default function renderGraph(sortedCommits, tree) {
  setTimeout(() => {
    emptySVGGraph();

    DEBUG && console.log(JSON.stringify(sortedCommits.map(({ hash, position }) => ({ hash, position })), null, 2));

    const { connections, commitsYs } = renderCommitGraphs(getYValueOfCommitElement(sortedCommits[0].hash), tree);

    connections.forEach(([ hashA, hashB ]) => connectCommits(SVG_X, SVG_INITIAL_Y + commitsYs[hashA], SVG_INITIAL_Y + commitsYs[hashB]));
  }, 30);
}
function renderCommitGraphs(rootY, { parent, hash, derivatives }, result = { commitsYs: {}, connections: [] }) {
  result.commitsYs[hash] = getYValueOfCommitElement(hash) - rootY;
  if (parent !== null) {
    result.connections.push([ parent, hash ]);
  }
  if (derivatives.length > 0) {
    derivatives.forEach(commit => renderCommitGraphs(rootY, commit, result));
  }
  return result;
}
function getYValueOfCommitElement(hash) {
  if (el.exists('#c' + hash)) {
    return el('#c' + hash).e.getBoundingClientRect().top + 0.3;
  }
  return 0;
}

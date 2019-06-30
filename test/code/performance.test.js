const { expect } = require('chai');
const vega = require('vega');
const fs = require('fs');
// @ts-ignore
const spec = require('./constants/line-example');

const renderDiffs = (results, path) => {
  const diffs = results.map((actualVal, idx) => ({ x: idx, y: actualVal - idx, c: 1 }));
    const parsed = vega.parse(
      Object.assign({}, spec, {
        data: {
          name: 'table',
          values: diffs
        }
      })
    );
    const view = new vega.View(parsed, { renderer: 'none' });
    // generate a static SVG image
    view
      .toSVG()
      .then(svg => {
        fs.writeFileSync(path, svg);
        // process svg string
      })
      .catch(err => {
        console.error(err);
      });
}

module.exports = {
  target: 'performance_tester',
  *testSend(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'send' } });
    const { outlet0 } = yield;
    renderDiffs(Object.values(outlet0), `${__dirname}/../../output/send-performance.svg`);
  },
  *testUdp(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'udp' } });
    const { outlet0 } = yield;
    renderDiffs(Object.values(outlet0), `${__dirname}/../../output/udp-performance.svg`);
  },
  *testNode(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'node' } });
    const { outlet0 } = yield;
    renderDiffs(Object.values(outlet0), `${__dirname}/../../output/node-performance.svg`);
  },
  *testJs(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'js' } });
    const { outlet0 } = yield;
    renderDiffs(Object.values(outlet0), `${__dirname}/../../output/js-performance.svg`);
  },
  *testMidi(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'midi' } });
    const { outlet0 } = yield;
    renderDiffs(Object.values(outlet0), `${__dirname}/../../output/midi-performance.svg`);
  }
};

const fs = require('fs-extra');
const moment = require('moment');
const ss = require('simple-statistics');
const { validate, renderLatencies } = require('./utils');

const exportDir = `${__dirname}/../../output/${moment().format(
  'YYYYMMDD_hhmmss'
)}`;
fs.ensureDirSync(exportDir);
const results = {};

module.exports = {
  target: 'performance_tester',
  *testSend(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'send' } });
    const { outlet0 } = yield;
    const elapsedTimes = Object.values(outlet0);
    validate(elapsedTimes);
    results.send = elapsedTimes;
    renderLatencies(elapsedTimes, `${exportDir}/send-performance.svg`);
  },
  *testUdp(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'udp' } });
    const { outlet0 } = yield;
    const elapsedTimes = Object.values(outlet0);
    validate(elapsedTimes);
    results.udp = elapsedTimes;
    renderLatencies(elapsedTimes, `${exportDir}/udp-performance.svg`);
  },
  *testNode(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'node' } });
    const { outlet0 } = yield;
    const elapsedTimes = Object.values(outlet0);
    validate(elapsedTimes);
    results.node = elapsedTimes;
    renderLatencies(elapsedTimes, `${exportDir}/node-performance.svg`);
  },
  *testJs(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'js' } });
    const { outlet0 } = yield;
    const elapsedTimes = Object.values(outlet0);
    validate(elapsedTimes);
    results.js = elapsedTimes;
    renderLatencies(elapsedTimes, `${exportDir}/js-performance.svg`);
  },
  *testMidi(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'midi' } });
    const { outlet0 } = yield;
    const elapsedTimes = Object.values(outlet0);
    validate(elapsedTimes);
    results.midi = elapsedTimes;
    renderLatencies(elapsedTimes, `${exportDir}/midi-performance.svg`);
  },
  *testJweb(maxAPI) {
    maxAPI.outlet({ performance_tester: { inlet0: 'jweb' } });
    const { outlet0 } = yield;
    const elapsedTimes = Object.values(outlet0);
    validate(elapsedTimes);
    results.jweb = elapsedTimes;
    renderLatencies(elapsedTimes, `${exportDir}/jweb-performance.svg`);
  },
  *testCollectScores(_) {
    const scores = Object.keys(results).reduce((acc, objectName) => {
      const elapsedTimes = results[objectName];
      const latencies = elapsedTimes.map((actualTime, idx) => actualTime - idx);
      return [
        ...acc, 
        {
          object: objectName, 
          max: ss.max(latencies),
          mean: ss.mean(latencies),
          sd:  ss.standardDeviation(latencies)
        }
      ];
    }, []);
    fs.writeJsonSync(`${exportDir}/scores.json`, scores);
    return;
  }
};

const vega = require('vega');
const { expect } = require('chai');
// @ts-ignore
const spec = require('./constants/line-example');
const fs = require('fs-extra');

const validate = (elapsedTimes) => {
  expect(elapsedTimes).to.have.lengthOf(1000);
  elapsedTimes.forEach(time => expect(isNaN(time)).to.be.false);
  expect(elapsedTimes).not.to.include(null);
}

const renderLatencies = (elapsedTimes, path) => {
  const latencies = elapsedTimes.map((actualVal, idx) => ({ x: idx, y: actualVal - idx, c: 1 }));
    const parsed = vega.parse(
      Object.assign({}, spec, {
        data: {
          name: 'table',
          values: latencies
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
  validate,
  renderLatencies
}
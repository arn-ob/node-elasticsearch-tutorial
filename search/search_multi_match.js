(function () {
  'use strict';

  const esClient = require('../engine')

  const search = function search(index, body) {
    return esClient.search({index: index, body: body});
  };

  // only for testing purposes
  // all calls should be initiated through the module
  const test = function test() {
    let body = {
      size: 20,
      from: 0,
      query: {
        multi_match: {
          query: 'Bradford',
          fields: ['title', 'authors.*name'],
          minimum_should_match: 3,
          fuzziness: 2
        }
      }
    };

    console.log(`retrieving documents whose title or authors match '${body.query.multi_match.query}' (displaying ${body.size} items at a time)...`);
    search('library', body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      if (results.hits.total > 0) console.log(`returned article titles:`);
      results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.title} (score: ${hit._score})`));
    })
    .catch(console.error);
  };

  test();

  module.exports = {
    search
  };
} ());

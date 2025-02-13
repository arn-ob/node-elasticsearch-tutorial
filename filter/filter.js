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
        bool: {
          must: [
            {
              query_string: {
                query: '(authors.firstname:D* OR authors.lastname:H*) AND (title:excepteur)'
              }
            }
          ],
          should: [
            {
              match: {
                body: {
                  query: 'Elit nisi fugiat dolore amet',
                  type: 'phrase'
                }
              }
            }
          ],
          must_not: [
            {
              range: {
                year: {
                  lte: 2000,
                  gte: 1990
                }
              }
            }
          ],
          filter: [
            {
              range: {
                year: {
                  gte: 2011,
                  lte: 2015
                }
              }
            }
          ]
        }
      }
    };

    console.log(`retrieving documents with a combined bool query and filter (displaying ${body.size} items at a time)...`);
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

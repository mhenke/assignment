'use strict';

describe('Giphders E2E Tests:', function () {
  describe('Test giphders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/giphders');
      expect(element.all(by.repeater('giphder in giphders')).count()).toEqual(0);
    });
  });
});

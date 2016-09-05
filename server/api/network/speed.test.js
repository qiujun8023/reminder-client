'use strict';

const ENDPOINT = '/api/network/speed';

describe(ENDPOINT, function () {
  describe('post', function () {
    it('should request failure with invalid url', function* () {
      yield api.post(ENDPOINT)
        .send({
          url: 'invalid url',
        })
        .expect(502);
    });

    it('should request success', function* () {
      yield api.post(ENDPOINT)
        .send({
          url: 'https://www.baidu.com',
        })
        .expect(200);
    });
  });
});

const MysqlHelper = require('./MysqlHelper');

describe('Testing UserRepository', () => {

  test('Shoult create one single instance', async () => {
    const helper1 = MysqlHelper.create();
    const helper2 = MysqlHelper.create();

    expect(helper1 === helper2).toBeTruthy();
  });
});

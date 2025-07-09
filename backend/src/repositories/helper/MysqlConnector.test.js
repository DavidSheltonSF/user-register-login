const MysqlConnector = require('./MysqlConnector');

describe('Testing UserRepository', () => {

  test('Shoult create one single instance', async () => {
    const helper1 = MysqlConnector.create();
    const helper2 = MysqlConnector.create();

    expect(helper1 === helper2).toBeTruthy();
  });
});

const MysqlConnector = require('./MysqlConnector');

describe('Testing UserRepository', () => {

  test('Shoult create one single instance', async () => {
    const helper1 = MysqlConnector.getInstance();
    const helper2 = MysqlConnector.getInstance();

    expect(helper1 === helper2).toBeTruthy();
  });
});

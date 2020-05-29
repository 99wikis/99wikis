/* eslint no-await-in-loop: 0  */
const AWS = require('aws-sdk');
const config = require('./config');

class DynamoContext {
  constructor(tableName) {
    if (config.updateAwsConfig === "true") AWS.config.update(config.aws);
    this.dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.tableName = tableName;
  }

  /**
   * Add an item to DocumentDb
   * @param {*} obj - Object to input
   */
  async put(obj) {
    const query = {
      TableName: this.tableName,
      Item: obj,
    };

    return this.docClient.put(query).promise();
  }

  /**
   * Add multiple items to DocumentDb
   * @param {*} objs - Objects to input
   */
  async batchPut(objs) {
    const query = {
      RequestItems: { },
    };
    query.RequestItems[this.tableName] = [];

    objs.forEach(item => {
      query.RequestItems[this.tableName].push({
        PutRequest: {
          Item: item,
        },
      });
    });

    return this.docClient.batchWrite(query).promise();
  }

  /**
   * Get itens from DocumentDb
   * @param {*} params
   */
  async get(params) {
    const query = {
      TableName: this.tableName,
      Key: params,
    };

    return this.docClient.get(query).promise();
  }

  /**
   * Scan itens from DocumentDb
   * @param {*} params
   */
  async scan(params) {
    const query = {
      TableName: this.tableName,
      ...params
    };

    const scanResults = [];
    let scan;
    do {
      scan = await this.docClient.scan(query).promise();
      scanResults.push(...scan.Items);
      query.ExclusiveStartKey = scan.LastEvaluatedKey;
    } while (typeof scan.LastEvaluatedKey !== 'undefined');

    return scanResults;
  }

  /**
   * Query itens from DocumentDb
   * @param {*} keyConditionExpression
   * @param {*} expressionAttributeValues
   */
  async query(keyConditionExpression, expressionAttributeValues) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    }
  
    return this.dynamodb.query(params).promise();
  }

  /**
   * Delete item from DocumentDb
   * @param {*} params
   */
  async delete(params) {
    const query = {
      TableName: this.tableName,
      Key: params,
    };

    return this.docClient.delete(query).promise();
  }

  /**
   * Batch delete itens from DocumentDb
   * @param {*} params
   */
  async batchDelete(params) {
    const query = {
      RequestItems: {},
    };

    const deleteParams = params.map(param => ({
      DeleteRequest: {
        Key: param,
      },
    }));

    query.RequestItems[this.tableName] = deleteParams;

    return this.docClient.batchWrite(query).promise();
  }

  /**
   * Returns wheter or not a table is empty
   * @param {*} params
   */
  async isTableEmpty() {
    const query = { TableName: this.tableName };

    const scan = await this.docClient.scan(query).promise();

    return !scan.Items || scan.Items.length < 1;
  }
}

module.exports = DynamoContext;

export const environment = {
  production: true,
  demo: false,
  appkey: 'b11e7c189b',
  pusherKey: '255f010d210933ca7675',
  env: 'sandbox',
  APIEndpoint: 'https://sandbox-cutie.api.practera.com/',
  APIEndpointOld: 'https://sandbox.practera.com/',
  Practera: 'https://sandbox.practera.com',
  graphQL: 'https://kixs5acl6j.execute-api.ap-southeast-2.amazonaws.com/sandbox/',
  filestack: {
    key: 'AO6F4C72uTPGRywaEijdLz',
    s3Config: {
      location: 's3',
      container: 'practera-aus',
      containerChina: 'practera-kr',
      region: 'ap-southeast-2',
      regionChina: 'ap-northeast-2',
      paths: {
        any: '/appv2/stage/uploads/',
        image: '/appv2/stage/uploads/',
        video: '/appv2/stage/video/upload/'
      },
      workflows: [
        '3c38ef53-a9d0-4aa4-9234-617d9f03c0de',
      ],
    },
    policy: '<CUSTOM_FILESTACK_POLICY>',
    signature: '<CUSTOM_FILESTACK_SIGNATURE>',
    workflows: {
      virusDetection: '3c38ef53-a9d0-4aa4-9234-617d9f03c0de',
    },
  }
};

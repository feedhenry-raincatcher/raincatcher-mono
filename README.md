# FeedHenry RainCatcher file [![Build Status](https://travis-ci.org/feedhenry-raincatcher/raincatcher-file.png)](https://travis-ci.org/feedhenry-raincatcher/raincatcher-file)

A module for FeedHenry RainCatcher that manages files. It provides :
- Backend services that expose REST endpoints to create and read operations for files .
- Services providing a REST client for files.

See raincatcher-file-angular module for angular client side implementation

## Client-side usage

This module is packaged in a CommonJS format, exporting the name of the Angular namespace.
The module can be included in an angular.js as follows:

```javascript
var fileCore = require('fh-wfm-file/lib/client');
fileCore(mediator,{},$fh);
```

### Topic Subscriptions

#### wfm:files:create

##### Description

Creating a new File

##### Example


```javascript
var parameters = {
  fileToCreate: {
    //A Valid JSON Object
  },
  //Optional topic unique identifier.
  topicUid: "uniquetopicid"
}

mediator.publish("wfm:files:create", parameters);
```

#### wfm:files:list
##### Description

List All files

##### Example

```javascript
var parameters = {
  userId : "userId"
  //Optional topic unique identifier.
  topicUid: "uniquetopicid"
}

mediator.publish("wfm:files:list", parameters);
```


## Usage in an express backend

The server-side component of this WFM module exports a function that takes express and mediator instances as parameters, as in:

```javascript
var express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , mediator = require('fh-wfm-mediator/lib/mediator')
  ;

// configure the express app
...

// setup the wfm user router
require('fh-wfm-file/lib/cloud')(mediator, app);

```

### Exposed endpoints

Base url : `/file/wfm`

| resource | method | returns |
| -------- | ------ | ------- |
| /all | GET | array of files |
| /owner/:owner | GET | filtered array of files |
| /owner/:owner/upload/base64/:filename | POST | file metadata |
| /upload/binary | POST | file metadata  |


#### File metadata structure

```
   {
      owner: req.params.owner,
      name: req.params.filename,
      uid: uuid.create().toString()
   }

```

## Supported storage engines

By default file module would store files in filesystem temporary folder.

### AWS S3 storage

Allows to store files in AWS S3 buckets.

Options:

```
var storageConfig = {
  s3: {
    s3Options: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
      region: process.env.AWS_S3_REGION
    },
    bucket: "raincatcher-files"
  }
}
require('fh-wfm-file/lib/cloud')(mediator, storageConfig);
```

### Gridfs MongoDB storage

Allows to store file in MongoDB database using Gridfs driver

Options:
```
var storageConfig = {
  gridFs: {
    mongoUrl: "mongodb://localhost:27017/files"
  }
};
require('fh-wfm-file/lib/cloud')(mediator, storageConfig);
```

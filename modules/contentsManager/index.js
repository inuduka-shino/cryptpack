/* contentsManager.js */
/*eslint-env node,  *
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const
        jsonFile = require('../jsonFile'),
        objectSaver = require('../objectSaver'),
        manager = require('./manager');

  return function (info) {
    // check info member
    [
      'contentsIdBase',
      'jsonFilePath',
      'destFileFolderPath',
    ].forEach((pName)=>{
      if (typeof info[pName] === 'undefined') {
        throw new Error(`parameterObject must has ${pName} in contentsManager:index.js`);
      }
    });

    const cntxt = {
          contentsIdBase: info.contentsIdBase,
          destFileFolderPath: info.destFileFolderPath,
          saver: null,
          // mapping from json filePath
          counter: null,
          contentsInfo: null,
          clientContentMap: null,
        };

    cntxt.saver = objectSaver({
        objInfo:cntxt,
        saver: jsonFile(info.jsonFilePath),
        propList:  [
          'counter',
          'contentsInfo',
          'clientContentMap',
        ],
        initSaveData:{
          //
          title:'contents map',
          // for countns id
          counter: 0,
          contentsInfo: {},
          // {contentsID: {
          //   clientId: '....',
          //   catgory: '....',
          //   title: '....',
          //   sourcePath: '....',
          //   destPath: '....',
          // }, ...}
          clientContentMap: {},
          // {
          //   clientId: {
          //       contentsList: [contentsID, ....]
          //       indexContentsIndex: index of contentsList for indexContentsID
          //   }
        },
      });

    return {
      [Symbol.for('debug')]: {
        cntxt,
      },
      init:  manager.init.bind(null, cntxt),
      genDocInfo: manager.genDocInfo,
      client: manager.client.bind(null, cntxt),
      // by client control
      //  add(docInfo) return contentsId
      //  deleteContents(ContentsID),
      //  regist()  indexcontents生成 & json save
    };
  };

});

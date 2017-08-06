/* regClient main.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require)=>{
  const maquette = require('maquette'),
        domUtil = require('../domUtil'),
        partsBody = require('./partsBody');

  const projector=maquette.createProjector();

  partsBody.setEnv(
    {
      scheduleRender: projector.scheduleRender,
      smartphone: domUtil.deviceType()==='mobile',
    }
  );

  domUtil.checkLoadedDocument().then(() => {
      projector.replace(
        document.body,
        partsBody.render
      );
  });
});

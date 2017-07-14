/* mdls.js */
/*eslint-env browser */
/*eslint no-console: off */

//eslint-disable-next-line no-unused-vars
const mdls = (()=>{
  const moduleSpace = {};

  function mdls(mdlName, mdlDefFunc) {
    moduleSpace[mdlName] = mdlDefFunc(moduleSpace);
  }

  return mdls;
})();

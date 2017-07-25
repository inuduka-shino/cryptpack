/* testsb.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


define((require)=>{
  const maquette = require('maquette'),
        domUtil = require('domUtil');

  const h=maquette.h,
        projector=maquette.createProjector();

  function genCounter() {
    let counter = 0;

    return function () {
      const c = counter;
      counter += 1;
      return c;
    };
 }

 function genHDiv() {
   const key = genCounter();

   return function (subH) {
     return h(
       'div',
       {
         key: key()
       },
       subH
     );
   };
 }

  const bodypart = (()=>{
    let message = 'message area';

    function clickHandler(event) {
      event.preventDefault();
      message='click!';
    }
    function inputHandler(event) {
      message=event.target.value;
    }

     function render() {
       const hDiv=genHDiv();

       return h('body', [
         h('h3', 'クライアント登録'),
         hDiv(message),
         hDiv(h(
           'button',
           {
             class: 'btn',
             onclick: clickHandler,
           },
           'push'
          )),
          hDiv(h(
            'input',
            {
             oninput: inputHandler
           }
         )),
       ]);
     }

    return {
      render
    };

  })();

  domUtil.checkLoadedDocument().then(
    () => {
      projector.replace(
        document.body,
        bodypart.render
      );
    }
  );

});

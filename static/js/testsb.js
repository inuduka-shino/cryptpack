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
         key: key(),
         class: 'row',
       },
       subH
     );
   };
 }

  function inputParts (label, submitHandler) {
    let hInput=null;

    function submitHandler0() {
      try {
        const value=hInput.domNode.value;
        submitHandler(value);
      } catch (e) {
        console.log(e.stack);
      }
      return false;
    }

    function render() {
      hInput = h('input',{
          class: 'form-control',
          typep: 'text',
          // oninput: inputHandler
        });
      return h(
      'form',{
        class: 'col xs-11',
        onsubmit: submitHandler0
      },
      [
        h('label', label),
        hInput
      ]
      );
    }
    return {
      render
    };
  }
  const bodypart = (()=>{
    let message = 'message area',
        userID = null;

    function clickHandler(event) {
      event.preventDefault();
      message='click!';
    }
    const pURLInput = inputParts('cx URL', (inputVal)=>{
      message=inputVal;
    });
    const pUserIdInput = inputParts('userID', (inputVal)=>{
      userID = inputVal;
      message = `userid:${userID}`;
    });

     function render() {
       const hDiv=genHDiv();

       return h('body', [
         h('h3', 'クライアント登録'),
         hDiv(h('div', {
           class: 'col xs-12'
         }, message)),
         hDiv(pURLInput.render()),
         hDiv(pUserIdInput.render()),
         hDiv(h(
           'button',
           {
             class: 'btn col xs-1',
             onclick: clickHandler,
           },
           'push'
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

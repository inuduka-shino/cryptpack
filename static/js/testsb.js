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

 function buttonParts(label, handler) {
   function clickHandler(event) {
     event.preventDefault();
     handler();
   }

   function render() {
     return h('div',{
       class: 'col xs-12',
     }, h(
       'button',
       {
         style: 'margin-top: 7px;',
         class: 'btn btn-sm',
         onclick: clickHandler,
       },
       label
     ));
   }
   return {
     render,
   };
 }

   function messageParts() {
     let message = 'ready..',
        colorClass = 'light';

    function set(msg) {
      if (msg === '' || msg === null || typeof msg === 'undefined') {
        message = 'ready..';
        colorClass = 'light';
      } else {
        message = msg;
        colorClass = 'main';
      }
    }

     function render() {
       return h('div', {
         classes: {
           'col': true,
           'color-light': colorClass === 'light',
         }
       }, message);
     }
     return {
       set,
       render
     };
   }
  function inputParts (label, submitHandler) {
    let hInput=null;

    function val() {
        return hInput.domNode.value;
    }

    function submitHandler0() {
      try {
        const value=val();
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
        class: 'col xs-12',
        onsubmit: submitHandler0
      },
      [
        h('label', {
          class: 'input-label'
        }, label),
        hInput
      ]
      );
    }
    return {
      render,
      val
    };
  }
  const bodypart = (()=>{
    let
        userID = null;
    const pMessage = messageParts();
    //pMessage.set();

    const pURLInput = inputParts('cx URL', (inputVal)=>{
      pMessage.set(inputVal);
    });
    const pUserIdInput = inputParts('userID', (inputVal)=>{
      userID = inputVal;
      pMessage.set(`userid:${userID}`);
    });
    const pButton = buttonParts('set', () =>{
      pMessage.set('Click!');
    });

    const pRegClientButton = buttonParts('クライアント登録', () =>{
      pMessage.set('クライアント登録');
    });

     function render() {
       const hDiv=genHDiv();

       return h('body', [
         h('h3', 'クライアント登録'),
         hDiv(pMessage.render()),
         hDiv(pURLInput.render()),
         hDiv(pUserIdInput.render()),
         hDiv(pButton.render()),
         hDiv(pRegClientButton.render()),
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

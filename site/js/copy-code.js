/* ==========================================================================
   copy-code.js — Copy-to-clipboard for code blocks
   Each code block has a .copy-btn injected by the build script.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('pre .copy-btn');

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        var pre = btn.closest('pre');
        if (!pre) return;

        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;

        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          // Fallback for older browsers
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.textContent = 'Copy';
              btn.classList.remove('copied');
            }, 2000);
          } catch (err) {
            btn.textContent = 'Failed';
            setTimeout(function () {
              btn.textContent = 'Copy';
            }, 2000);
          }
          document.body.removeChild(textarea);
        });
      });
    });
  });

})();

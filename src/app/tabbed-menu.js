var $ = require('jquery')
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var styleGuide = require('./style-guide')
var styles = styleGuide()

module.exports = tabbedMenu

function tabbedMenu (compiler, loadingSpinner, self) {

  var css = csjs`
    .loadingMsg extends ${styles.warningTextBox} {
      display: block;
    }
  `

  $('#options li').click(function (ev) {
    var $el = $(this)
    selectTab($el)
  })

  // initialize tabbed menu
  selectTab($('#options .envView'))

  function cb (finish) {
    compiler.event.register('compilerLoaded', finish)
  }
  // add event listeners for loading spinner
  compiler.event.register('loadingCompiler', function compilationStarted () {
    var contractTab = document.querySelector('.envView')
    if (!contractTab.children.length) {
      var el = document.querySelector('[class^=contractTabView]')
      var loadingMsg = yo`<div class=${css.loadingMsg}>Solidity compiler is currently loading. Please wait a moment...</div>`
      el.appendChild(loadingMsg)
    }
    var settingsTab = document.querySelector('.settingsView')
    if (!settingsTab.children.length) {
      settingsTab.appendChild(loadingSpinner(function cb (finish) {
        compiler.event.register('compilerLoaded', finish)
      }))
    }
  })

  // select tab
  function selectTab (el) {
    var match = /[a-z]+View/.exec(el.get(0).className)
    if (!match) return
    var cls = match[0]
    if (!el.hasClass('active')) {
      el.get(0).parentElement.querySelectorAll('li').forEach(function (li) {
        li.classList.remove('active')
      })
      $('#optionViews').attr('class', '').addClass(cls)
      el.addClass('active')
    }
    self.event.trigger('tabChanged', [cls])
  }
}
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('configura o WKWebView no modo móvel sem inset nativo duplicado', () => {
  const config = JSON.parse(read('capacitor.config.json'))

  assert.equal(config.ios.preferredContentMode, 'mobile')
  assert.equal(config.ios.contentInset, 'never')
  assert.equal(config.ios.scrollEnabled, true)
  assert.equal(config.plugins.StatusBar.style, 'LIGHT')
})

test('injeta o viewport e desativa zoom sem remover a rolagem vertical', () => {
  const source = read('native/votalegis-ios.js')
  const native = read('native/AppDelegate.swift')

  assert.match(source, /maximum-scale=1\.0/)
  assert.match(source, /user-scalable=no/)
  assert.match(source, /viewport-fit=cover/)
  assert.match(source, /overflow-y: auto !important/)
  assert.match(source, /new MutationObserver/)
  assert.match(source, /removeAttribute\('autofocus'\)/)
  assert.match(source, /active\.blur\(\)/)
  assert.match(native, /pinchGestureRecognizer\?\.isEnabled = false/)
  assert.match(native, /maximumZoomScale = 1/)
  assert.doesNotMatch(native, /isScrollEnabled = false/)
})

test('protege safe areas e mantém os cards móveis no fluxo', () => {
  const source = read('native/votalegis-ios.js')

  assert.match(source, /safe-area-inset-top/)
  assert.match(source, /safe-area-inset-right/)
  assert.match(source, /safe-area-inset-bottom/)
  assert.match(source, /safe-area-inset-left/)
  assert.match(source, /\.app-header[\s\S]*height: calc\(60px \+ var\(--vl-ios-safe-top\)\)/)
  assert.match(source, /\.app-sidebar[\s\S]*padding-bottom: calc\(7px \+ var\(--vl-ios-safe-bottom\)\)/)
  assert.match(source, /\.placar-pres-top,[\s\S]*position: relative !important/)
  assert.match(source, /\.vote-grid[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/)
  assert.match(source, /orientation: landscape/)
  assert.match(source, /padding-left: calc\(20px \+ var\(--vl-ios-safe-left\)\)/)
})

test('workflow inclui a integração nativa antes do build', () => {
  const workflow = read('.github/workflows/ios.yml')
  const storyboard = read('native/Main.storyboard')

  assert.match(workflow, /cp native\/AppDelegate\.swift ios\/App\/App\/AppDelegate\.swift/)
  assert.match(workflow, /cp native\/Main\.storyboard ios\/App\/App\/Base\.lproj\/Main\.storyboard/)
  assert.match(workflow, /cp native\/votalegis-ios\.js ios\/App\/App\/public\/votalegis-ios\.js/)
  assert.match(storyboard, /customClass="VotaLegisBridgeViewController"/)
})

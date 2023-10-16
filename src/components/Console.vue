<template>
  <div class="console" :id="`terminal-${resourceType}`"></div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
// import { AttachAddon } from 'xterm-addon-attach'
import { createNamespacedHelpers } from 'vuex'

const loadingMapUtils = createNamespacedHelpers('loading')

export default {
  name: 'console',
  data: () => ({
    term: null,
    terminalSocket: null,
    fitAddon: null,
  }),
  props: {
    console: {
      type: Boolean,
      default: false,
    },
    resourceType: {
      type: String,
      default: 'cluster',
    },
    accessPath: {
      type: String,
      default: null,
    },
  },
  async mounted() {
    await this.initTerm()
    this.connectSocket()
    this.consoleInput()
    this.onTerminalResize()
  },
  methods: {
    ...loadingMapUtils.mapMutations(['showLoading', 'closeLoading']),
    connectSocket() {
      try {
        // /ws/pod/exec/1/default/test-deployment-84bc6b85f6-wds64
        this.terminalSocket = new WebSocket(
          `wss://ml.strato.co.kr/interface/ws${this.accessPath}`,
        )

        this.terminalSocket.onopen = event => {
          console.log('[OPEN]', event)
          this.showLoading()
          setTimeout(() => this.onResize(), 500)
          setTimeout(() => {
            this.onResize()
            this.closeLoading()
          }, 1000)
        }

        this.terminalSocket.onmessage = event => {
          if (event && event.data) {
            const result = JSON.parse(event.data)

            if (result && result.op === 'stdout') {
              this.term.writeln(result.data.replace(/\n/g, '\n\r'))
            } else if (this.console) {
              this.term.prompt()
            }
          }
        }
      } catch (e) {
        console.log('[connectSocket]', e)
      }
    },
    initTerm() {
      const terminalContainer = document.getElementById(
        `terminal-${this.resourceType}`,
      )
      this.term = new Terminal()
      this.fitAddon = new FitAddon()
      // eslint-disable-next-line no-underscore-dangle
      this.term._initialized = true
      this.term.loadAddon(this.fitAddon)
      this.term.open(terminalContainer)
      this.fitAddon.fit()
    },
    onResize() {
      console.log(this.fitAddon)
      this.fitAddon.fit()
      // this.term.onResize()
    },
    onTerminalResize() {
      window.addEventListener('resize', this.onResize)
    },
    removeResizeListener() {
      window.removeEventListener('resize', this.onResize)
    },
    sendMessage(command) {
      const message = {
        op: 'stdin',
        data: command,
      }
      return JSON.stringify(message)
    },
    consoleInput() {
      let command = ''

      // console 화면일 경우에만 키보드 이벤트
      if (this.console) {
        this.term.prompt = () => {
          this.term.write('$ ')
        }
        // this.term.writeln('This is a shell emulator')
        this.term.write('')

        // 키보드 입력 처리
        this.term.onData(e => {
          // eslint-disable-next-line no-underscore-dangle
          const colsLen = this.term._core.buffer.x
          // eslint-disable-next-line no-underscore-dangle
          // const rowsLen = this.term._core.buffer.y
          switch (e) {
            case '\u0003': // Ctrl+C
              this.term.write('^C')
              // eslint-disable-next-line no-alert
              break
            case '\r': // Enter
              // this.term.write(`\u001b[${rowsLen + 1};2H \u001b[${colsLen - 2}X`)
              this.term.writeln('')
              this.terminalSocket.send(this.sendMessage(command))
              command = ''
              break
            case '\u007F': // Backspace (DEL)
              // Do not delete the prompt
              // eslint-disable-next-line no-underscore-dangle
              if (colsLen > 2) {
                this.term.write('\b \b')
                if (command.length > 0) {
                  command = command.slice(0, command.length - 1)
                }
              }
              break
            default:
              // Print all other characters for demo
              if (
                (e >= String.fromCharCode(0x20) &&
                  e <= String.fromCharCode(0x7b)) ||
                e >= '\u00a0'
              ) {
                command += e
                this.term.write(e)
                // console.log(e)
              }
          }
        })
      }
    },
    runRealTerminal() {
      console.log('webSocket is finished')
    },
    errorRealTerminal() {
      console.log('error')
    },
    closeRealTerminal() {
      console.log('close')
    },
  },
  beforeDestroy() {
    this.terminalSocket.close()
    this.term.dispose()
    this.removeResizeListener()
  },
}
</script>

<style lang="scss" scoped>
.console {
  width: 100% !important;
  height: 560px !important;
}
</style>

<style lang="scss">
// .terminal {
//   width: 1200px !important;
//   height: 560px !important;
// }
// .terminal.xterm {
//   height: 100%;
//   // font-size: 14px;

//   .xterm-viewport {
//     width: 1180px !important;
//     height: 540px !important;
//   }
//   .xterm-screen {
//     width: 1180px !important;
//     height: 540px !important;

//     .xterm-text-layer,
//     .xterm-selection-layer,
//     .xterm-link-layer,
//     .xterm-cursor-layer {
//       width: 1180px !important;
//       height: 540px !important;
//     }
//   }
// }
</style>

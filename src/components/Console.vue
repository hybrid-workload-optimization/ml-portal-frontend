<template>
  <div class="console" id="terminal"></div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
// import { AttachAddon } from 'xterm-addon-attach'

export default {
  name: 'console',
  data: () => ({
    term: null,
    terminalSocket: null,
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
  },
  methods: {
    connectSocket() {
      try {
        // /ws/pod/exec/1/default/test-deployment-84bc6b85f6-wds64
        this.terminalSocket = new WebSocket(
          `ws://${window.location.host}/comp-b-svc/ws${this.accessPath}`,
        )

        this.terminalSocket.onopen = event => {
          console.log('[OPEN]', event)
        }

        this.terminalSocket.onmessage = event => {
          if (event && event.data) {
            const result = JSON.parse(event.data)

            if (result && result.op === 'stdout') {
              this.term.write(result.data.replace(/\n/g, '\n\r'))
            }
          }
        }
      } catch (e) {
        console.log('[connectSocket]', e)
      }
    },
    initTerm() {
      const terminalContainer = document.getElementById('terminal')
      this.term = new Terminal()
      this.term.open(terminalContainer)
      // eslint-disable-next-line no-underscore-dangle
      this.term._initialized = true
      const fitAddon = new FitAddon()
      this.term.loadAddon(fitAddon)
      fitAddon.fit()
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
        this.term.prompt = () => {}
        // this.term.writeln('This is a shell emulator')

        // 키보드 입력 처리
        this.term.onData(e => {
          // eslint-disable-next-line no-underscore-dangle
          const colsLen = this.term._core.buffer.x
          // eslint-disable-next-line no-underscore-dangle
          const rowsLen = this.term._core.buffer.y
          switch (e) {
            case '\u0003': // Ctrl+C
              this.term.write('^C')
              // eslint-disable-next-line no-alert
              break
            case '\r': // Enter
              this.term.write(`\u001b[${rowsLen + 1};2H \u001b[${colsLen - 2}X`)
              this.terminalSocket.send(this.sendMessage(command))
              command = ''
              break
            case '\u007F': // Backspace (DEL)
              // Do not delete the prompt
              // eslint-disable-next-line no-underscore-dangle
              if (colsLen > 2) {
                this.term.write('\b \b')
                if (command.length > 0) {
                  command = command.substr(0, command.length - 1)
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
                console.log(e)
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
  },
}
</script>

<style lang="scss" scoped>
.console {
  height: 65vh;
}
</style>

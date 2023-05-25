<template>
  <div class="console" id="terminal"></div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
// import { AttachAddon } from 'xterm-addon-attach'
import { createNamespacedHelpers } from 'vuex'

const consoleMapUtils = createNamespacedHelpers('console')
const alertMapUtils = createNamespacedHelpers('alert')

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
    useWebSocket: {
      type: Boolean,
      default: true,
    },
  },
  async mounted() {
    await this.initTerm()
    if (this.consoleText && !this.useWebSocket) {
      this.setConsoleText()
    } else {
      this.connectSocket()
      this.consoleInput()
    }
  },
  computed: {
    ...consoleMapUtils.mapGetters(['consoleText']),
  },
  watch: {
    consoleText(newValue) {
      if (newValue && !this.useWebSocket) this.setConsoleText()
    },
    useWebSocket(newValue) {
      console.log(newValue)
      if (newValue) {
        this.connectSocket()
        this.consoleInput()
      } else {
        this.setConsoleText()
      }
    },
  },
  methods: {
    ...alertMapUtils.mapMutations(['openAlert']), // alert 오픈
    connectSocket() {
      try {
        // /ws/pod/exec/1/default/test-deployment-84bc6b85f6-wds64
        this.terminalSocket = new WebSocket(
          `ws://${window.location.host}/comp-b-svc/ws${this.accessPath}`,
        )

        this.terminalSocket.onopen = event => {
          console.info(event)
        }

        this.terminalSocket.onmessage = event => {
          if (event && event.data) {
            const result = JSON.parse(event.data)
            console.log(result)
            if (result && result.op === 'stdout') {
              this.term.write(result.data)
              this.term.write('\r\n')
            } else if (result && result.op === 'finish') {
              if (result.result === 'success') {
                this.openAlert({
                  title: 'Cluster 배포가 완료되었습니다.',
                  type: 'info',
                })
              } else {
                this.openAlert({
                  title: 'Cluster 배포를 실패하였습니다.',
                  type: 'error',
                })
              }
              this.closeRealTerminal()
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
    setConsoleText() {
      this.term.write(this.consoleText.replace(/\n/g, '\n\r'))
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
      if (this.console && this.useWebSocket) {
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
      setTimeout(() => {
        this.$router.push(`/cluster/detail/${this.$route.params.id}`)
      }, 1000)
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

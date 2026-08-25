// CSVパース用の関数をCDN経由で読み込み
import { parseCSV2 } from "https://cdn.jsdelivr.net/gh/Nitro2031/Utilities@1.1.1/csvParser.min.js?v=20250927"
import { prefersColorScheme } from "./prefers-color-scheme.js";
const { createApp, ref, onMounted, onBeforeUnmount, computed } = Vue
const { createVuetify, useTheme } = Vuetify

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: { light: { dark: false }, dark: { dark: true } },
  },
  icons: { defaultSet: 'mdi' }
})

const AppFilePath = './index.vue'

/** メインアプリケーションの作成とマウント
 * - index.vue をフェッチしてテンプレートとして使用
 */
fetch(AppFilePath, {
  headers: {
    "Content-Type": "text/x-vue",
  },
})
  .then(r => r.text())
  .then(xml => {
    /* template部分を抽出しないといけないので、タグを削除する
 * index.vue の中身をそのまま使うわけにはいかない
 * index.vue は template タグで囲まれていないとVueファイルと認識されないため
 */
    const template = xml.replace('<template>', '').replace('</template>', '');
    const app = createApp({
      template: template,
      components: {
      },
      setup() {
        const title = ref('自動車分類番号一覧')
        const URL = ref('https://github.com/Nitro2031/VehicleClassificationNumber')

        const loading = ref(true)       // ローディング状態を管理
        const items = ref([])           // アイテムリスト
        const selectedCategory = ref([])

        const margin = 104              // マージン調整用の値
        const tableHeight = ref(window.innerHeight - margin)

        const theme = useTheme()        // テーマ切替用

        /**
         * テーマ切替
         */
        const toggleTheme = () => {
          const toggleThemes = { light: 'dark', dark: 'light' };
          theme.global.name.value = toggleThemes[theme.global.name.value];
        }

        /**
         * 初期化
         */
        onMounted(async () => {
          prefersColorScheme(theme);

          // ウィンドウリサイズ時のイベントリスナーを登録
          window.addEventListener('resize', () => {
            tableHeight.value = window.innerHeight - margin;
          });

          try {
            const csvText = await fetch(`./${title.value}.csv`).then(r => r.text())
            // CSVパース関数
            const result = parseCSV2(csvText)
            // IDを自動付与
            result.items.forEach((item, index) => {
              item.id = index + 1;
            });
            items.value = result.items
          } catch (error) {
            console.error('CSV読み込みエラー:', error)
          }
          loading.value = false       // ローディング終了
        })

        onBeforeUnmount(() => {
          window.removeEventListener('resize', resizeHandler)
        })

        return {
          title,
          URL,
          loading,
          items,
          selectedCategory,
          tableHeight,
          toggleTheme,
          theme,
        }
      },
    })

    app.use(vuetify)
    app.mount('#app')
  })
  .catch(err => {
    console.error(AppFilePath + ' 読み込みに失敗:', err);
  })

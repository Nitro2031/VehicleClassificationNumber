// CSVパース用の関数をCDN経由で読み込み
import { parseCSV2 } from "https://cdn.jsdelivr.net/gh/Nitro2031/Utilities@1.1.1/csvParser.min.js?v=20250927"
import { prefersColorScheme } from "./prefers-color-scheme.js";
const { createApp, ref, onMounted, onBeforeUnmount, computed } = Vue
const { createVuetify, useTheme } = Vuetify

const title = '自動車分類番号一覧'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: { light: { dark: false }, dark: { dark: true } },
    },
    icons: { defaultSet: 'mdi' }
})

createApp({
    setup() {
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
                const csvText = await fetch(`./${title}.csv`).then(r => r.text())
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
            loading,
            items,
            selectedCategory,
            tableHeight,
            toggleTheme,
            theme,
        }
    },
    template: `
    <v-app>
      <v-app-bar>
        <v-app-bar-title>
          <div style="display: flex; align-items: center; width: 100%;">
            <h1 style="font-size: medium;">${title}</h1>
            <v-spacer></v-spacer>
            <v-btn @click="toggleTheme" icon>
              <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
            </v-btn>
          </div>
        </v-app-bar-title>
      </v-app-bar>
      <v-main>
        <v-data-table
          :items="items"
          :loading="loading"
          :height="tableHeight + 'px'"
          dense
          hide-default-footer
          :items-per-page="-1"
          multi-sort
          fixed-header
          hover
          class="mb-4"
        ></v-data-table>
      </v-main>
      <a href="https://github.com/NITOH-Hisashi/AutomotiveShapes" target="_blank" rel="noopener noreferrer">自動車の用途等の区分について（依命通達）</a>
    </v-app>
  `
}).use(vuetify).mount('#app')

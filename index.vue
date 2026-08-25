<template>
    <v-app>
        <v-app-bar>
            <v-app-bar-title>
                <div style="display: flex; align-items: center; width: 100%;">
                    <a
                        :href="URL"
                        target="_blank"
                        rel="noopener noreferrer">
                        <h1 style="font-size: medium;">{{ title }}</h1>
                    </a>
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
                class="mb-4"></v-data-table>
        </v-main>
    </v-app>
</template>

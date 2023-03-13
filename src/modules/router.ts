import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    { path: '/', name:'Home', component: () => import('../views/Home.vue') },
    { path: '/game', name:'Game', component: () => import('../views/Game.vue') },
    { path: '/setup', name:"Setup", component: ()=> import('../views/Setup.vue')},
    { path: '/results', name:"Results", component: ()=> import('../views/Results.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;

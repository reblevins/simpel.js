import { Simpel } from '../simpel.js';
import { SimpelRouter } from '../simpel-router.js'
import './style.scss';
import { Auth, Amplify, API } from 'aws-amplify';

import aws_exports from './aws-exports.js';
Amplify.configure(aws_exports);

const posts = [
    {
        linkName: 'dolor-sit',
        title: 'Dolor sit',
        published: true,
        publishedAt: Date.now(),
        createdAt: null,
        updatedAt: null,
        content: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
    },
    {
        linkName: 'consectetur-adipisicing',
        title: 'Consectetur adipisicing',
        published: true,
        publishedAt: Date.now(),
        createdAt: null,
        updatedAt: null,
        content: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
    },
    {
        linkName: 'lorem-impsum',
        title: 'Lorem ipsum',
        published: true,
        publishedAt: Date.parse('20 Oct 2020 00:00:00 GMT'),
        createdAt: null,
        updatedAt: null,
        content: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
    }
];

var user;

async function signIn() {
    try {
        user = await Auth.signIn('reblevins', 'Jolanda_1');
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            await Auth.completeNewPassword(
                user,               // the Cognito User Object
                'Jolanda_1'
            ).then(user => {
                // at this time the user is logged in if no MFA required
                console.log(user);
            }).catch(e => {
                console.log(e);
            });
        } else {
            // other situations
        }
        await seedBlogPosts();
        getBlogPosts();
    } catch (err) { console.log({ err }); }
}

async function seedBlogPosts() {
    await posts.forEach(async (post, i) => {
        let myInit = {
            body: post
        };
        let response = await API.put('SimpleCMSAPI', '/posts', myInit);
        console.log(response);
    });
}

async function getBlogPosts() {
    try {
        let response = await API.get('SimpleCMSAPI', '/posts')
        console.log(response);
    } catch (err) {
        console.log(err);
    }

}

signIn();
// seedBlogPosts();
// getBlogPosts();

var App = require('./App.html');

new Simpel({
    template: App,
    apiName: 'SimpleCMSAPI',
    apiConfig: aws_exports,
    // api: 'https://1hc6wchzzd.execute-api.us-east-2.amazonaws.com',
    router: new SimpelRouter()
}).init()
